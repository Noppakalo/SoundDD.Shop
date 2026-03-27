<template>
    <div>
        <div
            v-if="pending && products.length === 0"
            class="grid gap-4"
            :class="
                viewMode === 'grid'
                    ? 'grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1'
            "
            aria-hidden="true"
        >
            <div
                v-for="i in 16"
                :key="i"
                :class="viewMode === 'list' ? 'h-48' : 'aspect-square'"
            >
                <USkeleton class="h-full w-full rounded-xl" />
            </div>
        </div>
        <div
            v-else-if="products && products.length > 0"
            class="flex flex-col gap-8"
        >
            <div
                class="grid gap-4 transition-opacity duration-300"
                :class="
                    viewMode === 'grid'
                        ? 'grid-cols-2 lg:grid-cols-4'
                        : 'grid-cols-1'
                "
                role="list"
                :aria-label="`รายการสินค้าในหมวดหมู่ ${category?.name || ''}`"
            >
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                    :view-mode="viewMode"
                    role="listitem"
                />
            </div>
            <div
                v-if="!isNoMoreProducts && products.length > 0"
                class="flex flex-col items-center gap-4"
                aria-live="polite"
            >
                <UButton
                    :loading="loadingMore"
                    label="ดูสินค้าเพิ่มเติม"
                    color="primary"
                    variant="soft"
                    icon="i-iconamoon:arrow-down-2-light"
                    aria-label="โหลดสินค้าเพิ่มเติมจากรายการเดิม"
                    @click="handleLoadMore"
                />
                <p>
                    แสดงอยู่ {{ products.length }} จาก
                    {{ category?.count || 0 }} รายการ
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    category: any
    filters: {
        minPrice: number
        maxPrice: number
        brands: number[]
        attributes: Record<string, string[]>
        categories: number[]
    }
    sortOptions: { orderby: string; order: string }
    viewMode: 'grid' | 'list'
}>()

const route = useRoute()
const slug = route.params.slug
const actualSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug

const currentPage = ref(1)
const products = useState<any[]>(`products-${actualSlug}`, () => [])
const isNoMoreProducts = useState(`nomore-${actualSlug}`, () => false)
const loadingMore = ref(false)

const { pending: productsPending, refresh: fetchProducts } = await useAsyncData(
    `products-fetch-${actualSlug}`,
    async () => {
        if (!props.category?.id) return { success: true, data: [] }

        const params: any = {
            category: props.category.id,
            min_price: props.filters.minPrice,
            max_price: props.filters.maxPrice,
            orderby: props.sortOptions.orderby,
            order: props.sortOptions.order,
            page: currentPage.value,
            limit: 16,
        }

        if (props.filters.brands && props.filters.brands.length > 0) {
            params.brand = props.filters.brands.join(',')
        }

        if (props.filters.categories && props.filters.categories.length > 0) {
            const allCategories = [
                props.category.id,
                ...props.filters.categories,
            ]
            params.category = allCategories.join(',')
        }

        const res = await useWooProductApi().getProducts(params)

        if (res.success) {
            if (res.data.length < 16) {
                isNoMoreProducts.value = true
            } else {
                isNoMoreProducts.value = false
            }
            if (currentPage.value === 1) {
                products.value = res.data
            } else {
                products.value = [...products.value, ...res.data]
            }
        }
        return res
    }
)

const pending = computed(() => productsPending.value && currentPage.value === 1)

const handleLoadMore = async () => {
    loadingMore.value = true
    currentPage.value++
    await fetchProducts()
    loadingMore.value = false
}

watch(
    () => [
        props.category?.id,
        props.filters.minPrice,
        props.filters.maxPrice,
        props.filters.brands?.length,
        props.filters.categories?.length,
        Object.keys(props.filters.attributes).length,
        props.sortOptions.orderby,
        props.sortOptions.order,
    ],
    async () => {
        if (props.category?.id) {
            currentPage.value = 1
            products.value = []
            isNoMoreProducts.value = false
            await fetchProducts()
        }
    }
)
</script>
