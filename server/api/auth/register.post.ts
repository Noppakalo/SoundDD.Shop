import type { RegisterResponse, Register } from '~/types/auth'

export default defineEventHandler(async (event) => {
    const body = await readBody<Register>(event)
    const config = useRuntimeConfig()
    const { email, password, name } = body || {}
    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        })
    }

    const appPassword = config.wpAppPassword?.replace(/\s+/g, '') || ''
    const wpUsername = config.wpAppUsername || 'Oatzys'
    const authHeader = `Basic ${Buffer.from(`${wpUsername}:${appPassword}`).toString('base64')}`

    const baseUsername =
        email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') || ''
    let username = baseUsername
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
        try {
            const nameParts = (name || '').trim().split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''

            const response = await $fetch<RegisterResponse>(
                `${config.public.wpUrl}/wp-json/wc/v3/customers`,
                {
                    method: 'POST',
                    headers: { Authorization: authHeader },
                    body: {
                        username: username,
                        email: email,
                        password: password,
                        first_name: firstName,
                        last_name: lastName,
                    },
                }
            )
            return { success: true, data: response }
        } catch (error: any) {
            const errorCode = error.response?._data?.code

            if (errorCode === 'registration-error-email-exists') {
                throw createError({
                    statusCode: 409,
                    statusMessage:
                        'อีเมลนี้ถูกใช้งานแล้ว กรุณาลองใหม่อีกครั้ง',
                })
            }

            if (
                errorCode === 'existing_user_login' &&
                attempts < maxAttempts - 1
            ) {
                username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`
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
