<template>
    <div
        v-if="currentDiscount"
        class="absolute z-30"
        :class="viewMode === 'list' ? 'top-2 left-2' : 'top-4 left-4'"
    >
        <UBadge
            color="error"
            variant="solid"
            size="lg"
            class="rounded-full px-2.5"
            >-{{ currentDiscount }}%
        </UBadge>
    </div>
    <div
        class="relative"
        :class="
            viewMode === 'list'
                ? 'size-60 max-sm:size-40'
                : 'aspect-square w-full'
        "
    >
        <ULink
            :to="productLink"
            class="block cursor-pointer"
            :aria-label="`ดูรายละเอียดสินค้า ${product.name}`"
        >
            <template v-if="displayImageUrls.length > 0">
                <NuxtImg
                    v-if="displayImageUrls[0]"
                    :src="displayImageUrls[0]"
                    :alt="product.name"
                    loading="lazy"
                    class="relative size-full object-cover transition-opacity duration-300"
                    :class="[
                        displayImageUrls[1]
                            ? 'group-hover:opacity-0'
                            : 'opacity-100',
                    ]"
                />
                <NuxtImg
                    v-if="displayImageUrls[1]"
                    :src="displayImageUrls[1]"
                    :alt="product.name"
                    loading="lazy"
                    class="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
            </template>

            <div
                v-else
                class="flex aspect-square w-full items-center justify-center bg-gray-100 text-gray-400 transition-colors group-hover:bg-gray-200"
            >
                <UIcon
                    name="i-iconamoon:folder-image-light"
                    class="size-20"
                    aria-hidden="true"
                />
            </div>
            <div
                v-if="isSoldOut"
                class="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
            >
                <div
                    class="bg-primary/80 absolute bottom-0 flex w-full items-center justify-center py-1"
                >
                    <p
                        class="font-bold text-white"
                        :class="
                            viewMode === 'list'
                                ? ''
                                : 'text-lg max-sm:text-base'
                        "
                    >
                        {{
                            currentStockStatus === 'outofstock'
                                ? 'สินค้าหมด'
                                : 'สินค้าหมดชั่วคราว'
                        }}
                    </p>
                </div>
            </div>
        </ULink>
        <div
            v-if="product.acf?.image_gift"
            class="absolute z-10"
            :class="
                viewMode === 'list'
                    ? 'bottom-1 px-2'
                    : 'bottom-0 px-4 max-sm:px-2'
            "
        >
            <NuxtImg
                v-if="product.acf?.image_gift.url"
                :src="product.acf?.image_gift.url"
                class="relative h-full w-full object-cover"
                loading="lazy"
                draggable="false"
            />
        </div>
        <div
            v-if="colorVariations.length > 0"
            class="absolute z-30 flex gap-2"
            :class="
                viewMode === 'list' ? 'bottom-2 left-2' : '-bottom-3 left-4'
            "
        >
            <div
                v-for="variation in colorVariations"
                :key="variation.id"
                class="relative block size-8 cursor-pointer overflow-hidden rounded-full shadow-md transition-all hover:scale-110 max-sm:size-6"
                :class="[
                    selectedVariationId === variation.id
                        ? 'ring-primary ring-2 ring-offset-1'
                        : 'ring-1 ring-black/5',
                ]"
                @click="selectVariation(variation)"
            >
                <NuxtImg
                    v-if="variation.imageSrc"
                    :src="variation.imageSrc"
                    :alt="variation.imageAlt"
                    loading="lazy"
                    draggable="false"
                    class="size-full object-cover"
                />

                <div
                    v-else
                    class="flex size-full items-center justify-center bg-gray-100 text-gray-400"
                >
                    <UIcon
                        name="i-iconamoon:folder-image-light"
                        class="size-4"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    </div>
    <FlashSaleTimer
        :date-from="effectiveSaleFrom"
        :date-to="effectiveSaleTo"
        class="absolute left-1/2 z-20 w-max -translate-x-1/2 px-4"
        :class="viewMode === 'list' ? 'max-lg:hidden' : ''"
    />
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

const emit = defineEmits(['select-variation'])

