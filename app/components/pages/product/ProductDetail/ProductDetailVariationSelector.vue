<template>
    <div v-if="variations.length > 0" class="flex flex-col gap-3">
        <p class="font-medium">
            {{ attributeName }} :
            <span class="text-primary font-bold">{{ currentOptionName }}</span>
        </p>

        <div class="flex flex-wrap gap-2.5" role="radiogroup">
            <template v-if="attributeId === 4">
                <div
                    v-for="variation in variations"
                    :key="variation.id"
                    class="relative block size-6 cursor-pointer overflow-hidden rounded-full shadow-md transition-all hover:scale-110"
                    :class="
                        selectedVariation?.id === variation.id
                            ? 'ring-primary ring-2 ring-offset-2'
                            : 'ring-1 ring-black/5'
                    "
                    :title="variation.optionName"
                    @click="onVariationSelect(variation)"
                >
                    <span
                        class="block h-full w-full rounded-full border border-black/5 shadow-inner"
                        :style="{
                            backgroundColor: variation.hexColor || '#f0f0f0',
                        }"
                    ></span>
                </div>
            </template>

            <template v-else>
                <UButton
                    v-for="variation in variations"
                    :key="variation.id"
                    :variant="
                        selectedVariation?.id === variation.id
                            ? 'solid'
                            : 'outline'
                    "
                    :color="
                        selectedVariation?.id === variation.id
                            ? 'primary'
                            : 'neutral'
                    "
                    size="md"
                    @click="onVariationSelect(variation)"
                >
                    {{ variation.optionName }}
                </UButton>
            </template>
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

const activeAttribute = computed(() => {
    return (
        props.product.attributes?.find((a: any) => a.variation === true) ||
        props.product.attributes?.[0]
    )
})

const attributeId = computed(() => activeAttribute.value?.id)

const attributeName = computed(() => {
    return decodeURIComponent(activeAttribute.value?.name ?? 'ตัวเลือก')
})

const getOptionName = (v: any) => {
    if (!v?.attributes || v.attributes.length === 0) return 'Default'
    const attr =
        v.attributes.find((a: any) => a.id === attributeId.value) ||
        v.attributes[0]
    return decodeURIComponent(attr?.option ?? '')
}

const variations = computed(() => {
    const variationsData = props.product.variations_data
    if (!variationsData) return []

    const uniqueVariations = new Map<string, any>()

    variationsData.forEach((v) => {
        const optionName = getOptionName(v)

        if (!uniqueVariations.has(optionName)) {
            const colorAttr = v.attributes?.find((a: any) => a.color)
            uniqueVariations.set(optionName, {
                id: v.id,
                optionName,
                hexColor: colorAttr?.color ?? null,
                stock_status: v.stock_status,
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
        (v: any) => v.id === variation.id
    )
    if (full) emit('select-variation', full)
}
</script>
