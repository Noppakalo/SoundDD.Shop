export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const {
        id,
        first_name,
        last_name,
        phone,
        billing,
        shipping,
        meta_data,
        birth_date,
        customer_type,
        tax_id,
        wishlist,
        cart,
    } = body

    if (!id)
        throw createError({
            statusCode: 400,
            statusMessage: 'กรุณาระบุ Customer ID',
        })

    const payload: any = {}
    if (first_name) payload.first_name = first_name
    if (last_name) payload.last_name = last_name
    if (billing || phone) {
        payload.billing = { ...(billing || {}) }
        if (phone) payload.billing.phone = phone
    }
    if (shipping || phone) {
        payload.shipping = { ...(shipping || {}) }
        if (phone) payload.shipping.phone = phone
    }

    const meta_data_to_send = Array.isArray(meta_data) ? [...meta_data] : []
    const upsertMeta = (key: string, value: any) => {
        if (value === undefined) return

        const idx = meta_data_to_send.findIndex((m) => m.key === key)
        if (idx > -1) {
            meta_data_to_send[idx].value = value
        } else {
            meta_data_to_send.push({ key, value })
        }
    }

    upsertMeta('birth_date', birth_date)
    upsertMeta('customer_type', customer_type)
    upsertMeta('tax_id', tax_id)
    upsertMeta('wishlist', wishlist)
    upsertMeta('cart', cart)


    if (meta_data_to_send.length > 0) payload.meta_data = meta_data_to_send

    try {
        const response = await wooUpdateCustomer(
            id,
            payload,
            buildWooAuth(config),
            config.public.wpUrl as string
        )
        return { success: true, data: response, message: null }
    } catch (error: any) {
        const errData =
            error?.data || error?.response?.data || error?.response?._data
        const status =
            error?.statusCode || error?.response?.status || errData?.status
        const code = errData?.code

        if (code === 'woocommerce_rest_cannot_edit' || status === 401) {
            try {
                const retryResp = await wooUpdateCustomer(
                    id,
                    payload,
                    buildWpAuth(config),
                    config.public.wpUrl as string
                )
                return { success: true, data: retryResp, message: null }
            } catch (err2: any) {
                const err2Data =
                    err2?.data || err2?.response?.data || err2?.response?._data
                throw createError({
                    statusCode:
                        err2?.statusCode || err2?.response?.status || 500,
                    statusMessage:
                        err2Data?.message ||
                        err2?.message ||
                        'ไม่สามารถแก้ไขข้อมูลลูกค้าได้',
                })
            }
        }

        throw createError({
            statusCode: status || 500,
            statusMessage:
                errData?.message ||
                error?.message ||
                'ไม่สามารถแก้ไขข้อมูลลูกค้าได้',
        })
    }
})
