<template>
    <div class="flex items-center justify-between">
        <div v-if="product.brands && product.brands.length > 0">
            <ULink
                :to="`/brand/${product.brands[0]?.slug}`"
                class="text-primary text-sm font-medium tracking-wide uppercase hover:underline"
            >
                {{ product.brands[0]?.name }}
            </ULink>
        </div>
        <div v-if="displaySku" class="flex gap-1 text-xs text-gray-500">
            <p>
                รหัสสินค้า : <span>{{ displaySku }}</span>
            </p>
        </div>
    </div>
    <h1 class="text-4xl font-bold">{{ product.name }}</h1>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
    selectedVariation?: any
}>()

const displaySku = computed(
    () => props.selectedVariation?.sku || props.product.sku || ''
)
</script>
