<template>
    <div v-if="variations.length > 0" class="flex flex-col gap-3">
        <p class="font-medium">
            {{ attributeName }} :
            <span class="text-primary font-bold">{{ currentOptionName }}</span>
        </p>
        <div class="flex flex-wrap gap-2.5">
            <div
                v-for="variation in variations"
                :key="variation.id"
                class="relative block size-6 cursor-pointer overflow-hidden rounded-full shadow-md transition-all hover:scale-110"
                :class="
                    selectedVariation?.id === variation.id
                        ? 'ring-primary ring-2 ring-offset-2'
                        : 'ring-1 ring-black/5'
                "
                :title="variation.name"
                @click="onVariationSelect(variation)"
            >
                <span
                    class="block h-full w-full rounded-full border border-black/5 shadow-inner"
                    :style="{
                        backgroundColor: variation.hexColor || '#f0f0f0',
                    }"
                ></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
    selectedVariation?: any
}>()

const emit = defineEmits(['select-variation'])

const attributeName = computed(() => {
    const attr = props.product.attributes?.find(
        (a: any) => a.variation === true
    )
    return decodeURIComponent(attr?.name ?? 'ตัวเลือก')
})

const getOptionName = (v: any) => {
    const attr =
        v?.attributes?.find(
            (a: any) => a.slug === 'pa_color' || a.name?.includes('สี')
        ) || v?.attributes?.[0]
    return decodeURIComponent(attr?.option ?? '')
}

const variations = computed(() => {
    const variationsData = props.product.variations_data
    if (!variationsData) return []

    const uniqueVariations = new Map()

    variationsData.forEach((v) => {
        const name = getOptionName(v)
        const colorAttr = v.attributes?.find((a: any) => a.color)

        if (!uniqueVariations.has(name)) {
            uniqueVariations.set(name, {
                id: v.id,
                name,
                hexColor: colorAttr?.color ?? null,
            })
        }
    })
    return Array.from(uniqueVariations.values())
})

const currentOptionName = computed(() => {
    return props.selectedVariation ? getOptionName(props.selectedVariation) : ''
})

const onVariationSelect = (variation: any) => {
    const full = props.product.variations_data?.find(
        (v) => v.id === variation.id
    )
    if (full) emit('select-variation', full)
}
</script>
