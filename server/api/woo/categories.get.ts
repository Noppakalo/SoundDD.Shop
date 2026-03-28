import type { Category } from '~/types/category'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const slug = query.slug as string | undefined
    const page = query.page || 1
    const limit = query.limit || 12
    const parent = query.parent as string | undefined
    const include = query.include as string | undefined

    const authHeader = buildWooAuth(config)

    const categoryFields = [
        'id',
        'name',
        'slug',
        'parent',
        'description',
        'image',
        'count',
        'acf',
        'price_range',
    ].join(',')

    try {
        const fetchCategory = await $fetch<Category[]>(
            `${config.public.wpUrl}/wp-json/wc/v3/products/categories`,
            {
                method: 'GET',
                headers: {
                    Authorization: authHeader,
                },
                query: {
                    _fields: categoryFields,
                    slug: slug,
                    per_page: slug ? 1 : limit,
                    page: page,
                    parent: parent,
                    include: include,
                },
            }
        )

        const formatCategory = (category: any) => {
            return {
                ...category,
                price_range: category.price_range || { min: 0, max: 100000 },
                icon_category: category.acf?.icon_category || null,
            }
        }
        return {
            success: true,
            data: Array.isArray(fetchCategory)
                ? fetchCategory.map(formatCategory)
                : formatCategory(fetchCategory),
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message ||
                'ไม่สามารถดึงข้อมูลหมวดหมู่ได้',
        })
    }
})
