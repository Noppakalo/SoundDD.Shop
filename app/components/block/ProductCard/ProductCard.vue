<template>
    <div
        class="group hover:shadow-primary/20 relative flex h-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform"
        :class="viewMode === 'list' ? 'flex-row items-center' : 'flex-col'"
    >
        <ProductCardImage :product="product" :view-mode="viewMode" />
        <ProductCardInfo :product="product" :view-mode="viewMode" />
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

withDefaults(
    defineProps<{
        product: Product
        viewMode?: 'grid' | 'list'
    }>(),
    {
        viewMode: 'grid',
    }
)
</script>
