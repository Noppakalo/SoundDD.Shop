<template>
    <div class="flex flex-col gap-6">
        <ProductDetailHeader
            :product="product"
            :selected-variation="selectedVariation"
        />
        <ProductDetailPrice
            :product="product"
            :selected-variation="selectedVariation"
        />
        <div
            v-if="product.short_description"
            v-html="product.short_description"
            class="prose prose-sm max-w-none"
        ></div>
        <ProductDetailVariants :product="product" />
        <ProductDetailVariationSelector
            :product="product"
            :selected-variation="selectedVariation"
            @select-variation="$emit('select-variation', $event)"
        />
        <ProductDetailAddToCart
            :product="product"
            :selected-variation="selectedVariation"
            :has-display-price="hasDisplayPrice"
        />
        <ProductDetailNotices />
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
    selectedVariation?: any
}>()

defineEmits(['select-variation'])

const { hasDisplayPrice } = useProductPrice(() => props.product)
</script>
