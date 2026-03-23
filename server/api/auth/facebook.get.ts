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
        const facebookSub = user.id
        const fbEmail = user.email
        const fbName = user.name || ''
        const fbPicture = user.picture?.data?.url || ''

        try {
            const authHeader = buildWooAuth(config)
            const users = await $fetch<any[]>(
                `${config.public.wpUrl}/wp-json/wc/v3/customers`,
                {
                    headers: { Authorization: authHeader },
                    query: { email: fbEmail },
                }
            )

            let wpUser: any
            if (users.length > 0) {
                wpUser = users[0]
                const hasFacebookSub = wpUser.meta_data?.some(
                    (m: any) => m.key === 'facebook_customer_sub'
                )

                if (!hasFacebookSub) {
                    try {
                        await $fetch(
                            `${config.public.wpUrl}/wp-json/wc/v3/customers/${wpUser.id}`,
                            {
                                method: 'PUT',
                                headers: { Authorization: authHeader },
                                body: {
                                    meta_data: [
                                        {
                                            key: 'facebook_customer_sub',
                                            value: facebookSub,
                                        },
                                    ],
                                },
                            }
                        )
                    } catch (e) {
                        console.error(
                            '[Facebook Auth] Failed to update metadata:'
                        )
                    }
                } else {
                    const randomPass = Math.random().toString(36).slice(-12)
                    wpUser = await $fetch(
                        `${config.public.wpUrl}/wp-json/wc/v3/customers`,
                        {
                            method: 'POST',
                            headers: { Authorization: authHeader },
                            body: {
                                email: fbEmail,
                                first_name: fbName.split(' ')[0] || fbName,
                                last_name:
                                    fbName.split(' ').slice(1).join(' ') || '',
                                username:
                                    fbEmail.split('@')[0] +
                                    Math.floor(Math.random() * 1000),
                                password: randomPass,
                                avatar_url: fbPicture,
                                meta_data: [
                                    {
                                        key: 'facebook_customer_sub',
                                        value: facebookSub,
                                    },
                                ],
                            },
                        }
                    )
                }
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
                    refreshToken: tokens.refresh_token,
                    facebookSub: facebookSub,
                    provider: 'facebook',
                },
                loggedInAt: new Date().toISOString(),
            })
            return sendRedirect(event, '/?auth=success')
        } catch (error: any) {
            const message = encodeURIComponent(
                error.statusMessage ||
                    'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่'
            )
            return sendRedirect(event, `/?auth=error&message=${message}`)
        }
    },

    onError(event, error: any) {
        const message = encodeURIComponent(
            error.statusMessage ||
                'คุณได้ยกเลิกการเข้าสู่ระบบ หรือเกิดข้อผิดพลาดจาก Facebook'
        )
        return sendRedirect(event, `/?auth=error&message=${message}`)
    },
})