const selectedVariationId = ref<number | null>(null)
const selectedVariationImage = ref<string | null>(null)
const selectedVariationDiscount = ref<number | null>(null)
const hoveredStockStatus = ref<string | null>(null)

const currentVariation = computed(() => {
    if (selectedVariationId.value) {
        return props.product.variations_data?.find(
            (v) => v.id === selectedVariationId.value
        )
    }
    const currentImage = displayImageUrls.value[0]
    return props.product.variations_data?.find(
        (v) => v.images?.[0]?.src === currentImage
    )
})

const currentStockStatus = computed(() => {
    return currentVariation.value?.stock_status || props.product.stock_status
})

const isSoldOut = computed(
    () =>
        currentStockStatus.value === 'outofstock' ||
        currentStockStatus.value === 'onbackorder'
)

const { displayPriceData } = useProductPrice(() => props.product)

const effectiveSaleFrom = computed(() => {
    if (selectedVariationId.value) {
        const v = props.product.variations_data?.find(
            (v) => v.id === selectedVariationId.value
        )
        if (v?.date_on_sale_from) return v.date_on_sale_from
    }
    const firstSaleVar = props.product.variations_data?.find(
        (v) => v.date_on_sale_from
    )
    if (firstSaleVar) return firstSaleVar.date_on_sale_from
    return props.product.date_on_sale_from
})

const effectiveSaleTo = computed(() => {
    if (selectedVariationId.value) {
        const v = props.product.variations_data?.find(
            (v) => v.id === selectedVariationId.value
        )
        if (v?.date_on_sale_to) return v.date_on_sale_to
    }
    const firstSaleVar = props.product.variations_data?.find(
        (v) => v.date_on_sale_to
    )
    if (firstSaleVar) return firstSaleVar.date_on_sale_to
    return props.product.date_on_sale_to
})

const currentDiscount = computed(
    () => selectedVariationDiscount.value || displayPriceData.value.discount
)

const displayImageUrls = computed(() => {
    const images: string[] = []
    if (selectedVariationImage.value) {
        images.push(selectedVariationImage.value)
    } else {
        if (props.product.images?.[0]?.src)
            images.push(props.product.images[0].src)
        if (props.product.images?.[1]?.src)
            images.push(props.product.images[1].src)
    }
    return images
})

const selectVariation = (variation: any) => {
    if (selectedVariationId.value === variation.id) {
        selectedVariationId.value = null
        selectedVariationImage.value = null
        selectedVariationDiscount.value = null
        hoveredStockStatus.value = null
        emit('select-variation', null)
        return
    }

    selectedVariationId.value = variation.id
    selectedVariationImage.value = variation.imageSrc
    hoveredStockStatus.value = variation.stock_status

    if (
        variation.regular_price &&
        variation.price &&
        variation.price < variation.regular_price
    ) {
        selectedVariationDiscount.value = Math.round(
            ((variation.regular_price - variation.price) /
                variation.regular_price) *
                100
        )
    } else {
        selectedVariationDiscount.value = null
    }
    emit('select-variation', variation)
}

const colorVariations = computed(() => {
    if (!props.product.variations_data) return []
    const uniqueVariations = new Map<string, any>()

    props.product.variations_data.forEach((v) => {
        const colorAttr = v.attributes?.find((a: any) => a.id === 4)
        if (!colorAttr) return
        const imageSrc = v.images?.[0]?.src || null
        const rawOption = colorAttr.option || ''
        const colorName = rawOption ? decodeURIComponent(rawOption) : 'Default'
        const key = colorName || imageSrc || v.id
        if (!uniqueVariations.has(String(key))) {
            uniqueVariations.set(String(key), {
                id: v.id,
                price: v.sale_price,
                regular_price: v.regular_price,
                stock_status: v.stock_status,
                imageSrc,
                imageAlt: v.images?.[0]?.alt || colorName,
                date_on_sale_from: v.date_on_sale_from,
                date_on_sale_to: v.date_on_sale_to,
                colorName,
            })
        }
    })
    return Array.from(uniqueVariations.values())
})

const productLink = computed(() => {
    const base = `/product/${props.product.slug}`
    return selectedVariationId.value
        ? `${base}?variation_id=${selectedVariationId.value}`
        : base
})
</script>
