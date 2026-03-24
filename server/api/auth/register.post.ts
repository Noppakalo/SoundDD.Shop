import type { Register, WpJwtResponse } from '~/types/auth'
import type { Customer } from '~/types/customer'

export default defineEventHandler(async (event) => {
    const body = await readBody<Register>(event)
    const config = useRuntimeConfig()
    const wpUrl = config.public.wpUrl

    try {
        const authHeader = buildWooAuth(config)
        const displayName = body.email?.split('@')[0] || 'user'
        const createCustomer = await $fetch<Customer>(
            `${wpUrl}/wp-json/wc/v3/customers`,
            {
                method: 'POST',
                headers: { Authorization: authHeader },
                body: {
                    email: body.email,
                    password: body.password,
                    username: displayName,
                },
            }
        )
        const authSession = await $fetch<WpJwtResponse>(
            `${wpUrl}/wp-json/jwt-auth/v1/token`,
            {
                method: 'POST',
                body: {
                    username: body.email,
                    password: body.password,
                },
            }
        ).catch(() => null)
        if (authSession?.token) {
            await setUserSession(event, {
                user: {
                    id: createCustomer.id,
                    name: displayName,
                    email: createCustomer.email,
                    avatar: createCustomer.avatar_url || '',
                },
                secure: { token: authSession.token },
                loggedInAt: new Date().toISOString(),
            })
        }

        return { success: true }
    } catch (error: any) {
        const wpError = error.response?._data
        let message = 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
        if (wpError?.code === 'registration-error-email-exists') {
            message =
                'อีเมล์์นี้ถูกใช้งานแล้ว กรุณาใช้อีเมล์์อื่นหรือเข้าสู่ระบบ'
        } else if (
            wpError?.code === 'woocommerce_rest_customer_invalid_email'
        ) {
            message = 'รูปแบบอีเมล์์ไม่ถูกต้อง'
        } else if (wpError?.message) {
            message = wpError.message.replace(/<[^>]*>?/gm, '')
        }

        throw createError({
            statusCode: error.response?.status || 400,
            statusMessage: message,
            data: {
                customMessage: message,
            },
        })
    }
})
