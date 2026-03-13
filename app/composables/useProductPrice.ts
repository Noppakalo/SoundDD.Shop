import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { Product } from '~/types/product'

export const useProductPrice = (productOrGetter: MaybeRefOrGetter<Product>) => {
    const displayPriceData = computed(() => {
        const product = toValue(productOrGetter)
        
        let regular = product.regular_price
        let sale = product.sale_price || product.regular_price
        let discount: number | null = null

        if (product.variations_data && product.variations_data.length > 0) {
            const variationsWithSummary = product.variations_data.map(v => {
                const hasSale = v.sale_price && parseFloat(v.regular_price) > parseFloat(v.sale_price);
                const dis = hasSale ? calculateDiscount(v.regular_price, v.sale_price) : 0;
                return { ...v, calculatedDiscount: dis }
            })
            
            let bestVariation = variationsWithSummary[0]
            for (const v of variationsWithSummary) {
                if (!bestVariation || v.calculatedDiscount > bestVariation.calculatedDiscount) {
                    bestVariation = v
                }
            }

            if (bestVariation) {
                regular = bestVariation.regular_price
                sale = bestVariation.sale_price || bestVariation.regular_price
                discount = bestVariation.calculatedDiscount > 0 ? bestVariation.calculatedDiscount : null
            }
        } else {
            if (product.sale_price && parseFloat(product.regular_price) > parseFloat(product.sale_price)) {
                discount = calculateDiscount(
                    product.regular_price, 
                    product.sale_price, 
                    product.acf?.promotional_price
                )
            }
        }

        return { regular, sale, discount }
    })

    const hasDisplayPrice = computed(() => {
        const price = displayPriceData.value.sale
        return typeof price === 'string' ? price.trim() !== '' : price != null
    })

    return {
        displayPriceData,
        hasDisplayPrice
    }
}
