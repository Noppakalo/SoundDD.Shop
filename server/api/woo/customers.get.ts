export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const email = query.email as string

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุ email' })
    }

    const authHeader = buildWooAuth(config)
    const wpUrl = config.public.wpUrl as string

    try {
        const existingCustomer = await wooFindCustomerByEmail(
            email,
            authHeader,
            wpUrl
        )

        if (existingCustomer) {
            return { success: true, data: existingCustomer }
        }

        try {
            const payload = {
                email: email,
                username:
                    (email?.split('@')[0] ?? 'user') +
                    Math.floor(Math.random() * 1000),
                password: Math.random().toString(36).slice(-12),
            }

            const created = await wooCreateCustomer(payload, authHeader, wpUrl)
            return { success: true, data: created }
        } catch (createError: any) {
            return {
                success: false,
                data: null,
                message:
                    createError.response?._data?.message ||
                    'ไม่สามารถสร้างบัญชีใหม่ได้',
            }
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message || 'ไม่สามารถดึงข้อมูลลูกค้าได้',
        })
    }
})
