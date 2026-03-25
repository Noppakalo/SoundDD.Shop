<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between">
            <div v-if="product.brands && product.brands.length > 0">
                <ULink
                    :to="`/brand/${product.brands[0]?.slug}`"
                    class="text-primary text-sm font-medium tracking-wide uppercase hover:underline"
                >
                    {{ product.brands[0]?.name }}
                </ULink>
            </div>
            <div v-if="displaySku" class="flex gap-1 text-xs text-gray-500">
                <p>
                    รหัสสินค้า : <span>{{ displaySku }}</span>
                </p>
            </div>
        </div>

        <h1 class="text-4xl font-bold">{{ product.name }}</h1>

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
                        <span class="line-through"
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
                        <span class="line-through"
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
                    <p class="text-sm">รวม VAT 7% แล้ว</p>
                </div>
            </div>
            <div v-else class="flex items-baseline gap-4">
                <p
                    v-if="
                        parseFloat(displayPriceData.regular) >
                        parseFloat(displayPriceData.sale)
                    "
                    class="text-xl text-gray-400 line-through"
                >
                    ฿{{ formatPrice(displayPriceData.regular) }}
                </p>
                <div class="flex items-baseline gap-2">
                    <p class="text-error text-4xl font-bold">
                        ฿{{ formatPrice(displayPriceData.sale) }}
                    </p>
                    <p class="text-sm">รวม VAT 7% แล้ว</p>
                </div>
            </div>
        </div>

        <div
            v-if="product.short_description"
            v-html="product.short_description"
            class="prose prose-sm max-w-none"
        ></div>

        <div v-if="variations.length > 0" class="flex flex-col gap-3">
            <p class="font-medium">
                {{ attributeName }} :
                <span class="text-primary ml-1 font-bold">{{
                    currentOptionName
                }}</span>
            </p>
            <div class="flex flex-wrap gap-2" role="radiogroup">
                <UButton
                    v-for="variation in variations"
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
                    class="min-w-[60px] justify-center"
                    @click="onVariationSelect(variation)"
                >
                    {{ variation.optionName }}
                </UButton>
            </div>
        </div>

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
                        class="flex-1 justify-center font-bold"
                        @click.prevent="onAddToCart"
                    >
                        ใส่ตะกร้า
                    </UButton>
                    <UButton
                        :disabled="isSoldOut"
                        color="primary"
                        size="lg"
                        class="flex-1 justify-center font-bold"
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

        <USeparator class="my-2" />
        <div class="flex flex-col gap-2 text-xs text-gray-600 sm:text-sm">
            <div class="text-error flex items-center gap-2 font-medium">
                <UIcon name="i-iconamoon:star-fill" />
                <p>
                    เช็ค Stock และราคาสินค้า กับเจ้าหน้าที่ก่อนสั่งซื้อทุกครั้ง
                </p>
            </div>
            <div class="flex items-center gap-2">
                <UIcon name="i-iconamoon:badge-light" class="text-success" />
                <p>
                    สงวนสิทธิ์การเปลี่ยนแปลงข้อมูล ราคา
                    โดยไม่แจ้งให้ทราบล่วงหน้า
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { formatPrice } from '~/utils/formatter'

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
        return {
            sale:
                props.selectedVariation.sale_price ||
                props.selectedVariation.regular_price,
            regular: props.selectedVariation.regular_price,
        }
    }
    return basePriceData.value
})

const attributeName = computed(() => {
    const variationAttr = props.product.attributes?.find(
        (attr: any) => attr.variation === true
    )
    const name =
        variationAttr?.name || props.product.attributes?.[0]?.name || 'ตัวเลือก'
    return decodeURIComponent(name)
})

const getOptionName = (v: any) => {
    if (!v?.attributes || v.attributes.length === 0) return 'Default'
    return v.attributes[0].option
        ? decodeURIComponent(v.attributes[0].option)
        : 'Default'
}

const variations = computed(() => {
    if (!props.product.variations_data) return []
    const uniqueVariations = new Map<string, any>()

    props.product.variations_data.forEach((v) => {
        const optionName = getOptionName(v)
        if (!uniqueVariations.has(optionName)) {
            uniqueVariations.set(optionName, {
                id: v.id,
                optionName,
                stock_status: v.stock_status,
            })
        }
    })
    return Array.from(uniqueVariations.values())
})

const currentOptionName = computed(() => {
    return props.selectedVariation ? getOptionName(props.selectedVariation) : ''
})

const displaySku = computed(
    () => props.selectedVariation?.sku || props.product.sku || ''
)

const isSoldOut = computed(() => {
    const status =
        props.selectedVariation?.stock_status || props.product.stock_status
    return status === 'outofstock' || status === 'onbackorder'
})

const onVariationSelect = (variation: any) => {
    const fullVariation = props.product.variations_data?.find(
        (v: any) => v.id === variation.id
    )
    if (fullVariation) emit('select-variation', fullVariation)
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
