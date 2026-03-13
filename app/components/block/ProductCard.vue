<template>
    <div
        class="group hover:shadow-primary/20 relative flex h-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform"
        :class="viewMode === 'list' ? 'flex-row items-center' : 'flex-col'"
    >
        <div
            v-if="product.on_sale"
            class="absolute z-30"
            :class="viewMode === 'list' ? 'top-2 left-2' : 'top-4 left-4'"
        >
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
                        product.acf?.promotional_price || undefined
                    )
                }}%
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
                    v-if="displayImageUrls[0]"
                    :src="displayImageUrls[0]"
                    :alt="product.name"
                    loading="lazy"
                    draggable="false"
                    class="relative size-full object-cover transition-opacity duration-500"
                    :class="[
                        displayImageUrls[1] ? 'group-hover:opacity-0' : '',
                    ]"
                />
                <NuxtImg
                    v-if="displayImageUrls[1]"
                    :src="displayImageUrls[1]"
                    :alt="product.name"
                    loading="lazy"
                    draggable="false"
                    class="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div
                    v-if="product.acf?.image_gift"
                    class="absolute right-0 bottom-0 left-0 m-auto"
                    :class="viewMode === 'list' ? 'w-40' : 'w-60'"
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
        </div>
        <div
            class="flex flex-1 flex-col justify-between"
            :class="viewMode === 'list' ? 'px-8 py-2' : 'gap-2 p-4'"
        >
            <ULink :to="`/product/${product.slug}`">
                <p
                    class="group-hover:text-primary line-clamp-2 font-medium"
                    :class="
                        viewMode === 'list' ? 'min-h-0 text-xl' : 'min-h-[3rem]'
                    "
                >
                    {{ product.name }}
                </p>
            </ULink>
            <div class="flex items-end justify-between">
                <div
                    class="flex flex-col justify-end"
                    :class="viewMode === 'list' ? '' : 'h-14'"
                >
                    <div v-if="hasDisplayPrice">
                        <div class="flex items-baseline gap-2">
                            <p
                                v-if="
                                    parseFloat(product.regular_price) >
                                    parseFloat(product.price)
                                "
                                class="text-gray-400 line-through decoration-1"
                                :class="viewMode === 'list' ? '' : 'text-md'"
                            >
                                ฿{{ formatPrice(product.regular_price) }}
                            </p>
                            <p
                                class="text-error font-bold"
                                :class="
                                    viewMode === 'list' ? 'text-2xl' : 'text-lg'
                                "
                            >
                                ฿{{ formatPrice(product.price) }}
                            </p>
                        </div>
                        <p :class="viewMode === 'list' ? '' : 'text-xs'">
                            รวม VAT 7% แล้ว
                        </p>
                    </div>
                    <UButton
                        v-else
                        to="https://page.line.me/lyd9910p?oat__id=3047370&openQrModal=true"
                        target="_blank"
                        size="xs"
                        color="error"
                        class="w-max"
                        >ติดต่อสอบถามราคา</UButton
                    >
                </div>
                <div
                    class="flex gap-2"
                    :class="
                        viewMode === 'list'
                            ? 'absolute top-1/2 right-4 z-30 -translate-y-1/2 flex-col'
                            : ''
                    "
                >
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
                            :variant="
                                isInWishlist(product.id) ? 'solid' : 'soft'
                            "
                            size="xl"
                            class="size-9.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        >
                        </UButton>
                    </UTooltip>
                    <UTooltip
                        :aria-label="
                            isInCart(product.id)
                                ? 'นำออกจากตะกร้า'
                                : 'หยิบใส่ตะกร้า'
                        "
                        :delay-duration="0"
                        :text="
                            isInCart(product.id)
                                ? 'นำออกจากตะกร้า'
                                : 'หยิบใส่ตะกร้า'
                        "
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
                            class="size-9.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        >
                        </UButton>
                    </UTooltip>
                </div>
            </div>
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

const { isInCart, toggleCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()

const brandImage = ref<string | null>(null)

const displayImageUrls = computed(() => {
    const images: string[] = []
    if (props.product.images?.[0]?.src) images.push(props.product.images[0].src)
    if (props.product.images?.[1]?.src) images.push(props.product.images[1].src)
    return images
})

const hasDisplayPrice = computed(() => {
    const price = props.product.price
    return typeof price === 'string' ? price.trim() !== '' : price != null
})

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
