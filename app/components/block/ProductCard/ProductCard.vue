<template>
    <div
        class="group hover:shadow-primary/20 relative flex h-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform"
        :class="viewMode === 'list' ? 'flex-row items-center' : 'flex-col'"
    >
        <ProductCardImage
            :product="product"
            :view-mode="viewMode"
            @hover-variation="hoveredVariation = $event"
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

const hoveredVariation = ref<any>(null)
const activePrice = computed(() => {
    if (hoveredVariation.value) {
        return {
            regular: hoveredVariation.value.regular_price,
            sale: hoveredVariation.value.price,
        }
    }
    return null
})
</script>
