import type { RegisterResponse, Register } from '~/types/auth'
import { processingQueue, completedJobs } from '../../utils/registrationQueue'

async function processRegistration(
    jobId: string,
    data: { email: string; password: string; name: string },
    config: any
) {
    const { email, password, name } = data
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
            processingQueue.delete(jobId)
            completedJobs.set(jobId, { success: true, data: response })
            return { success: true, data: response }
        } catch (error: any) {
            const errorCode = error.response?._data?.code

            if (errorCode === 'registration-error-email-exists') {
                console.log(`[Register] Email already exists: ${email}`)
                processingQueue.delete(jobId)
                completedJobs.set(jobId, {
                    success: false,
                    error: 'email_exists',
                })
                return { success: false, error: 'email_exists' }
            }

            if (
                errorCode === 'existing_user_login' &&
                attempts < maxAttempts - 1
            ) {
                username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`
                attempts++
                continue
            }

            console.error(
                `[Register] Failed for ${email}:`,
                error.response?._data || error.message
            )
            processingQueue.delete(jobId)
            const errorMessage =
                error.response?._data?.message || 'Registration failed'
            completedJobs.set(jobId, { success: false, error: errorMessage })
            return {
                success: false,
                error: errorMessage,
            }
        }
    }
}

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'รูปแบบอีเมลไม่ถูกต้อง',
        })
    }

    const jobId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    processingQueue.set(jobId, {
        email,
        password,
        name: name || '',
        timestamp: Date.now(),
    })

    const response = {
        success: true,
        message: 'กำลังสร้างบัญชีให้คุณ...',
        jobId,
    }

    setImmediate(async () => {
        try {
            await processRegistration(
                jobId,
                { email, password, name: name || '' },
                config
            )
        } catch (err) {
            console.error('[Background Process] Error:', err)
        }
    })

    return response
})
