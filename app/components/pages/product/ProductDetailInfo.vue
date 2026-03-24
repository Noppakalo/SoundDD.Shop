<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between">
            <div v-if="product.brands && product.brands.length > 0">
                <ULink
                    :to="`/brand/${product.brands[0]?.slug}`"
                    class="text-primary text-sm font-medium tracking-wide uppercase hover:underline"
                    :aria-label="`แบรนด์: ${product.brands[0]?.name}`"
                >
                    {{ product.brands[0]?.name }}
                </ULink>
            </div>
            <div v-if="displaySku" class="flex gap-1 text-xs">
                <p>
                    รหัสสินค้า : <span>{{ displaySku }}</span>
                </p>
            </div>
        </div>
        <h1 class="text-4xl font-bold">
            {{ product.name }}
        </h1>
        <div v-if="hasDisplayPrice" aria-live="polite">
            <div v-if="product.acf?.promotional_price" class="flex flex-col">
                <div class="flex items-baseline gap-4 text-gray-400">
                    <p
                        v-if="
                            parseFloat(displayPriceData.regular) >
                            parseFloat(displayPriceData.sale)
                        "
                    >
                        ราคาปกติ
                        <span class="line-through decoration-1"
                            >฿{{ formatPrice(displayPriceData.regular) }}</span
                        >
                    </p>
                    <p
                        v-if="
                            parseFloat(product.acf?.promotional_price) >
                            parseFloat(displayPriceData.sale)
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
                        ฿{{ formatPrice(displayPriceData.sale) }}
                    </p>
                    <p>รวม VAT 7% แล้ว</p>
                </div>
            </div>
            <div v-else class="flex items-baseline gap-4">
                <p
                    v-if="
                        parseFloat(displayPriceData.regular) >
                        parseFloat(displayPriceData.sale)
                    "
                    class="text-xl text-gray-400 line-through decoration-1"
                >
                    ฿{{ formatPrice(displayPriceData.regular) }}
                </p>
                <div class="flex items-baseline gap-2">
                    <p class="text-error text-4xl font-bold">
                        ฿{{ formatPrice(displayPriceData.sale) }}
                    </p>
                    <p>รวม VAT 7% แล้ว</p>
                </div>
            </div>
        </div>
        <div
            v-if="product.short_description"
            v-html="product.short_description"
            class="prose prose-sm max-w-none"
        ></div>
        <div v-if="colorVariations.length > 0" class="flex flex-col gap-2">
            <p>
                เลือกสี :
                <span class="text-primary font-bold">{{
                    currentColorName
                }}</span>
            </p>
            <div
                class="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="เลือกสีสินค้า"
            >
                <UButton
                    v-for="variation in colorVariations"
                    :key="variation.id"
                    :variant="
                        selectedVariation?.id === variation.id
                            ? 'solid'
                            : 'outline'
                    "
                    :color="
                        selectedVariation?.id === variation.id
                            ? 'primary'
                            : 'neutral'
                    "
                    role="radio"
                    :aria-checked="selectedVariation?.id === variation.id"
                    @click="onVariationSelect(variation)"
                >
                    {{ variation.colorName }}
                </UButton>
            </div>
        </div>
        <div class="flex flex-col gap-4 rounded-md bg-gray-100 p-4">
            <template v-if="hasDisplayPrice">
                <div class="flex items-center gap-2">
                    <p class="font-medium">จำนวน :</p>
                    <UInputNumber v-model="quantity" :min="1" />
                </div>
                <div class="flex gap-4">
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
                            :icon="
                                isInWishlist(product.id)
                                    ? 'i-iconamoon:heart-fill'
                                    : 'i-iconamoon:heart-light'
                            "
                            color="primary"
                            variant="ghost"
                            size="xl"
                            class="size-max rounded-full"
                        />
                    </UTooltip>
                    <UButton
                        :disabled="isSoldOut"
                        color="primary"
                        variant="soft"
                        size="lg"
                        icon="i-iconamoon:shopping-bag"
                        class="flex-1 justify-center whitespace-nowrap"
                        aria-label="หยิบสินค้าใส่ตะกร้า"
                        @click.prevent="onAddToCart"
                    >
                        ใส่ตะกร้า
                    </UButton>
                    <UButton
                        :disabled="isSoldOut"
                        color="primary"
                        size="lg"
                        class="flex-1 justify-center whitespace-nowrap"
                        aria-label="ซื้อสินค้าทันที"
                        @click="onBuyNow"
                    >
                        ซื้อเลย
                    </UButton>
                </div>
            </template>
            <template v-else>
                <UButton
                    to="https://page.line.me/lyd9910p?oat__id=3047370&openQrModal=true"
                    target="_blank"
                    size="xl"
                    color="error"
                    aria-label="ติดต่อสอบถามราคาผ่าน Line"
                >
                    ติดต่อสอบถามราคา
                </UButton>
            </template>
        </div>
        <USeparator class="my-4" />
        <div class="flex flex-col gap-2.5 max-sm:text-sm">
            <div class="text-error flex items-center gap-3 font-medium">
                <UIcon name="i-iconamoon:star-fill" class="shrink-0" />
                <p>
                    เช็ค Stock และราคาสินค้า กับเจ้าหน้าที่ก่อนสั่งซื้อทุกครั้ง
                </p>
            </div>
            <div class="flex items-center gap-3">
                <UIcon
                    name="i-iconamoon:badge-light"
                    class="text-success shrink-0"
                />
                <p>
                    สงวนสิทธิ์การเปลี่ยนแปลงข้อมูล ราคา ไม่แจ้งให้ทราบล่วงหน้า
                </p>
            </div>
            <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-truck" class="text-success shrink-0" />
                <p>
                    รับสินค้าภายใน 3 - 7 วัน (ขึ้นอยู่กับที่อยู่จัดส่งของลูกค้า)
                </p>
            </div>
            <div class="flex items-center gap-3">
                <UIcon
                    name="i-iconamoon:file-document-light"
                    class="text-success shrink-0"
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
    selectedVariation?: any
}>()

