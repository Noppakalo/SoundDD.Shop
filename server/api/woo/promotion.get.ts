import type { PromotionCarousel } from '~/types/promotion'

export default defineEventHandler(async () => {
    const config = useRuntimeConfig()

    const promotionFields = ['id', 'acf'].join(',')

    try {
        const fetchPromotions = await $fetch<PromotionCarousel[]>(
            `${config.public.wpUrl}/wp-json/wp/v2/promotion-carousel`,
            {
                method: 'GET',
                query: { _fields: promotionFields },
            }
        )

        return { success: true, data: fetchPromotions }
    } catch (error: any) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage:
                error.response?._data?.message || 'ไม่สามารถดึงรูปโปรโมชั่นได้',
        })
    }
})
