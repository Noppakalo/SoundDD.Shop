<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
            <div v-if="product.brands && product.brands.length > 0">
                <ULink
                    :to="`/brand/${product.brands[0]?.slug}`"
                    class="text-primary text-sm font-medium tracking-wide uppercase hover:underline"
                >
                    {{ product.brands[0]?.name }}
                </ULink>
            </div>
            <div v-if="product.sku" class="flex gap-1 text-xs">
                <p>รหัสสินค้า:</p>
                <span>{{ product.sku }}</span>
            </div>
        </div>
        <h1 class="text-4xl font-bold">
            {{ product.name }}
        </h1>
        <div v-if="hasDisplayPrice">
            <div v-if="product.acf?.promotional_price" class="flex flex-col">
                <div class="flex items-baseline gap-4 text-gray-400">
                    <p
                        v-if="
                            parseFloat(product.regular_price) >
                            parseFloat(product.price)
                        "
                    >
                        ราคาปกติ
                        <span class="line-through decoration-1"
                            >฿{{ formatPrice(product.regular_price) }}</span
                        >
                    </p>
                    <p
                        v-if="
                            parseFloat(product.acf?.promotional_price) >
                            parseFloat(product.price)
                        "
                        class="text-xl"
                    >
                        ราคาโปรโมชันเดิม
                        <span class="line-through decoration-1"
                            >฿{{
                                formatPrice(product.acf?.promotional_price)
                            }}</span
                        >
                    </p>
                </div>
                <div class="flex items-baseline gap-2">
                    <p class="text-error text-4xl font-bold">
                        ฿{{ formatPrice(product.price) }}
                    </p>
                    <p>รวม VAT 7% แล้ว</p>
                </div>
            </div>
            <div v-else class="flex items-baseline gap-4">
                <p
                    v-if="
                        product.on_sale &&
                        parseFloat(product.regular_price) >
                            parseFloat(product.price)
                    "
                    class="text-xl text-gray-400 line-through decoration-1"
                >
                    ฿{{ formatPrice(product.regular_price) }}
                </p>
                <div class="flex items-baseline gap-2">
                    <p class="text-error text-4xl font-bold">
                        ฿{{ formatPrice(product.price) }}
                    </p>
                    <p>รวม VAT 7% แล้ว</p>
                </div>
            </div>
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
        <div
            v-if="product.short_description"
            v-html="product.short_description"
        ></div>
        <div class="flex flex-col gap-4 rounded-md bg-gray-100 p-4">
            <div class="flex items-center gap-2">
                <p class="font-medium">จำนวน:</p>
                <UInputNumber v-model="quantity" :min="1" />
            </div>
            <div class="flex gap-4">
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
                >
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
                        class="size-max rounded-full"
                    >
                    </UButton>
                </UTooltip>
                <UButton
                    :disabled="product.stock_status === 'outofstock'"
                    color="primary"
                    variant="soft"
                    size="lg"
                    icon="i-iconamoon:shopping-bag"
                    class="flex-1 justify-center"
                    @click.prevent="onAddToCart"
                >
                    ใส่ตะกร้า
                </UButton>
                <UButton
                    :disabled="product.stock_status === 'outofstock'"
                    color="primary"
                    size="lg"
                    class="flex-1 justify-center"
                    @click="onBuyNow"
                >
                    ซื้อเลย
                </UButton>
            </div>
        </div>
        <USeparator class="my-4" />
        <div class="flex flex-col gap-2.5">
            <div class="text-error flex items-center gap-3">
                <UIcon name="i-iconamoon:star-fill" class="shrink-0" />
                <p>
                    เช็ค Stock และราคาสินค้า กับเจ้าหน้าที่ก่อนสั่งซื้อทุกครั้ง
                </p>
            </div>
            <div class="flex items-center gap-3">
                <UIcon
                    name="i-iconamoon:badge-light"
                    class="text-success shrink"
                />
                <p>
                    สงวนสิทธิ์การเปลี่ยนแปลงข้อมูล ราคา ไม่แจ้งให้ทราบล่วงหน้า
                </p>
            </div>
            <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-truck" class="text-success shrink" />
                <p>
                    รับสินค้าภายใน 3 - 7 วัน (ขึ้นอยู่กับที่อยู่จัดส่งของลูกค้า)
                </p>
            </div>
            <div class="flex items-center gap-3">
                <UIcon
                    name="i-iconamoon:file-document-light"
                    class="text-sucess text-success shrink"
                />
                <p>สงวนสิทธิ์การรับผิดชอบเนื่องจากการพิมพ์ผิดพลาดต่างๆ</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
}>()

const quantity = ref(1)

const { addToCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()

const hasDisplayPrice = computed(() => {
    const price = props.product.price
    return typeof price === 'string' ? price.trim() !== '' : price != null
})

const onAddToCart = () => {
    addToCart(props.product, quantity.value)
}

const onBuyNow = () => {
    addToCart(props.product, quantity.value)
    navigateTo('/cart')
}
</script>
