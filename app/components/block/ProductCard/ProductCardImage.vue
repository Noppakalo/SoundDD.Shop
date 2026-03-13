<template>
    <div
        v-if="displayPriceData.discount"
        class="absolute z-30"
        :class="viewMode === 'list' ? 'top-2 left-2' : 'top-4 left-4'"
    >
        <UBadge
            color="error"
            variant="solid"
            size="lg"
            class="rounded-full px-2.5"
        >{{ displayPriceData.discount }}%
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
                class="h-12 w-auto object-contain"
            />
        </ULink>
    </div>
    <div
        class="relative overflow-hidden"
        :class="
            viewMode === 'list' ? 'size-45 p-4' : 'aspect-square w-full'
        "
    >
        <ULink :to="`/product/${product.slug}`">
            <NuxtImg
                v-if="hoveredVariationImage || displayImageUrls[0]"
                :src="hoveredVariationImage || displayImageUrls[0]"
                :alt="product.name"
                loading="lazy"
                draggable="false"
                class="relative size-full object-cover transition-opacity duration-500"
                :class="[
                    (!hoveredVariationImage && displayImageUrls[1]) ? 'group-hover:opacity-0' : '',
                ]"
            />
            <NuxtImg
                v-if="!hoveredVariationImage && displayImageUrls[1]"
                :src="displayImageUrls[1]"
                :alt="product.name"
                loading="lazy"
                draggable="false"
                class="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div
                v-if="product.acf?.image_gift"
                class="absolute right-0 left-0 m-auto"
                :class="viewMode === 'list' ? 'w-40 bottom-2' : 'w-60 bottom-0'"
            >
                <NuxtImg
                    v-if="product.acf?.image_gift.url"
                    :src="product.acf?.image_gift.url"
                    :alt="product.acf?.image_gift.alt"
                    loading="lazy"
                    draggable="false"
                    class="relative h-full w-full object-cover"
                />
            </div>
            <div
                v-if="product.stock_status === 'outofstock'"
                class="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
            >
                <div
                    class="bg-primary/80 absolute bottom-0 flex w-full items-center justify-center"
                >
                    <p
                        class="font-bold text-white"
                        :class="viewMode === 'list' ? '' : 'text-lg'"
                    >
                        สินค้าหมด
                    </p>
                </div>
            </div>
            <div
                v-if="product.stock_status === 'onbackorder'"
                class="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
            >
                <div
                    class="bg-primary/80 absolute bottom-0 flex w-full items-center justify-center"
                >
                    <p
                        class="text-lg font-bold text-white"
                        :class="viewMode === 'list' ? '' : 'text-lg'"
                    >
                        สินค้าหมดชั่วคราว
                    </p>
                </div>
            </div>
        </ULink>
        <div
            v-if="colorVariations.length > 0"   
            class="absolute  top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30"
            :class="viewMode === 'list' ? 'left-2' : 'left-4'"
        >
            <ULink
                v-for="(variation, index) in colorVariations"
                :key="variation.id"
                :to="`/product/${product.slug}`"
                class="size-10 cursor-pointer overflow-hidden rounded-full border-white shadow-md transition-transform hover:scale-110 block"
                @mouseenter="hoveredVariationImage = variation.imageSrc || null"
                @mouseleave="hoveredVariationImage = null"
            >
                <NuxtImg
                    :src="variation.imageSrc"
                    :alt="variation.imageAlt"
                    loading="lazy"
                    class="size-full object-cover"
                />
            </ULink>
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
    {
        viewMode: 'grid',
    }
)

const brandImage = ref<string | null>(null)

const displayImageUrls = computed(() => {
    const images: string[] = []
    if (props.product.images?.[0]?.src) images.push(props.product.images[0].src)
    if (props.product.images?.[1]?.src) images.push(props.product.images[1].src)
    return images
})

const hoveredVariationImage = ref<string | null>(null)

const colorVariations = computed(() => {
    if (!props.product.variations_data) return []
    const uniqueVariations = new Map<string, any>()
    
    props.product.variations_data.forEach(v => {
        const imageSrc = v.images?.[0]?.src
        if (!imageSrc) return

        let colorName = null
        if (Array.isArray(v.attributes) && v.attributes.length > 0) {
            const attr = v.attributes.find((a: any) => {
                if (!a || !a.name) return false
                const name = decodeURIComponent(a.name).toLowerCase()
                return name.includes('color') || name.includes('สี') || name.includes('pa_color')
            })
            const targetAttr = attr || v.attributes[0]
            if (targetAttr?.option) {
                try {
                    colorName = decodeURIComponent(targetAttr.option)
                } catch {
                    colorName = targetAttr.option
                }
            }
        }
        
        const key = colorName || imageSrc
        
        if (!uniqueVariations.has(key)) {
            const slug = (v as any).slug || (v as any).url?.split('product/')[1]?.replace(/\//g, '') || null
            
            uniqueVariations.set(key, {
                id: v.id,
                sku: v.sku,
                imageSrc,
                imageAlt: v.images?.[0]?.alt || '',
                colorName,
                slug,
            })
        }
    })
    
    return Array.from(uniqueVariations.values())
})

const { displayPriceData } = useProductPrice(() => props.product)

if (props.product.brands && props.product.brands.length > 0) {
    const firstBrand = props.product.brands[0]
    if (firstBrand) {
        const brandSlug = firstBrand.slug
        const { getBrands } = useWooBrandsApi()
        const { data: brandRes } = await useAsyncData(
            `brand-${brandSlug}`,
            () => getBrands({ slug: brandSlug })
        )
        if (brandRes.value?.success && brandRes.value.data?.[0]?.image?.src) {
            brandImage.value = brandRes.value.data[0].image.src
        }
    }
}
</script>
