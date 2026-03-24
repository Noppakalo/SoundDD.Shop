export default defineOAuthFacebookEventHandler({
    config: {
        scope: ['email', 'public_profile'],
        fields: ['id', 'name', 'email', 'picture.type(large)'],
        authorizationParams: {
            auth_type: 'rerequest',
            display: 'page',
        },
    },

    async onSuccess(event, { user, tokens }) {
        const config = useRuntimeConfig()
        const wpUrl = config.public.wpUrl as string

        // 1. ดึงข้อมูลจาก Facebook
        const facebookSub = user.id
        const fbEmail = user.email
        const fbName = user.name || ''
        const fbPicture = user.picture?.data?.url || ''

        // ตรวจสอบ Email ป้องกัน Error (Facebook บางเคสอาจไม่ส่ง Email มาถ้าผู้ใช้ไม่ได้ยืนยัน)
        if (!fbEmail) {
            const message = encodeURIComponent(
                'บัญชี Facebook ของคุณไม่ได้ให้ข้อมูลอีเมล หรืออีเมลยังไม่ได้ยืนยัน'
            )
            return sendRedirect(event, `/?auth=error&message=${message}`)
        }

        try {
            const authHeader = buildWooAuth(config)

            // 2. ค้นหา User ใน WooCommerce (ใช้ฟังก์ชันกลางที่แก้เรื่อง role: 'all' แล้ว)
            let wpUser = await wooFindCustomerByEmail(
                fbEmail,
                authHeader,
                wpUrl
            ).catch(() => null)

            if (wpUser) {
                const hasFacebookSub = wpUser.meta_data?.some(
                    (m: any) => m.key === 'facebook_customer_sub'
                )

                if (!hasFacebookSub) {
                    try {
                        await wooUpdateCustomer(
                            wpUser.id,
                            {
                                meta_data: [
                                    {
                                        key: 'facebook_customer_sub',
                                        value: facebookSub,
                                    },
                                ],
                            },
                            authHeader,
                            wpUrl
                        )
                    } catch (e) {
                        console.error(
                            '[Facebook Auth] Failed to update metadata'
                        )
                    }
                }
            } else {
                wpUser = await wooCreateCustomer(
                    {
                        email: fbEmail,
                        first_name: fbName.split(' ')[0] || fbName,
                        last_name: fbName.split(' ').slice(1).join(' ') || '',
                        username: fbEmail.split('@')[0] || 'fb_user',
                        password: Math.random().toString(36).slice(-12),
                        avatar_url: fbPicture,
                        meta_data: [
                            {
                                key: 'facebook_customer_sub',
                                value: facebookSub,
                            },
                        ],
                    },
                    authHeader,
                    wpUrl
                )
            }
            if (!wpUser) {
                throw new Error('ไม่สามารถระบุตัวตนหรือสร้างสมาชิกได้')
            }
            await setUserSession(event, {
                user: {
                    id: wpUser.id,
                    name: fbName,
                    email: fbEmail,
                    avatar: fbPicture || wpUser.avatar_url || '',
                },
                secure: {
                    token: tokens.access_token,
                    facebookSub: facebookSub,
                    provider: 'facebook',
                },
                loggedInAt: new Date().toISOString(),
            })

            return sendRedirect(event, '/?auth=success')
        } catch (error: any) {
            const errMsg =
                error.response?._data?.message ||
                'เกิดข้อผิดพลาดในการเชื่อมต่อระบบสมาชิก'
            return sendRedirect(
                event,
                `/?auth=error&message=${encodeURIComponent(errMsg)}`
            )
        }
    },

    onError(event, error: any) {
        const message = encodeURIComponent(
            'คุณได้ยกเลิกการเข้าสู่ระบบ หรือเกิดข้อผิดพลาดจาก Facebook'
        )
        return sendRedirect(event, `/?auth=error&message=${message}`)
    },
})
