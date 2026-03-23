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
        const googleSub = user.sub
        const googleEmail = user.email
        const googleName = user.given_name
        const googleLastName = user.family_name
        const googlePicture = user.picture

        try {
            const authHeader = buildWooAuth(config)
            const users = await $fetch<any[]>(
                `${config.public.wpUrl}/wp-json/wc/v3/customers`,
                {
                    headers: { Authorization: authHeader },
                    query: { email: googleEmail },
                }
            )

            let wpUser: any
            if (users.length > 0) {
                wpUser = users[0]
                const hasGoogleSub = wpUser.meta_data?.some(
                    (m: any) => m.key === 'google_customer_sub'
                )

                if (!hasGoogleSub) {
                    try {
                        await $fetch(
                            `${config.public.wpUrl}/wp-json/wc/v3/customers/${wpUser.id}`,
                            {
                                method: 'PUT',
                                headers: { Authorization: authHeader },
                                body: {
                                    meta_data: [
                                        {
                                            key: 'google_customer_sub',
                                            value: googleSub,
                                        },
                                    ],
                                },
                            }
                        )
                    } catch (e) {
                        console.error(
                            '[Google Auth] Failed to update metadata:',
                            e
                        )
                    }
                }
            } else {
                const randomPass = Math.random().toString(36).slice(-12)
                wpUser = await $fetch(
                    `${config.public.wpUrl}/wp-json/wc/v3/customers`,
                    {
                        method: 'POST',
                        headers: { Authorization: authHeader },
                        body: {
                            email: googleEmail,
                            first_name: googleName,
                            last_name: googleLastName,
                            username:
                                googleEmail.split('@')[0] +
                                Math.floor(Math.random() * 1000),
                            password: randomPass,
                            avatar_url: googlePicture,
                            meta_data: [
                                {
                                    key: 'google_customer_sub',
                                    value: googleSub,
                                },
                            ],
                        },
                    }
                )
            }

            await setUserSession(event, {
                user: {
                    id: wpUser.id,
                    name: `${googleName} ${googleLastName}`.trim(),
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
            const message = encodeURIComponent(
                error.statusMessage || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            )
            return sendRedirect(event, `/?auth=error&message=${message}`)
        }
    },

    onError(event, error: any) {
        const message = encodeURIComponent(
            error.statusMessage ||
                'คุณได้ยกเลิกการเข้าสู่ระบบ หรือเกิดข้อผิดพลาดจาก Google'
        )
        return sendRedirect(event, `/?auth=error&message=${message}`)
    },
})
