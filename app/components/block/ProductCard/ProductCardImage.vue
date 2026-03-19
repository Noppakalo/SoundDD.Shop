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
        v-if="brandImage"
        class="absolute z-10"
        :class="viewMode === 'list' ? 'top-2 right-2' : 'top-4 right-4'"
    >
        <ULink :to="`/brand/${product.brands?.[0]?.slug}`">
            <NuxtImg
                :src="brandImage"
                :alt="product.brands?.[0]?.name"
                loading="lazy"
                draggable="false"
                class="h-12 w-auto object-contain max-sm:h-8"
            />
        </ULink>
    </div>
    <div
        class="relative overflow-hidden"
        :class="
            viewMode === 'list'
                ? 'size-60 p-4 max-sm:size-40'
                : 'aspect-square w-full'
        "
    >
        <div @click="onCardClick" class="cursor-pointer">
            <NuxtImg
                v-if="hoveredVariationImage || displayImageUrls[0]"
                :src="hoveredVariationImage || displayImageUrls[0]"
                :alt="product.name"
                loading="lazy"
                draggable="false"
                class="relative size-full object-cover transition-opacity duration-300"
                :class="[
                    !hoveredVariationImage && displayImageUrls[1]
                        ? 'group-hover:opacity-0'
                        : 'opacity-100',
                ]"
            />
            <NuxtImg
                v-if="!hoveredVariationImage && displayImageUrls[1]"
                :src="displayImageUrls[1]"
                :alt="product.name"
                loading="lazy"
                draggable="false"
                class="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
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
        </div>
        <div
            v-if="colorVariations.length > 0"
            class="absolute top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2"
            :class="
                viewMode === 'list'
                    ? 'left-2 max-lg:hidden'
                    : 'left-4 max-sm:hidden'
            "
        >
            <div
                v-for="variation in colorVariations"
                :key="variation.id"
                class="relative block size-10 cursor-pointer overflow-hidden rounded-full shadow-md transition-all hover:scale-110 max-lg:size-12"
                @mouseenter="onHover(variation)"
                @mouseleave="onLeave"
                @click="onVariationClick(variation)"
            >
                <NuxtImg
                    :src="variation.imageSrc"
                    :alt="variation.imageAlt"
                    class="size-full object-cover"
                />
            </div>
        </div>
        <div
            v-if="product.acf?.image_gift"
            class="absolute z-10 mx-auto"
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

const emit = defineEmits(['hover-variation'])

const brandImage = ref<string | null>(null)
const hoveredVariationImage = ref<string | null>(null)
const hoveredVariationId = ref<number | null>(null)
const hoveredDiscount = ref<number | null>(null)
const hoveredStockStatus = ref<string | null>(null)

const getColorName = (v: any) => {
    if (!v?.attributes) return null
    const attr = v.attributes.find((a: any) => {
        const name = decodeURIComponent(a.name || '').toLowerCase()
        return (
            name.includes('color') ||
            name.includes('สี') ||
            name.includes('pa_')
        )
    })
    const rawOption = attr?.option || v.attributes[0]?.option || ''
    return rawOption ? decodeURIComponent(rawOption) : 'Default'
}

const currentVariation = computed(() => {
    if (hoveredVariationId.value) {
        return props.product.variations_data?.find(
            (v) => v.id === hoveredVariationId.value
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

const onCardClick = () => {
    const router = useRouter()
    const variation = currentVariation.value
    router.push({
        path: `/product/${props.product.slug}`,
        state: variation
            ? {
                  variation_id: variation.id,
                  color: getColorName(variation),
              }
            : undefined,
    })
}

const { displayPriceData } = useProductPrice(() => props.product)
const currentDiscount = computed(
    () => hoveredDiscount.value || displayPriceData.value.discount
)

const displayImageUrls = computed(() => {
    const images: string[] = []
    if (props.product.images?.[0]?.src) images.push(props.product.images[0].src)
    if (props.product.images?.[1]?.src) images.push(props.product.images[1].src)
    return images
})

const onHover = (variation: any) => {
    hoveredVariationImage.value = variation.imageSrc
    hoveredVariationId.value = variation.id
    hoveredStockStatus.value = variation.stock_status

    if (
        variation.regular_price &&
        variation.price &&
        variation.price < variation.regular_price
    ) {
        hoveredDiscount.value = Math.round(
            ((variation.regular_price - variation.price) /
                variation.regular_price) *
                100
        )
    } else {
        hoveredDiscount.value = null
    }
    emit('hover-variation', variation)
}

const onLeave = () => {
    hoveredVariationImage.value = null
    hoveredVariationId.value = null
    hoveredDiscount.value = null
    hoveredStockStatus.value = null
    emit('hover-variation', null)
}

const onVariationClick = (variation: any) => {
    const router = useRouter()
    router.push({
        path: `/product/${props.product.slug}`,
        state: {
            variation_id: variation.id,
            color: variation.colorName,
        },
    })
}

const colorVariations = computed(() => {
    if (!props.product.variations_data) return []
    const uniqueVariations = new Map<string, any>()

    props.product.variations_data.forEach((v) => {
        const imageSrc = v.images?.[0]?.src
        if (!imageSrc) return
        let colorName = null
        if (Array.isArray(v.attributes) && v.attributes.length > 0) {
            const attr = v.attributes.find((a: any) => {
                const name = decodeURIComponent(a.name || '').toLowerCase()
                return (
                    name.includes('color') ||
                    name.includes('สี') ||
                    name.includes('pa_')
                )
            })
            const rawOption = attr?.option || v.attributes[0]?.option || ''
            colorName = rawOption ? decodeURIComponent(rawOption) : 'Default'
        }

        const key = colorName || imageSrc

        if (!uniqueVariations.has(key)) {
            uniqueVariations.set(key, {
                id: v.id,
                price: v.sale_price,
                regular_price: v.regular_price,
                stock_status: v.stock_status,
                imageSrc,
                imageAlt: v.images?.[0]?.alt || '',
                colorName,
            })
        }
    })
    return Array.from(uniqueVariations.values())
})

if (props.product.brands?.[0]) {
    const brandSlug = props.product.brands[0].slug
    const { getBrands } = useWooBrandsApi()
    const { data: brandRes } = await useAsyncData(`brand-${brandSlug}`, () =>
        getBrands({ slug: brandSlug })
    )
    if (brandRes.value?.success) {
        brandImage.value = brandRes.value.data?.[0]?.image?.src || null
    }
}
</script>
