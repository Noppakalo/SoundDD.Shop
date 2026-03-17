<template>
    <div class="flex flex-col gap-8">
        <div>
            <h2 class="text-xl font-bold">รายการสินค้าที่สนใจ</h2>
            <p>รวบรวมสินค้าที่ชอบ สำหรับคนพิเศษเช่นคุณ</p>
        </div>
        <div
            v-if="isLoadingWishlist"
            class="flex flex-col items-center justify-center py-20"
        >
            <UIcon
                name="i-svg-spinners:90-ring-with-bg"
                class="text-primary text-2xl"
            />
            <p>กำลังโหลดรายการสินค้าที่สนใจ...</p>
        </div>
        <div
            v-else-if="products.length > 0"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
            <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
            />
        </div>
        <div
            v-else
            class="flex w-full flex-col items-center justify-center gap-4 px-4 py-16"
        >
            <UIcon name="i-iconamoon:heart-light" class="text-5xl" />
            <p>ยังไม่มีสินค้าที่สนใจ</p>
            <UButton to="/product" color="primary">เลือกสินค้าที่สนใจ</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useWishlist } from '~/composables/useWishlist'
import { useWooProductApi } from '~/composables/useWooProductsApi'
import type { Product } from '~/types/product'

const { wishlistItems, isLoading } = useWishlist()
const { getProducts } = useWooProductApi()

const products = ref<Product[]>([])
const isLoadingWishlist = ref(true)

const loadWishlistProducts = async () => {
    isLoadingWishlist.value = true
    if (isLoading.value) {
        return
    }
    if (wishlistItems.value.length === 0) {
        products.value = []
        isLoadingWishlist.value = false
        return
    }

    const ids = wishlistItems.value.join(',')
    const response = await getProducts({ include: ids, limit: 100 })

    if (response.success && response.data) {
        products.value = response.data
    } else {
        products.value = []
    }

    isLoadingWishlist.value = false
}

watch(
    () => wishlistItems.value,
    (newVal) => {
        if (!isLoading.value) {
            loadWishlistProducts()
        }
    },
    { deep: true }
)

watch(isLoading, (newVal) => {
    if (!newVal) {
        loadWishlistProducts()
    }
})

onMounted(() => {
    loadWishlistProducts()
})
</script>
