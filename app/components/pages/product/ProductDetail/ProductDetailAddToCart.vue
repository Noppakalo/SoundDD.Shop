<template>
    <div
        class="flex flex-col gap-4 rounded-md border border-gray-100 bg-gray-50 p-5"
    >
        <template v-if="hasDisplayPrice">
            <div class="flex items-center gap-3">
                <p class="font-medium">จำนวน :</p>
                <UInputNumber v-model="quantity" :min="1" />
            </div>
            <div class="flex gap-3">
                <UButton
                    @click.prevent="toggleWishlist(product.id)"
                    :icon="
                        isInWishlist(product.id)
                            ? 'i-iconamoon:heart-fill'
                            : 'i-iconamoon:heart-light'
                    "
                    color="primary"
                    variant="ghost"
                    size="xl"
                    class="shrink-0 rounded-full"
                />
                <UButton
                    :disabled="isSoldOut"
                    color="primary"
                    variant="soft"
                    size="lg"
                    icon="i-iconamoon:shopping-bag"
                    class="flex-1 justify-center font-bold whitespace-nowrap"
                    @click.prevent="onAddToCart"
                >
                    ใส่ตะกร้า
                </UButton>
                <UButton
                    :disabled="isSoldOut"
                    color="primary"
                    size="lg"
                    class="flex-1 justify-center font-bold whitespace-nowrap"
                    @click="onBuyNow"
                >
                    ซื้อเลย
                </UButton>
            </div>
        </template>
        <template v-else>
            <UButton
                to="https://page.line.me/your-id"
                target="_blank"
                size="xl"
                color="error"
                block
            >
                ติดต่อสอบถามราคาผ่าน Line
            </UButton>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
    selectedVariation?: any
    hasDisplayPrice: boolean
}>()

const emit = defineEmits(['add-to-cart', 'buy-now'])

const quantity = ref(1)
const { addToCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()

const isSoldOut = computed(() => {
    const status =
        props.selectedVariation?.stock_status || props.product.stock_status
    return status === 'outofstock' || status === 'onbackorder'
})

const onAddToCart = () => {
    let productToCart = { ...props.product }
    if (props.selectedVariation) {
        productToCart = {
            ...productToCart,
            variation_id: props.selectedVariation.id,
            sale_price:
                props.selectedVariation.sale_price ||
                props.selectedVariation.regular_price,
            regular_price: props.selectedVariation.regular_price,
            images: props.selectedVariation.images?.length
                ? props.selectedVariation.images
                : productToCart.images,
        }
    }
    addToCart(productToCart as any, quantity.value)
    emit('add-to-cart', productToCart, quantity.value)
}

const onBuyNow = () => {
    onAddToCart()
    navigateTo('/cart')
    emit('buy-now')
}
</script>
