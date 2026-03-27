<template>
    <section>
        <UContainer class="flex flex-col gap-6 py-6">
            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <h2
                        v-if="title"
                        class="flex-1 text-3xl font-bold whitespace-nowrap"
                        :class="
                            align === 'center' ? 'text-center' : 'text-left'
                        "
                    >
                        {{ title }}
                    </h2>
                    <UButton
                        :to="displayLink"
                        :aria-label="
                            categoryInfo?.name
                                ? `ดูสินค้าทั้งหมดในหมวดหมู่ ${categoryInfo.name}`
                                : 'ดูสินค้าทั้งหมด'
                        "
                        trailing-icon="i-iconamoon:arrow-right-6-circle"
                        color="primary"
                        variant="ghost"
                        class="px-2.5 whitespace-nowrap"
                    >
                        ดูทั้งหมด
                    </UButton>
                </div>
                <UCarousel
                    v-if="subcategories && subcategories.length > 0"
                    v-slot="{ item }"
                    :items="subcategories"
                    wheel-gestures
                    :ui="{
                        item: 'basis-auto',
                    }"
                >
                    <UButton
                        :key="item.id"
                        :aria-label="`แสดงสินค้าหมวดหมู่ ${item.name}`"
                        :variant="
                            activeCategoryId === item.id ? 'solid' : 'outline'
                        "
                        :color="
                            activeCategoryId === item.id
                                ? 'primary'
                                : 'secondary'
                        "
                        size="md"
                        class="mx-1 flex-none rounded-full whitespace-nowrap"
                        @click="activeCategoryId = item.id"
                    >
                        {{ item.name }}
                    </UButton>
                </UCarousel>
            </div>
            <div v-if="pending" class="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div
                    v-for="i in 4"
                    :key="i"
                    class="flex flex-col overflow-hidden rounded-xl shadow-lg"
                >
                    <USkeleton class="aspect-square w-full rounded-none" />
                    <div class="flex flex-1 flex-col justify-between gap-2 p-4">
                        <div class="min-h-[3rem] space-y-2">
                            <USkeleton class="h-4 w-full" />
                            <USkeleton class="h-4 w-5/6" />
                        </div>
                        <div class="flex h-14 items-end justify-between">
                            <div
                                class="flex flex-col justify-end space-y-1.5 pb-1"
                            >
                                <USkeleton class="h-3 w-16" />
                                <USkeleton class="h-5 w-24" />
                                <USkeleton class="h-3 w-20" />
                            </div>
                            <div class="flex gap-2">
                                <USkeleton class="size-9.5 rounded-full" />
                                <USkeleton class="size-9.5 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UCarousel
                v-slot="{ item }"
                v-else-if="availableProducts.length"
                :items="availableProducts"
                wheel-gestures
                :ui="{
                    viewport: 'px-2 pb-4',
                    controls: 'sm:inset-x-10 max-sm:-inset-x-4',
                    item: 'basis-1/2 md:basis-1/3 lg:basis-1/4',
                    prev: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
                    next: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
                }"
                arrows
            >
                <ProductCard :product="item" class="w-full" />
            </UCarousel>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
interface Props {
    title?: string
    categoryId?: number
    limit?: number
    align?: 'left' | 'center'
}

const props = withDefaults(defineProps<Props>(), {
    align: 'left',
})

const activeCategoryId = ref(props.categoryId)
const { getProducts } = useWooProductApi()
const { getCategories } = useWooCategoriesApi()

const { data: categoryInfo } = await useAsyncData(
    `category-link-${props.categoryId}`,
    async () => {
        if (!props.categoryId) return null
        const res = await getCategories({ include: [props.categoryId] })
        return res?.data?.[0] || null
    }
)

const displayLink = computed(() => {
    if (categoryInfo.value?.slug) {
        return `/product-category/${categoryInfo.value.slug}`
    }
    return '/product-category'
})

const { data: subcategories } = await useAsyncData(
    `subcategories-${props.categoryId || 'all'}`,
    async () => {
        if (!props.categoryId) return []
        const res = await getCategories({
            parent: props.categoryId,
            hide_empty: false,
        })

        let data = res?.data || []

        data = data.sort((a, b) => a.id - b.id)

        if (data.length > 0 && !activeCategoryId.value) {
            activeCategoryId.value = data[0]?.id
        }

        return data
    }
)

const { data: products, pending } = await useAsyncData(
    `products-carousel-${props.categoryId || 'all'}`,
    () =>
        getProducts({
            per_page: props.limit || 10,
            category: activeCategoryId.value,
            orderby: 'date',
            order: 'desc',
        }),
    {
        watch: [activeCategoryId],
    }
)

const availableProducts = computed(() => {
    if (!products.value?.data) return []
    return (products.value.data as any[]).filter(
        (p) => p.stock_status !== 'outofstock'
    )
})

watch(
    subcategories,
    (newVal) => {
        if (
            newVal &&
            newVal.length > 0 &&
            activeCategoryId.value === props.categoryId
        ) {
            activeCategoryId.value = newVal[0]?.id
        }
    },
    { immediate: true }
)
</script>
