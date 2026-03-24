<template>
    <section class="py-8" role="main" :aria-busy="pending">
        <UContainer>
            <div
                v-if="pending"
                class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16"
                aria-hidden="true"
            >
                <div class="aspect-square w-full">
                    <USkeleton class="h-full w-full rounded-2xl" />
                </div>
                <div class="space-y-6">
                    <USkeleton class="h-10 w-full md:w-3/4" />
                    <USkeleton class="h-6 w-1/4" />
                    <div class="space-y-4 pt-6">
                        <USkeleton class="h-12 w-full" />
                        <USkeleton class="h-12 w-full" />
                    </div>
                </div>
            </div>
            <div v-else-if="error || !category" class="py-24 text-center">
                <UIcon
                    name="i-lucide-package-x"
                    class="mb-4 text-6xl text-gray-300"
                />
                <p class="mb-2 text-2xl font-bold text-gray-900">
                    ไม่พบหมวดหมู่ที่คุณค้นหา
                </p>
                <UButton
                    to="/"
                    color="primary"
                    variant="solid"
                    size="lg"
                    aria-label="กลับสู่หน้าหลัก"
                    >กลับสู่หน้าหลัก</UButton
                >
            </div>
            <div v-else class="flex flex-col gap-8">
                <div class="flex flex-col gap-2 rounded-lg p-2">
                    <UBreadcrumb
                        separator-icon="i-iconamoon:arrow-right-2"
                        :items="breadcrumbItems"
                    />
                    <h1>{{ category?.name }}</h1>
                </div>
            </div>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const slug = route.params.slug as string

const {
    data: response,
    pending,
    error,
} = await useAsyncData(`category-${slug}`, () =>
    useWooCategoriesApi().getCategories({ slug })
)

const category = computed(() => {
    if (response.value?.success && response.value?.data) {
        return Array.isArray(response.value.data)
            ? response.value.data[0]
            : response.value.data
    }
    return null
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    { label: 'หน้าแรก', to: '/' },
    { label: category.value?.name || 'หมวดหมู่', to: route.fullPath },
])
</script>
