<template>
    <div
        class="group hover:shadow-primary/20 relative flex flex-col gap-6 overflow-hidden rounded-xl bg-white shadow-lg transition-transform"
    >
        <div v-if="product.on_sale" class="absolute top-4 left-4 z-10">
            <UBadge
                color="error"
                variant="solid"
                size="lg"
                class="rounded-full px-2.5"
            >
                {{
                    calculateDiscount(
                        product.regular_price,
                        product.price,
                        product.promotional_price
                    )
                }}%
            </UBadge>
        </div>
        <div v-if="brandImage" class="absolute top-4 right-4 z-10">
            <NuxtLink :to="`/brand/${product.brands?.[0]?.slug}`">
                <NuxtImg
                    :src="brandImage"
                    :alt="product.brands?.[0]?.name"
                    loading="lazy"
                    draggable="false"
                    class="h-12 w-auto object-contain"
                />
            </NuxtLink>
        </div>
        <UTooltip
            :aria-label="
                isInWishlist(product.id)
                    ? 'นำสินค้าที่สนใจออก'
                    : 'เพิ่มสินค้าที่สนใจ'
            "
            :delay-duration="0"
            :text="
                isInWishlist(product.id)
                    ? 'นำสินค้าที่สนใจออก'
                    : 'เพิ่มสินค้าที่สนใจ'
            "
            :content="{
                align: 'center',
                side: 'left',
                sideOffset: 8,
            }"
        >
            <UButton
                @click.prevent="toggleWishlist(product.id)"
                icon="i-iconamoon:heart-fill"
                color="primary"
                :variant="isInWishlist(product.id) ? 'solid' : 'soft'"
                size="xl"
                class="absolute top-14 right-4 z-10 size-max rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
            </UButton>
        </UTooltip>
        <UTooltip
            :aria-label="
                isInCart(product.id) ? 'นำออกจากตะกร้า' : 'หยิบใส่ตะกร้า'
            "
            :delay-duration="0"
            :text="isInCart(product.id) ? 'นำออกจากตะกร้า' : 'หยิบใส่ตะกร้า'"
            :content="{
                align: 'center',
                side: 'left',
                sideOffset: 8,
            }"
        >
            <UButton
                @click.prevent="toggleCart(product)"
                icon="i-iconamoon:shopping-bag-fill"
                color="primary"
                :variant="isInCart(product.id) ? 'solid' : 'soft'"
                size="xl"
                class="absolute top-28 right-4 z-10 size-max rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
            </UButton>
        </UTooltip>
        <div class="aspect-square overflow-hidden">
            <NuxtLink :to="`/product/${product.slug}`">
                <NuxtImg
                    :src="
                        product.images?.[0]?.src ||
                        'https://via.placeholder.com/300'
                    "
                    :alt="product.images?.[0]?.alt || product.name"
                    class="h-full w-full object-cover object-center"
                    :class="{
                        'opacity-70 grayscale':
                            product.stock_status === 'outofstock',
                    }"
                />
            </NuxtLink>
        </div>
        <div class="flex flex-1 flex-col gap-4 p-4">
            <NuxtLink :to="`/product/${product.slug}`">
                <p
                    class="group-hover:text-primary line-clamp-2 min-h-15 font-medium"
                >
                    {{ product.name }}
                </p>
            </NuxtLink>
            <div class="flex justify-between">
                <div class="flex flex-col">
                    <div class="mt-auto flex items-baseline gap-2">
                        <p
                            v-if="
                                product.on_sale &&
                                product.regular_price !== product.price
                            "
                            class="text-md text-gray-400 line-through decoration-1"
                        >
                            ฿{{ formatPrice(product.regular_price) }}
                        </p>
                        <p class="text-error text-lg font-bold">
                            ฿{{ formatPrice(product.price) }}
                        </p>
                    </div>
                    <p class="text-xs">รวม VAT 7% แล้ว</p>
                </div>
                <div v-if="product.stock_status === 'outofstock'">
                    <UButton color="error" size="sm" aria-label="สินค้าหมด">
                        สินค้าหมด
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
}>()

const { isInCart, toggleCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()

const brandImage = ref<string | null>(null)

if (props.product.brands && props.product.brands.length > 0) {
    const firstBrand = props.product.brands[0]
    if (firstBrand) {
        const brandSlug = firstBrand.slug
        const { getBrands } = useWooBrandsApi()

        const { data: brandRes } = await useAsyncData(
            `brand-${brandSlug}`,
            () => getBrands({ slug: brandSlug })
        )

        if (
            brandRes.value?.success &&
            brandRes.value.data &&
            brandRes.value.data.length > 0
        ) {
            const brandData = brandRes.value.data[0]
            if (brandData) {
                const img = brandData.image?.src
                if (img) brandImage.value = img
            }
        }
    }
}
</script>
