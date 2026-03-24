export default defineOAuthGoogleEventHandler({
    config: {
        scope: ['email', 'openid', 'profile'],
        authorizationParams: {
            access_type: 'offline',
            prompt: 'select_account consent',
        },
    },
    async onSuccess(event, { user, tokens }) {
        const config = useRuntimeConfig()
        const wpUrl = config.public.wpUrl as string

        const googleSub = user.sub
        const googleEmail = user.email
        const googleName = user.given_name || ''
        const googleLastName = user.family_name || ''
        const googlePicture = user.picture || ''

        if (!googleEmail) {
            const message = encodeURIComponent(
                'บัญชี Google ของคุณไม่ได้ให้ข้อมูลอีเมล์ กรุณาตรวจสอบการตั้งค่าความเป็นส่วนตัว'
            )
            return sendRedirect(event, `/?auth=error&message=${message}`)
        }

        try {
            const authHeader = buildWooAuth(config)

            let wpUser = await wooFindCustomerByEmail(
                googleEmail,
                authHeader,
                wpUrl
            ).catch((err) => {
                return null
            })

            if (wpUser) {
                const hasGoogleSub = wpUser.meta_data?.some(
                    (m: any) => m.key === 'google_customer_sub'
                )

                if (!hasGoogleSub) {
                    try {
                        await wooUpdateCustomer(
                            wpUser.id,
                            {
                                meta_data: [
                                    {
                                        key: 'google_customer_sub',
                                        value: googleSub,
                                    },
                                ],
                            },
                            authHeader,
                            wpUrl
                        )
                    } catch (e) {
                        console.error('[Google Auth] Failed to update metadata')
                    }
                }
            } else {
                wpUser = await wooCreateCustomer(
                    {
                        email: googleEmail,
                        first_name: googleName,
                        last_name: googleLastName,
                        username: googleEmail.split('@')[0] || 'user',
                        password: Math.random().toString(36).slice(-12),
                        avatar_url: googlePicture,
                        meta_data: [
                            { key: 'google_customer_sub', value: googleSub },
                        ],
                    },
                    authHeader,
                    wpUrl
                )
            }
            if (!wpUser) {
                throw createError({
                    statusCode: 500,
                    statusMessage:
                        'ไม่สามารถระบุตัวตนหรือสร้างบัญชีสมาชิกได้ในขณะนี้',
                })
            }
            await setUserSession(event, {
                user: {
                    id: wpUser.id,
                    name:
                        `${googleName} ${googleLastName}`.trim() || googleEmail,
                    email: googleEmail,
                    avatar: googlePicture || wpUser.avatar_url || '',
                },
                secure: {
                    token: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    googleSub: googleSub,
                    provider: 'google',
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
            'คุณได้ยกเลิกการเข้าสู่ระบบ หรือเกิดข้อผิดพลาดจาก Google'
        )
        return sendRedirect(event, `/?auth=error&message=${message}`)
    },
})
