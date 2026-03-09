import type { Category } from '~/types/product'

const categoryCache = new Map<string, { success: boolean; data: Category[] }>();

export const useWooCategoriesApi = () => {
    const getCategories = async (params: any = {}) => {
        const cacheKey = JSON.stringify(params || {})
        if (categoryCache.has(cacheKey)) {
            return categoryCache.get(cacheKey)!
        }
        try {
            const response = await $fetch<{
                success: boolean
                data: Category[]
            }>('/api/woo/categories', {
                method: 'GET',
                query: params,
            })
            if (response.success && response.data) {
                categoryCache.set(cacheKey, response)
                setTimeout(() => {
                    categoryCache.delete(cacheKey)
                }, 1000 * 60 * 5)
            }
            return response
        } catch (error: any) {
            return { success: false, data: [] }
        }
    }

    return { getCategories }
}