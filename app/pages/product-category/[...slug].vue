<template>
    <section class="py-8">
        <UContainer>
            <div
                v-if="pending"
                class="grid grid-cols-1 gap-8 md:grid-cols-4"
                aria-hidden="true"
            >
                <div class="col-span-1 hidden md:block">
                    <USkeleton class="h-64 w-full rounded-xl" />
                </div>
                <div class="md:col-span-3">
                    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <div v-for="i in 8" :key="i" class="aspect-square">
                            <USkeleton class="h-full w-full rounded-xl" />
                        </div>
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
            <div v-else class="flex flex-col gap-6">
                <CategoryHero :category="category" />
                <SubcategoryCarousel
                    :items="subcategories"
                    :parent-path="route.path"
                />
                <div class="flex flex-col gap-4 max-sm:items-center">
                    <p>
                        สินค้าทั้งหมดใน
                        <span class="font-bold">"{{ category?.name }}"</span>
                        <span class="text-sm">
                            ({{ category?.count }} รายการ)</span
                        >
                    </p>
                    <ProductFilter
                        v-model:view-mode="viewMode"
                        v-model:sort-options="sortOptions"
                        v-model:filters="filters"
                        :category="category"
                        :brands="brands"
                        :categories="subcategories"
                    />
                </div>
                <ProductGrid
                    :category="category"
                    :filters="filters"
                    :sort-options="sortOptions"
                    :view-mode="viewMode"
                />
            </div>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug
const actualSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug

const sortOptions = ref({ orderby: 'date', order: 'desc' })
const viewMode = ref<'grid' | 'list'>('grid')

const filters = ref({
    minPrice: 0,
    maxPrice: 1000000,
    brands: [] as number[],
    attributes: {} as Record<string, string[]>,
    categories: [] as number[],
})

const {
    data: catResponse,
    pending,
    error,
} = await useAsyncData(`category-${actualSlug}`, () =>
    useWooCategoriesApi().getCategories({ slug: actualSlug })
)

const category = computed(() => {
    if (catResponse.value?.success && catResponse.value?.data) {
        return Array.isArray(catResponse.value.data)
            ? catResponse.value.data[0]
            : catResponse.value.data
    }
    return null
})

const { data: subResponse } = await useAsyncData(
    `subcategories-${actualSlug}`,
    () => {
        if (!category.value?.id)
            return Promise.resolve({ success: true, data: [] })
        return useWooCategoriesApi().getCategories({
            parent: category.value.id,
            hide_empty: false,
        })
    },
    { watch: [category] }
)

const subcategories = computed(() =>
    subResponse.value?.success ? subResponse.value.data : []
)

const { data: brandsResponse } = await useAsyncData(
    `brands-${actualSlug}`,
    () => useWooBrandsApi().getBrands()
)

const brands = computed(() =>
    brandsResponse.value?.success ? brandsResponse.value.data : []
)
</script>
