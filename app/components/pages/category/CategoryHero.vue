<template>
    <UBreadcrumb
        separator-icon="i-iconamoon:arrow-right-2"
        :items="breadcrumbItems"
    />
    <div
        class="relative flex flex-col justify-center gap-2 overflow-hidden rounded-lg bg-gray-900 p-6 text-white shadow-lg"
    >
        <NuxtImg
            v-if="category?.image?.src"
            :src="category.image.src"
            :alt="category.image.alt || category.name"
            loading="lazy"
            draggable="false"
            class="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div class="relative z-20 text-white">
            <h1 class="text-4xl font-bold">{{ category?.name }}</h1>
            <p v-if="category?.description" class="line-clamp-2 max-w-2xl">
                {{ category.description }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const props = defineProps<{
    category: any
}>()

const route = useRoute()
const ancestors = ref<any[]>([])

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
        { label: 'หน้าแรก', to: '/' },
        { label: 'หมวดหมู่สินค้า', to: '/product-category' },
    ]
    const pathSegments: string[] = []
    ancestors.value.forEach((anc) => {
        pathSegments.push(anc.slug)
        items.push({
            label: anc.name,
            to: `/product-category/${pathSegments.join('/')}`,
        })
    })
    if (props.category) {
        items.push({
            label: props.category.name,
            to: route.path,
        })
    } else {
        items.push({
            label: 'กำลังโหลด...',
            to: route.path,
        })
    }
    return items
})

watch(
    () => props.category,
    async (newCat) => {
        ancestors.value = []
        if (!newCat || !newCat.parent) return

        let currentParentId = newCat.parent
        const fetchedAncestors = []

        while (currentParentId > 0) {
            const res = await useWooCategoriesApi().getCategories({
                include: currentParentId,
            })
            if (res.success && res.data && res.data.length > 0) {
                const parentObj = res.data[0]
                if (parentObj) {
                    fetchedAncestors.unshift(parentObj)
                    currentParentId = parentObj.parent
                } else {
                    break
                }
            } else {
                break
            }
        }
        ancestors.value = fetchedAncestors
    },
    { immediate: true }
)
</script>
