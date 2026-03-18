<template>
    <section class="py-8">
        <UContainer>
            <div
                v-if="pending"
                class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16"
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

            <div v-else-if="error || !product" class="py-24 text-center">
                <UIcon
                    name="i-lucide-package-x"
                    class="mb-4 text-6xl text-gray-300"
                />
                <p class="mb-2 text-2xl font-bold text-gray-900">
                    ไม่พบสินค้าที่คุณค้นหา
                </p>
                <UButton to="/" color="primary" variant="solid" size="lg">
                    กลับสู่หน้าหลัก
                </UButton>
            </div>

            <div v-else class="flex flex-col gap-8">
                <UBreadcrumb
                    separator-icon="i-iconamoon:arrow-right-2"
                    :items="breadcrumbItems"
                />
                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <ProductImageGallery
                        :product="product"
                        :productImages="productImages"
                        :selectedVariation="selectedVariation"
                    />
                    <ProductDetailInfo
                        :product="product"
                        :selectedVariation="selectedVariation"
                        @select-variation="(v: any) => (manualSelection = v)"
                    />
                </div>
            </div>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const manualSelection = ref<any>(null)

onMounted(() => {
    if (route.query.variation_id || route.query.color) {
        router.replace({ query: {} })
    }
})

const {
    data: response,
    pending,
    error,
} = await useAsyncData(`product-${slug}`, () =>
    useWooProductApi().getProducts({ slug })
)

const product = computed(() => {
    if (response.value?.success && response.value?.data) {
        return Array.isArray(response.value.data)
            ? response.value.data[0]
            : response.value.data
    }
    return null
})

const selectedVariation = computed(() => {
    if (manualSelection.value) return manualSelection.value

    const state = import.meta.client ? history.state : null
    const varIdFromState = state?.variation_id
    const colorFromState = state?.color
    const varId = varIdFromState || route.query.variation_id
    const color = colorFromState || route.query.color

    if (!product.value?.variations_data) return null

    if (varId)
        return product.value.variations_data.find(
            (v: any) => v.id === Number(varId)
        )

    if (color) {
        return product.value.variations_data.find((v: any) =>
            v.attributes?.some(
                (attr: any) => decodeURIComponent(attr.option || '') === color
            )
        )
    }
    return null
})

const productImages = computed(() => {
    let imgs = (product.value?.images || []).map((img: any) => img?.src)
    if (selectedVariation.value?.images?.length) {
        const varImgs = selectedVariation.value.images.map(
            (img: any) => img.src
        )
        imgs = [
            ...varImgs,
            ...imgs.filter((src: string) => !varImgs.includes(src)),
        ]
    }
    return imgs.filter((src: string | null | undefined) => !!src)
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    { label: 'หน้าแรก', to: '/' },
    { label: 'สินค้า', to: '/product' },
    { label: product.value?.name || 'กำลังโหลด...', to: route.fullPath },
])
</script>
