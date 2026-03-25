<template>
    <div v-if="variations.length > 0" class="flex flex-col gap-3">
        <p class="font-medium">
            {{ attributeName }} :
            <span class="text-primary font-bold">{{ currentOptionName }}</span>
        </p>
        <div class="flex flex-wrap gap-2" role="radiogroup">
            <UButton
                v-for="variation in variations"
                :key="variation.id"
                :variant="
                    selectedVariation?.id === variation.id ? 'solid' : 'outline'
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
    const variationAttr = props.product.attributes?.find(
        (attr: any) => attr.variation === true
    )
    const name =
        variationAttr?.name || props.product.attributes?.[0]?.name || 'ตัวเลือก'
    return decodeURIComponent(name)
})

const getOptionName = (v: any) => {
    if (!v?.attributes || v.attributes.length === 0) return 'Default'
    return v.attributes[0].option
        ? decodeURIComponent(v.attributes[0].option)
        : 'Default'
}

const variations = computed(() => {
    if (!props.product.variations_data) return []
    const uniqueVariations = new Map<string, any>()

    props.product.variations_data.forEach((v) => {
        const optionName = getOptionName(v)
        if (!uniqueVariations.has(optionName)) {
            uniqueVariations.set(optionName, {
                id: v.id,
                optionName,
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
    const fullVariation = props.product.variations_data?.find(
        (v: any) => v.id === variation.id
    )
    if (fullVariation) emit('select-variation', fullVariation)
}
</script>
