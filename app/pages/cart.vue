<template>
    <section class="py-8">
        <UContainer class="flex flex-col gap-4">
            <div
                v-if="items.length === 0"
                class="rounded-lg py-16 text-center shadow-sm"
            >
                <UIcon
                    name="i-iconamoon:shopping-bag"
                    class="mx-auto mb-4 h-20 w-20"
                />
                <p class="text-xl font-medium">ไม่มีสินค้าในตะกร้า</p>
                <UButton
                    to="/product"
                    color="primary"
                    size="lg"
                    aria-label="เลือกช้อปสินค้า"
                    >เลือกช้อปสินค้า</UButton
                >
            </div>
            <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="space-y-4 lg:col-span-2">
                    <div class="flex items-center justify-between">
                        <h1 class="text-3xl font-bold">ตะกร้าของฉัน</h1>
                        <UButton
                            v-if="items.length > 0"
                            color="error"
                            variant="ghost"
                            icon="i-lucide-trash-2"
                            aria-label="ลบสินค้าทั้งหมดออกจากตะกร้า"
                            @click="clearCart"
                        >
                            ล้างตะกร้า
                        </UButton>
                    </div>
                    <div
                        v-for="item in items"
                        :key="`${item.product.id}-${item.product.variation_id}`"
                        class="grid grid-cols-[auto_1fr] items-center justify-between gap-4 rounded-lg p-4 shadow-sm sm:grid-cols-[auto_1fr_20%] sm:gap-6"
                    >
                        <div
                            class="size-20 shrink-0 overflow-hidden rounded-lg"
                        >
                            <ULink :to="`/product/${item.product.slug}`">
                                <NuxtImg
                                    :src="
                                        item.product.images?.[0]?.src ||
                                        'https://via.placeholder.com/300'
                                    "
                                    :alt="item.product.name"
                                    loading="lazy"
                                    draggable="false"
                                    class="h-full w-full object-cover"
                                />
                            </ULink>
                        </div>
                        <div class="flex flex-col">
                            <ULink
                                :to="`/product/${item.product.slug}`"
                                aria-label="ดูรายละเอียดสินค้า"
                                class="hover:text-primary line-clamp-2 text-sm font-medium sm:text-base"
                            >
                                {{ item.product.name }}
                            </ULink>
                            <p v-if="getSelectedName(item)" class="text-xs">
                                {{ getSelectedName(item) }}
                            </p>
                        </div>
                        <div
                            class="col-span-2 flex items-center justify-between gap-2 border-t border-gray-50 pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-end sm:border-0 sm:pt-0"
                            aria-live="polite"
                        >
                            <div
                                v-if="item.product.sale_price"
                                class="flex flex-col items-start sm:items-end"
                            >
                                <div
                                    v-if="item.product.acf?.promotional_price"
                                    class="flex flex-col items-start sm:items-end"
                                >
                                    <div
                                        class="flex flex-col items-start text-xs text-gray-400 sm:items-end sm:text-sm"
                                    >
                                        <p
                                            v-if="
                                                parseFloat(
                                                    item.product.regular_price
                                                ) >
                                                parseFloat(
                                                    item.product.sale_price
                                                )
                                            "
                                        >
                                            ราคาปกติ
                                            <span
                                                class="line-through decoration-1"
                                                >฿{{
                                                    formatPrice(
                                                        item.product
                                                            .regular_price
                                                    )
                                                }}</span
                                            >
                                        </p>
                                        <p
                                            v-if="
                                                parseFloat(
                                                    item.product.acf
                                                        ?.promotional_price
                                                ) >
                                                parseFloat(
                                                    item.product.sale_price
                                                )
                                            "
                                        >
                                            โปรโมชันเดิม
                                            <span
                                                class="line-through decoration-1"
                                                >฿{{
                                                    formatPrice(
                                                        item.product.acf
                                                            .promotional_price
                                                    )
                                                }}</span
                                            >
                                        </p>
                                    </div>
                                    <p class="text-error text-lg font-bold">
                                        ฿{{
                                            formatPrice(item.product.sale_price)
                                        }}
                                    </p>
                                </div>
                                <div
                                    v-else
                                    class="flex flex-col items-start gap-0 sm:flex-row sm:items-baseline sm:gap-2"
                                >
                                    <p
                                        v-if="
                                            item.product.on_sale &&
                                            parseFloat(
                                                item.product.regular_price
                                            ) >
                                                parseFloat(
                                                    item.product.sale_price
                                                )
                                        "
                                        class="text-xs text-gray-400 line-through decoration-1 sm:text-sm"
                                    >
                                        ฿{{
                                            formatPrice(
                                                item.product.regular_price
                                            )
                                        }}
                                    </p>
                                    <p class="text-error text-lg font-bold">
                                        ฿{{
                                            formatPrice(item.product.sale_price)
                                        }}
                                    </p>
                                </div>
                            </div>
                            <div v-else class="flex flex-col items-end">
                                <p class="text-error text-lg font-bold">
                                    ฿{{
                                        formatPrice(item.product.regular_price)
                                    }}
                                </p>
                            </div>

                            <div class="flex gap-2">
                                <UInputNumber
                                    v-model="item.quantity"
                                    :min="1"
                                    size="sm"
                                    class="w-24 sm:w-auto"
                                    aria-label="แก้ไขจำนวนสินค้า"
                                    @update:model-value="
                                        (val) =>
                                            updateQuantity(
                                                item.product.id,
                                                item.product.variation_id,
                                                val ?? 1
                                            )
                                    "
                                />
                                <UButton
                                    color="neutral"
                                    variant="ghost"
                                    icon="i-lucide-trash"
                                    class="hover:text-error text-gray-400 hover:bg-rose-50"
                                    aria-label="ลบสินค้านี้ออกจากตะกร้า"
                                    @click="
                                        removeFromCart(
                                            item.product.id,
                                            item.product.variation_id
                                        )
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-1">
                    <div
                        class="sticky top-40 flex flex-col gap-4 rounded-lg p-6 shadow-sm"
                    >
                        <h2 class="text-lg font-bold">สรุปคำสั่งซื้อ</h2>
                        <div class="text-sm">
                            <div class="flex justify-between">
                                <p>จำนวนสินค้าทั้งหมด</p>
                                <p>{{ cartItemCount }} ชิ้น</p>
                            </div>
                            <div class="flex justify-between">
                                <p>ส่วนลดทั้งหมด</p>
                                <p>฿{{ cartItemCount }} ชิ้น</p>
                            </div>
                        </div>
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="text-lg font-bold">ยอดรวมทั้งสิ้น</p>
                                <p class="text-sm">ราคารวมภาษีมูลค่าเพิ่ม</p>
                            </div>
                            <p class="text-error text-lg font-bold">
                                ฿{{ formatPrice(cartTotal) }}
                            </p>
                        </div>
                        <UButton
                            to="/checkout"
                            color="primary"
                            size="xl"
                            block
                            aria-label="ดำเนินการชำระเงิน"
                            class="mt-2"
                        >
                            ดำเนินการชำระเงิน
                        </UButton>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
const {
    items,
    cartTotal,
    cartItemCount,
    removeFromCart,
    updateQuantity,
    clearCart,
} = useCart()

const getSelectedName = (item: any): string => {
    if (!item.product.variation_id || !item.product.variations_data) return ''
    const variation = item.product.variations_data.find(
        (v: any) => v.id === item.product.variation_id
    )
    if (!variation?.attributes || variation.attributes.length === 0) return ''
    return variation.attributes
        .map((attr: any) => {
            const option = attr.option ? decodeURIComponent(attr.option) : ''
            return `${option}`
        })
        .join(', ')
}
</script>
