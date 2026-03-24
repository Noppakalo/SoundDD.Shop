<template>
    <div
        class="flex flex-1 flex-col justify-between"
        :class="viewMode === 'list' ? 'px-8 py-2 max-sm:px-4' : 'gap-2 p-4'"
    >
        <ULink
            :to="productLink"
            :aria-label="`ดูรายละเอียดสินค้า ${product.name}`"
        >
            <p
                class="group-hover:text-primary line-clamp-2 font-medium"
                :class="
                    viewMode === 'list' ? 'min-h-0 sm:text-xl' : 'min-h-[3rem]'
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
                                parseFloat(currentPrice.regular) >
                                parseFloat(currentPrice.sale)
                            "
                            class="text-md text-gray-400 line-through decoration-1"
                        >
                            ฿{{ formatPrice(currentPrice.regular) }}
                        </p>
                        <p class="text-error text-lg font-bold">
                            ฿{{ formatPrice(currentPrice.sale) }}
                        </p>
                    </div>
                    <p class="text-sm">รวม VAT 7% แล้ว</p>
                </div>
                <UButton
                    v-else
                    to="https://page.line.me/lyd9910p?oat__id=3047370&openQrModal=true"
                    target="_blank"
                    size="xs"
                    color="error"
                    class="w-max font-medium"
                    aria-label="ติดต่อสอบถามราคาผ่าน Line"
                >
                    ติดต่อสอบถามราคา
                </UButton>
            </div>
            <div
                class="flex gap-2 max-md:hidden"
                :class="
                    viewMode === 'list'
                        ? 'absolute top-1/2 right-4 z-30 -translate-y-1/2 flex-col'
                        : ''
                "
            >
                <UTooltip
                    :delay-duration="0"
                    :aria-label="
                        isInWishlist(product.id)
                            ? 'นำสินค้าที่สนใจออก'
                            : 'เพิ่มสินค้าที่สนใจ'
                    "
                    :text="
                        isInWishlist(product.id)
                            ? 'นำสินค้าที่สนใจออก'
                            : 'เพิ่มสินค้าที่สนใจ'
                    "
                >
                    <UButton
                        @click.prevent="toggleWishlist(product.id)"
                        icon="i-iconamoon:heart-fill"
                        color="primary"
                        :variant="isInWishlist(product.id) ? 'solid' : 'soft'"
                        size="xl"
                        class="size-9.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    />
                </UTooltip>
                <UTooltip
                    v-if="hasDisplayPrice"
                    :delay-duration="0"
                    aria-label="หยิบใส่ตะกร้า"
                    text="หยิบใส่ตะกร้า"
                >
                    <UButton
                        @click.prevent="addToCart(product)"
                        icon="i-iconamoon:shopping-bag-fill"
                        color="primary"
                        :variant="isInCart(product.id) ? 'solid' : 'soft'"
                        size="xl"
                        aria-label="หยิบสินค้าใส่ตะกร้า"
                        class="size-9.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    />
                </UTooltip>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatPrice } from '~/utils/formatter'

const props = withDefaults(
    defineProps<{
        product: Product
        viewMode?: 'grid' | 'list'
        activePrice?: { regular: string; sale: string; id?: number } | null
    }>(),
    {
        viewMode: 'grid',
        activePrice: null,
    }
)

const { isInCart, addToCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()
const { displayPriceData, hasDisplayPrice } = useProductPrice(
    () => props.product
)

const currentPrice = computed(() => {
    if (props.activePrice) {
        return {
            regular: props.activePrice.regular,
            sale: props.activePrice.sale,
        }
    }
    return {
        regular: displayPriceData.value.regular,
        sale: displayPriceData.value.sale,
    }
})

const productLink = computed(() => {
    const base = `/product/${props.product.slug}`
    return props.activePrice?.id
        ? `${base}?variation_id=${props.activePrice.id}`
        : base
})
</script>
