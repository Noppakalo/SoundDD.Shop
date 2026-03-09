import type { Product } from '~/types/product'

const productCache = new Map<string, { success: boolean; data: Product[] }>();

export const useWooProductApi = () => {
    const getProducts = async (params: any = {}) => {
        const cacheKey = JSON.stringify(params || {})
        if (productCache.has(cacheKey)) {
            return productCache.get(cacheKey)!
        }

        try {
            const response = await $fetch<{
                success: boolean
                data: Product[]
            }>('/api/woo/products', {
                method: 'GET',
                query: params,
            })
            if (response.success && response.data) {
                productCache.set(cacheKey, response)
                setTimeout(() => {
                    productCache.delete(cacheKey)
                }, 1000 * 60 * 5)
            }
            return response
        } catch (error: any) {
            return { success: false, data: [] }
        }
    }

    return { getProducts }
}