const emit = defineEmits(['select-variation'])

const quantity = ref(1)

const { addToCart } = useCart()
const { isInWishlist, toggleWishlist } = useWishlist()

const { displayPriceData: basePriceData, hasDisplayPrice } = useProductPrice(
    () => props.product
)

const displayPriceData = computed(() => {
    if (props.selectedVariation) {
        const v = props.selectedVariation
        const sale = v.sale_price || v.regular_price
        const regular = v.regular_price
        return { sale, regular }
    }
    return basePriceData.value
})

const currentStockStatus = computed(() => {
    return props.selectedVariation?.stock_status || props.product.stock_status
})

const displaySku = computed(() => {
    return props.selectedVariation?.sku || props.product.sku
})

const isSoldOut = computed(() => {
    return (
        currentStockStatus.value === 'outofstock' ||
        currentStockStatus.value === 'onbackorder'
    )
})

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

const colorVariations = computed(() => {
    if (!props.product.variations_data) return []
    const uniqueVariations = new Map<string, any>()

    props.product.variations_data.forEach((v) => {
        const colorName = getColorName(v)
        const key = colorName || v.id.toString()

        if (!uniqueVariations.has(key)) {
            uniqueVariations.set(key, {
                id: v.id,
                colorName,
                stock_status: v.stock_status,
            })
        }
    })
    return Array.from(uniqueVariations.values())
})

const currentColorName = computed(() => {
    const variation = props.selectedVariation
    if (!variation) return ''
    return getColorName(variation)
})

const onVariationSelect = (variation: any) => {
    const fullVariation = props.product.variations_data?.find(
        (v: any) => v.id === variation.id
    )
    if (fullVariation) {
        emit('select-variation', fullVariation)
    }
}

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
}

const onBuyNow = () => {
    onAddToCart()
    navigateTo('/cart')
}
</script>
