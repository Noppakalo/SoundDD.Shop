<template>
    <div
        v-if="pending"
        class="grid gap-4"
        :class="
            viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
        "
    >
        <div
            v-for="i in 8"
            :key="i"
            :class="viewMode === 'list' ? 'h-48' : 'aspect-square'"
        >
            <USkeleton class="h-full w-full rounded-xl" />
        </div>
    </div>
    <div
        v-else-if="products && products.length > 0"
        class="grid gap-4 transition-opacity duration-300"
        :class="[
            viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1',
            pending ? 'opacity-50' : 'opacity-100',
        ]"
    >
        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :view-mode="viewMode"
        />
    </div>
    <div
        v-else
        class="rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 py-20 text-center"
    >
        <UIcon name="i-lucide-search-x" class="mb-4 text-5xl text-gray-300" />
        <p class="text-xl font-medium text-gray-900">
            ไม่พบสินค้าที่ตรงตามเงื่อนไข
        </p>
        <p class="text-sm text-gray-500">ลองปรับเปลี่ยนตัวกรองของคุณ</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    products: any[]
    pending: boolean
    viewMode: 'grid' | 'list'
}>()
</script>
