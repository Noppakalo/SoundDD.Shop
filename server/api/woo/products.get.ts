import type { Product } from '~/types/product'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const slug = query.slug as string | undefined
    const page = query.page || 1
    const limit = query.limit || 16
    const categoryId = query.category || null
    const search = query.search || null
    const stockStatus = query.stock_status || undefined
    const include = query.include as string | undefined
    const minPrice = query.min_price as string | undefined
    const maxPrice = query.max_price as string | undefined
    const brandIds = query.brand as string | undefined
    const orderby = (query.orderby as string) || 'date'
    const order = (query.order as string) || 'desc'

    const productCardFields = [
        'id',
        'name',
        'slug',
        'sale_price',
        'regular_price',
        'date_on_sale_from',
        'date_on_sale_to',
        'on_sale',
        'brands',
        'images',
        'stock_status',
        'acf',
        'variations_data',
    ].join(',')

    const productDetailFields = [
        'id',
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'sale_price',
        'regular_price',
        'date_on_sale_from',
        'date_on_sale_to',
        'on_sale',
        'categories',
        'brands',
        'tags',
        'images',
        'stock_status',
        'acf',
        'variations_data',
    ].join(',')

    const fields = slug ? productDetailFields : productCardFields
    const wooAuthHeader = buildWooAuth(config)
    try {
        const fetchProducts = (authHeader: string) =>
            $fetch<Product[]>(`${config.public.wpUrl}/wp-json/wc/v3/products`, {
                method: 'GET',
                headers: { Authorization: authHeader },
                query: {
                    _fields: fields,
                    slug: slug,
                    per_page: slug ? 1 : limit,
                    page: page,
                    category: categoryId,
                    search: search,
                    status: 'publish',
                    orderby: orderby,
                    order: order,
                    stock_status: stockStatus,
                    include: include,
                    min_price: minPrice,
                    max_price: maxPrice,
                    brand: brandIds,
                },
            })

        const response = await fetchProducts(wooAuthHeader)

        if (slug) {
            const firstProduct = response[0]
            return {
                success: true,
                data: firstProduct || null,
            }
        }

        return {
            success: true,
            data: response,
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message || 'ไม่สามารถดึงข้อมูลสินค้าได้',
        })
    }
})
