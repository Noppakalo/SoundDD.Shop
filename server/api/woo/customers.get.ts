import type { Customer } from '~/types/customer'

const customerFileds = [
    'id',
    'email',
    'first_name',
    'last_name',
    'billing',
    'shipping',
    'avatar_url',
    'meta_data',
].join(',')

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const email = query.email as string

    if (!email) {
        throw createError({ statusCode: 400, statusMessage: 'กรุณาระบุ email' })
    }

    const auth = buildWpAuth(config)
    const wpUrl = config.public.wpUrl as string

    try {
        const customers = await $fetch<Customer[]>(
            `${wpUrl}/wp-json/wc/v3/customers`,
            {
                method: 'GET',
                headers: { Authorization: auth },
                query: { email, per_page: 1, _fields: customerFileds },
            }
        )

        if (!customers || customers.length === 0) {
            try {
                const created = await wooCreateCustomer({ email }, auth, wpUrl)
                return { success: true, data: created }
            } catch {
                return { success: false, data: null }
            }
        }

        return { success: true, data: customers[0] }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message || 'ไม่สามารถดึงข้อมูลลูกค้าได้',
        })
    }
})
