<template>
    <div
        class="group hover:shadow-primary/20 relative flex h-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform"
        :class="viewMode === 'list' ? 'flex-row items-center' : 'flex-col'"
    >
        <ProductCardImage
            :product="product"
            :view-mode="viewMode"
            @select-variation="selectedVariation = $event"
        />

        <ProductCardInfo
            :product="product"
            :view-mode="viewMode"
            :active-price="activePrice"
        />
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = withDefaults(
    defineProps<{
        product: Product
        viewMode?: 'grid' | 'list'
    }>(),
    { viewMode: 'grid' }
)

const selectedVariation = ref<any>(null)
const activePrice = computed(() => {
    if (selectedVariation.value) {
        return {
            id: selectedVariation.value.id,
            regular: selectedVariation.value.regular_price,
            sale:
                selectedVariation.value.sale_price ||
                selectedVariation.value.price,
        }
    }
    return null
})
</script>
