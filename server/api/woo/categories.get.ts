import type { Category } from '~/types/product'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const parentId = query.parent || null
    const includeId = query.include || null
    const slug = query.slug || null

    try {
        const response = await $fetch<Category[]>(
            `${config.public.wpUrl}/wp-json/wc/v3/products/categories`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${Buffer.from(`Oatzys:${config.wpAppPassword}`).toString('base64')}`,
                },
                query: {
                    parent: parentId,
                    include: includeId,
                    slug: slug,
                    hide_empty: true,
                },
            }
        )
        return { success: true, data: response }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้',
        })
    }
})
