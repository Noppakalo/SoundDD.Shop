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
                <UButton to="/product" color="primary" size="lg"
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
                            @click="clearCart"
                        >
                            ล้างตะกร้า
                        </UButton>
                    </div>
                    <div
                        v-for="item in items"
                        :key="item.product.id"
                        class="grid grid-cols-[auto_1fr_20%] items-center justify-between gap-6 rounded-lg p-4 shadow-sm"
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
                        <ULink
                            :to="`/product/${item.product.slug}`"
                            class="hover:text-primary line-clamp-2 font-medium"
                        >
                            {{ item.product.name }}
                        </ULink>
                        <div>
                            <div
                                v-if="item.product.sale_price"
                                class="mt-auto flex flex-col items-end"
                            >
                                <div
                                    v-if="item.product.acf?.promotional_price"
                                    class="flex flex-col items-end"
                                >
                                    <div
                                        class="flex flex-col items-end text-sm text-gray-400"
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
                                            ราคาโปรโมชันเดิม
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
                                <div v-else class="flex items-baseline gap-2">
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
                                        class="text-gray-400 line-through decoration-1"
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
                                    ฿{{ formatPrice(item.product.regular_price) }}
                                </p>
                            </div>
                            <div class="flex gap-2">
                                <UInputNumber
                                    v-model="item.quantity"
                                    :min="1"
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
                                    @click="removeFromCart(item.product.id)"
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
</script>
