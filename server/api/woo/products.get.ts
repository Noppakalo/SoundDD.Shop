import type { Product } from '~/types/product'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const slug = query.slug as string | undefined
    const page = query.page || 1
    const limit = query.limit || 12
    const categoryId = query.category || null
    const search = query.search || null
    const stockStatus = query.stock_status || undefined
    const include = query.include as string | undefined

    const productCardFields = [
        'id',
        'name',
        'slug',
        'price',
        'regular_price',
        'sale_price',
        'on_sale',
        'brands',
        'images',
        'stock_status',
        'meta_data',
    ].join(',')

    const productDetailFields = [
        'id',
        'name',
        'slug',
        'permalink',
        'description',
        'short_description',
        'sku',
        'price',
        'regular_price',
        'sale_price',
        'on_sale',
        'weight',
        'dimensions',
        'categories',
        'brands',
        'tags',
        'images',
        'attributes',
        'related_ids',
        'stock_status',
        'meta_data',
    ].join(',')

    const fields = slug ? productDetailFields : productCardFields
    const auth = btoa(`Oatzys:${config.wpAppPassword}`)

    try {
        const response = await $fetch<Product[]>(
            `${config.public.wpUrl}/wp-json/wc/v3/products`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Basic ${auth}`,
                },
                query: {
                    _fields: fields,
                    slug: slug,
                    per_page: slug ? 1 : limit,
                    page: page,
                    category: categoryId,
                    search: search,
                    status: 'publish',
                    orderby: 'date',
                    order: 'desc',
                    stock_status: stockStatus,
                    include: include,
                },
            }
        )

        const formatProduct = (product: Product) => {
            const promoPriceMeta = product.meta_data?.find(
                (meta) => meta.key === 'promotional_price'
            )
            return {
                ...product,
                promotional_price: promoPriceMeta ? promoPriceMeta.value : null,
            }
        }

        if (slug) {
            const firstProduct = response[0]
            return {
                success: true,
                data: firstProduct ? formatProduct(firstProduct) : null,
            }
        }

        return {
            success: true,
            data: response.map(formatProduct),
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message || 'ไม่สามารถดึงข้อมูลสินค้าได้',
        })
    }
})
