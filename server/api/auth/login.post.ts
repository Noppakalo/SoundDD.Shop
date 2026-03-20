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

        const sessionData: any = {
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
        }

        const sessionOptions = {
            maxAge: body.remember ? config.session.cookie.maxAge : (60 * 60 * 24)
        }

        await setUserSession(event, sessionData, sessionOptions)

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
        const statusCode = error.response?.status || 401
        let message =
            error.response?._data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        message = message.replace(/(<([^>]+)>)/gi, '')

        if (
            error.response?._data?.code === 'application_password_invalid' ||
            message.toLowerCase().includes('application password') ||
            error.response?._data?.code === 'incorrect_password' ||
            message.toLowerCase().includes('incorrect password') ||
            message.toLowerCase().includes('invalid username') ||
            message.toLowerCase().includes('unknown email address')
        ) {
            message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        }

        throw createError({
            statusCode: statusCode,
            statusMessage: message,
        })
    }
})
