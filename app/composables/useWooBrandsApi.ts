import type { Brands } from '~/types/product'

const brandCache = new Map<string, { success: boolean; data: Brands[] }>();

export const useWooBrandsApi = () => {
    const getBrands = async (params: any = {}) => {
        const cacheKey = JSON.stringify(params || {})
        if (brandCache.has(cacheKey)) {
            return brandCache.get(cacheKey)!
        }
        try {
            const response = await $fetch<{ success: boolean; data: Brands[] }>(
                '/api/woo/brands',
                {
                    method: 'GET',
                    query: params,
                }
            )
            if (response.success && response.data) {
                brandCache.set(cacheKey, response)
                setTimeout(() => {
                    brandCache.delete(cacheKey)
                }, 1000 * 60 * 5)
            }
            return response
        } catch (error: any) {
            return { success: false, data: [] }
        }
    }
    return { getBrands }
}
