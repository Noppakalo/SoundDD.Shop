<template>
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
                                parseFloat(displayPriceData.regular) >
                                parseFloat(displayPriceData.sale)
                            "
                            class="text-gray-400 line-through decoration-1"
                            :class="viewMode === 'list' ? '' : 'text-md'"
                        >
                            ฿{{ formatPrice(displayPriceData.regular) }}
                        </p>
                        <p
                            class="text-error font-bold"
                            :class="
                                viewMode === 'list' ? 'text-2xl' : 'text-lg'
                            "
                        >
                            ฿{{ formatPrice(displayPriceData.sale) }}
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
                    aria-label="หยิบใส่ตะกร้า"
                    :delay-duration="0"
                    text="หยิบใส่ตะกร้า"
                    :content="{
                        align: 'center',
                        side: 'left',
                        sideOffset: 8,
                    }"
                >
                    <UButton
                        @click.prevent="addToCart(product)"
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
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatPrice } from '~/utils/formatter'

const props = withDefaults(
    defineProps<{
        product: Product
        viewMode?: 'grid' | 'list'
    }>(),
    {
        viewMode: 'grid',
    }
)

const { isInCart, addToCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()
const { displayPriceData, hasDisplayPrice } = useProductPrice(() => props.product)
</script>
