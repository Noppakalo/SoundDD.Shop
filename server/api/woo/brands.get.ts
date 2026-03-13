import type { Brands } from '~/types/brand'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const slug = query.slug || null

    const authHeader = buildWooAuth(config)

    try {
        const response = await $fetch<Brands[]>(
            `${config.public.wpUrl}/wp-json/wc/v3/products/brands`,
            {
                method: 'GET',
                headers: {
                    Authorization: authHeader,
                },
                query: {
                    slug: slug,
                    hide_empty: true,
                },
            }
        )
        return { success: true, data: response }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลแบรนด์ได้',
        })
    }
})
