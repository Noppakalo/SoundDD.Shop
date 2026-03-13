import type { Order } from '~/types/customer'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const customerId = query.customer as string

    if (!customerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'กรุณาระบุ customer id',
        })
    }

    const authHeader = buildWooAuth(config)

    try {
        const response = await $fetch<Order[]>(
            `${config.public.wpUrl}/wp-json/wc/v3/orders`,
            {
                headers: { Authorization: authHeader },
                query: {
                    customer: customerId,
                    per_page: 20,
                    orderby: 'date',
                    order: 'desc',
                    _fields:
                        'id,status,currency_symbol,date_created,total,line_items,billing,shipping',
                },
            }
        )

        return { success: true, data: response }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message ||
                'ไม่สามารถดึงรายการคำสั่งซื้อได้',
        })
    }
})
