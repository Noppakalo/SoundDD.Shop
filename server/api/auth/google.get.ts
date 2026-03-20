export default defineOAuthGoogleEventHandler({
    config: {
        authorizationParams: {
            prompt: 'select_account',
        },
    },
    async onSuccess(event, { user }) {
        const config = useRuntimeConfig(event)
        const { email, name, picture, sub } = user

        if (!email) {
            const message = encodeURIComponent(
                'ไม่พบที่อยู่อีเมลในบัญชี Google ของคุณ'
            )
            return sendRedirect(event, `/?auth=error&message=${message}`)
        }

        try {
            const authHeader = buildWooAuth(config)
            const wpUrl = config.public.wpUrl as string
            const socialPassword = `${sub}${config.wpAppPassword}`

            let wpUser = await wooFindCustomerByEmail(
                email,
                authHeader,
                wpUrl
            ).catch((err: unknown) => {
                console.error('WC Customer Search Error:', err)
                return null
            })

            if (wpUser) {
                const currentAvatar = wpUser.meta_data?.find(
                    (m: any) => m.key === 'social_avatar_url'
                )?.value

                if (currentAvatar !== picture) {
                    await wooUpdateCustomer(
                        wpUser.id,
                        {
                            meta_data: [
                                { key: 'social_avatar_url', value: picture },
                            ],
                        },
                        authHeader,
                        wpUrl
                    ).catch((err: unknown) =>
                        console.error('Failed to sync avatar:', err)
                    )
                }
            } else {
                const nameParts = (name || '').split(' ')
                const firstName = nameParts[0] || ''
                const lastName = nameParts.slice(1).join(' ') || ''
                const safeUsername = email.split('@')[0]

                try {
                    console.log('[Google] Creating customer for:', email)
                    wpUser = await wooCreateCustomer(
                        {
                            username: safeUsername,
                            email,
                            password: socialPassword,
                            first_name: firstName,
                            last_name: lastName,
                            meta_data: [
                                { key: 'social_avatar_url', value: picture },
                            ],
                        },
                        authHeader,
                        wpUrl
                    )
                    console.log('[Google] Customer created:', wpUser?.id)
                } catch (error: any) {
                    console.error('[Google] Create customer failed:', error)
                    throw createError({
                        statusCode: 500,
                        statusMessage: `สร้างบัญชีไม่สำเร็จ: ${error.data?.message || error.message || 'Unknown Error'}`,
                    })
                }
            }

            const fullName =
                wpUser?.first_name && wpUser?.last_name
                    ? `${wpUser.first_name} ${wpUser.last_name}`.trim()
                    : wpUser?.first_name || name

            await setUserSession(event, {
                user: {
                    name: fullName,
                    email: wpUser.email || email,
                    avatar: picture,
                    nicename: wpUser.username || email.split('@')[0],
                },
                secure: {
                    provider: 'google',
                },
                loggedInAt: new Date().toISOString(),
            })

            return sendRedirect(event, '/?auth=success')
        } catch (error: any) {
            const message = encodeURIComponent(
                error.statusMessage || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            )
            return sendRedirect(event, `/?auth=error&message=${message}`)
        }
    },

    onError(event, error) {
        const message = encodeURIComponent(
            'คุณได้ยกเลิกการเข้าสู่ระบบ หรือเกิดข้อผิดพลาดจาก Google'
        )
        return sendRedirect(event, `/?auth=error&message=${message}`)
    },
})
