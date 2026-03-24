import type { Register, WpJwtResponse } from '~/types/auth'
import type { Customer } from '~/types/customer'

export default defineEventHandler(async (event) => {
    const body = await readBody<Register>(event)
    const config = useRuntimeConfig()

    try {
        const authHeader = buildWooAuth(config)
        const displayName = body.email?.split('@')[0] || ''

        const createCustomer = await $fetch<Customer>(
            `${config.public.wpUrl}/wp-json/wc/v3/customers`,
            {
                method: 'POST',
                headers: {
                    Authorization: authHeader,
                },
                body: {
                    email: body.email,
                    password: body.password,
                    username: displayName,
                    first_name: displayName,
                },
            }
        )

        const authSession = await $fetch<WpJwtResponse>(
            `${config.public.wpUrl}/wp-json/jwt-auth/v1/token`,
            {
                method: 'POST',
                body: {
                    username: body.email,
                    password: body.password,
                },
            }
        ).catch((e) => {
            return null
        })

        if (authSession?.token) {
            await setUserSession(event, {
                user: {
                    id: createCustomer.id,
                    name: displayName,
                    email: createCustomer.email,
                    avatar: createCustomer.avatar_url || '',
                },
                secure: {
                    token: authSession.token,
                },
                loggedInAt: new Date().toISOString(),
            })
        }
        return {
            success: true,
            user: {
                id: createCustomer.id,
                name: displayName,
                email: createCustomer.email,
            },
            token: authSession?.token || null,
        }
    } catch (error: any) {
        const wpError = error.response?._data
        let message = 'เกิดข้อผิดพลาดในการสมัครสมาชิก'

        if (wpError?.code === 'registration-error-email-exists') {
            message = 'อีเมล์นี้มีผู้ใช้งานแล้ว กรุณาใช้อีเมล์อื่นในการสมัคร'
        } else if (wpError?.message) {
            message = wpError.message.replace(/<[^>]*>?/gm, '')
        }

        throw createError({
            statusCode: error.response?.status || 500,
            message: message,
        })
    }
})
