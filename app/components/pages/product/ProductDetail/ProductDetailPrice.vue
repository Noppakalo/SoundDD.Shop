<template>
    <div v-if="hasDisplayPrice" aria-live="polite">
        <div v-if="product.acf?.promotional_price" class="flex flex-col">
            <div class="flex items-baseline gap-4 text-gray-400">
                <p
                    v-if="
                        parseFloat(displayPriceData.regular) >
                        parseFloat(displayPriceData.sale)
                    "
                >
                    ราคาปกติ
                    <span class="line-through"
                        >฿{{ formatPrice(displayPriceData.regular) }}</span
                    >
                </p>
                <p
                    v-if="
                        parseFloat(product.acf?.promotional_price) >
                        parseFloat(displayPriceData.sale)
                    "
                    class="text-xl"
                >
                    ราคาโปรโมชันเดิม
                    <span class="line-through"
                        >฿{{
                            formatPrice(product.acf?.promotional_price)
                        }}</span
                    >
                </p>
            </div>
            <div class="flex items-baseline gap-2">
                <p class="text-error text-4xl font-bold">
                    ฿{{ formatPrice(displayPriceData.sale) }}
                </p>
                <p class="text-sm">รวม VAT 7% แล้ว</p>
            </div>
        </div>
        <div v-else class="flex items-baseline gap-4">
            <p
                v-if="
                    parseFloat(displayPriceData.regular) >
                    parseFloat(displayPriceData.sale)
                "
                class="text-xl text-gray-400 line-through"
            >
                ฿{{ formatPrice(displayPriceData.regular) }}
            </p>
            <div class="flex items-baseline gap-2">
                <p class="text-error text-4xl font-bold">
                    ฿{{ formatPrice(displayPriceData.sale) }}
                </p>
                <p class="text-sm">รวม VAT 7% แล้ว</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatPrice } from '~/utils/formatter'

const props = defineProps<{
    product: Product
    selectedVariation?: any
}>()

const { displayPriceData: basePriceData, hasDisplayPrice } = useProductPrice(
    () => props.product
)

const displayPriceData = computed(() => {
    if (props.selectedVariation) {
        return {
            sale:
                props.selectedVariation.sale_price ||
                props.selectedVariation.regular_price,
            regular: props.selectedVariation.regular_price,
        }
    }
    return basePriceData.value
})
</script>
