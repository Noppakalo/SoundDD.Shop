import type { WpJwtResponse, Login } from '~/types/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<Login>(event)
    const config = useRuntimeConfig()

    try {
        const response = await $fetch<WpJwtResponse>(
            `${config.public.wpUrl}/wp-json/jwt-auth/v1/token`,
            {
                method: 'POST',
                body: {
                    username: body.email,
                    password: body.password,
                },
            }
        )

        await setUserSession(event, {
            user: {
                name: response.user_display_name,
                email: response.user_email,
                nicename: response.user_nicename,
            },
            secure: {
                token: response.token,
            },
        })

        return {
            success: true,
            user: {
                name: response.user_display_name,
                email: response.user_email,
                nicename: response.user_nicename,
            },
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 401,
            statusMessage:
                error.response?._data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        })
    }
})
