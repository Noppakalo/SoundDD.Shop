<template>
    <div
        v-if="
            product.acf?.variant_links_data &&
            product.acf.variant_links_data.length > 0
        "
        class="flex flex-col gap-3"
    >
        <p class="font-medium">
            {{ product.acf?.variant_title }}
        </p>
        <div class="flex flex-wrap gap-2" role="radiogroup">
            <UButton
                v-for="(link, index) in product.acf.variant_links_data"
                :key="index"
                :to="link.url"
                size="sm"
            >
                {{ link.label }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
}>()
</script>
