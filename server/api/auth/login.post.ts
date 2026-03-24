import type { WpJwtResponse, Login } from '~/types/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<Login>(event)
    const config = useRuntimeConfig()
    const wpUrl = config.public.wpUrl

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
        const wpError = error.response?._data
        let message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        if (
            wpError?.code === '[jwt_auth] invalid_username' ||
            wpError?.code === '[jwt_auth] incorrect_password'
        ) {
            message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        } else if (wpError?.message) {
            message = wpError.message.replace(/<[^>]*>?/gm, '')
        }

        throw createError({
            statusCode:
                error.response?.status === 403
                    ? 401
                    : error.response?.status || 400,
            statusMessage: message,
            data: { message },
        })
    }
})
