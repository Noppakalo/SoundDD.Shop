import type { Category } from '~/types/category'

const categoryCache = new Map<string, { success: boolean; data: Category[] }>()
const MAX_CACHE_SIZE = 50

const trimCache = () => {
    if (categoryCache.size > MAX_CACHE_SIZE) {
        const firstKey = categoryCache.keys().next().value
        if (firstKey) {
            categoryCache.delete(firstKey)
        }
    }
}

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
                trimCache()
                categoryCache.set(cacheKey, response)
                setTimeout(
                    () => {
                        categoryCache.delete(cacheKey)
                    },
                    1000 * 60 * 5
                )
            }
            return response
        } catch (error: any) {
            return { success: false, data: [] }
        }
    }

    return { getCategories }
}
