import type { WpJwtResponse, Login } from '~/types/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<Login>(event)
    const config = useRuntimeConfig()

    try {
        const response = await $fetch<WpJwtResponse>(
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

        const authHeader = buildWooAuth(config)
        const wpUrl = config.public.wpUrl as string
        const wpUser = await wooFindCustomerByEmail(
            response.user_email,
            authHeader,
            wpUrl
        ).catch(() => null)

        const socialAvatar = wpUser?.meta_data?.find(
            (m: any) => m.key === 'social_avatar_url'
        )?.value
        const avatar = socialAvatar || wpUser?.avatar_url || ''

        await setUserSession(event, {
            user: {
                name: response.user_display_name,
                email: response.user_email,
                nicename: response.user_nicename,
                avatar: avatar,
            },
            secure: {
                token: response.token,
            },
            loggedInAt: new Date().toISOString(),
        })

        return {
            success: true,
            user: {
                name: response.user_display_name,
                email: response.user_email,
                nicename: response.user_nicename,
                avatar: avatar,
            },
        }
    } catch (error: any) {
        console.error('Login Error:', error.response?._data || error.message)

        const statusCode = error.response?.status || 401
        const message =
            error.response?._data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'

        throw createError({
            statusCode: statusCode,
            statusMessage: message,
        })
    }
})
