import type { WpJwtResponse, Login } from '~/types/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<Login>(event)
    const config = useRuntimeConfig()

    try {
        const authSession = await $fetch<WpJwtResponse>(
            `${config.public.wpUrl}/wp-json/jwt-auth/v1/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    username: body.email,
                    password: body.password,
                },
            }
        )
        if (authSession.token) {
            const wooAuth = buildWooAuth(config)
            const customer = await wooFindCustomerByEmail(
                authSession.user_email,
                wooAuth,
                config.public.wpUrl
            )
            const avatar = customer?.avatar_url || ''

            await setUserSession(
                event,
                {
                    user: {
                        id: authSession.user_id,
                        name: authSession.user_nicename,
                        email: authSession.user_email,
                        avatar,
                    },
                    secure: {
                        token: authSession.token,
                    },
                    loggedInAt: new Date().toISOString(),
                },
                {
                    maxAge: body.remember
                        ? config.session.cookie.maxAge
                        : 60 * 60 * 24,
                }
            )
        }
        const wooAuth = buildWooAuth(config)
        const customer = await wooFindCustomerByEmail(
            authSession.user_email,
            wooAuth,
            config.public.wpUrl
        )

        return {
            success: true,
            user: {
                id: authSession.user_id,
                name: authSession.user_nicename,
                email: authSession.user_email,
                avatar: customer?.avatar_url || '',
            },
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            message: 'อีเมล์หรือรหัสผ่านไม่ถูกต้อง',
        })
    }
})
