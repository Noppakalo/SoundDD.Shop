import type { RegisterResponse, Register } from '~/types/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<any>(event)
    const config = useRuntimeConfig()
    const authHeader = `Basic ${Buffer.from(`Oatzys:${config.wpAppPassword}`).toString('base64')}`

    try {
        const existingCustomers = await $fetch<any[]>(
            `${config.public.wpUrl}/wp-json/wc/v3/customers`,
            {
                headers: { Authorization: authHeader },
                query: {
                    email: body.email,
                },
            }
        )

        const isEmailTaken = existingCustomers.find(
            (u) => u.email.toLowerCase() === body.email.toLowerCase()
        )
        if (isEmailTaken) {
            throw createError({
                statusCode: 409,
                statusMessage:
                    'อีเมลนี้ถูกใช้งานแล้ว คุณสามารถเข้าสู่ระบบได้ทันที',
            })
        }
    } catch (error: any) {
        if (error.statusCode === 409) throw error
    }

    let username = body.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
        try {
            const nameParts = (body.name || '').split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''
            const response = await $fetch<RegisterResponse>(
                `${config.public.wpUrl}/wp-json/wc/v3/customers`,
                {
                    method: 'POST',
                    headers: { Authorization: authHeader },
                    body: {
                        username: username,
                        email: body.email,
                        password: body.password,
                        first_name: firstName,
                        last_name: lastName,
                    },
                }
            )
            return { success: true, data: response }
        } catch (error: any) {
            const errorCode = error.response?._data?.code

            if (
                errorCode === 'existing_user_login' &&
                attempts < maxAttempts - 1
            ) {
                username = `${body.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '')}${Math.floor(Math.random() * 10000)}`
                attempts++
                continue
            }

            throw createError({
                statusCode: error.response?.status || 500,
                statusMessage:
                    error.response?._data?.message || 'สมัครสมาชิกไม่สำเร็จ',
            })
        }
    }
})
