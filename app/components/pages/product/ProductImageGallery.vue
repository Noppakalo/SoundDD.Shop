<template>
    <div class="flex flex-col gap-2.5">
        <div class="group relative">
            <div
                class="absolute top-4 left-4 z-30 flex flex-col gap-2 tracking-wider"
            >
                <UBadge
                    v-if="displayPriceData.discount"
                    color="error"
                    variant="solid"
                    size="xl"
                    class="rounded-full"
                >
                    {{ displayPriceData.discount }}%
                </UBadge>
            </div>
            <UCarousel
                v-if="productImages.length"
                ref="carouselRef"
                v-slot="{ item }"
                :items="productImages"
                :ui="{
                    item: 'basis-full',
                    prev: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90  active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50 z-30',
                    next: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50 z-30',
                }"
                :arrows="productImages.length > 1"
                @select="onSelect"
            >
                <NuxtImg
                    :src="item"
                    :alt="product.name"
                    loading="lazy"
                    draggable="false"
                    class="relative size-full cursor-pointer rounded-2xl object-contain"
                    @click="showLightbox(activeIndex)"
                />
            </UCarousel>
            <div
                v-else
                class="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400"
            >
                <UIcon
                    name="i-iconamoon:folder-image-light"
                    class="size-20"
                    aria-hidden="true"
                />
            </div>
            <div
                v-if="product.acf?.image_gift"
                class="absolute right-0 bottom-0 left-0 z-10 px-4"
            >
                <NuxtImg
                    v-if="product.acf?.image_gift.url"
                    :src="product.acf?.image_gift.url"
                    :alt="product.acf?.image_gift.alt"
                    loading="lazy"
                    draggable="false"
                    class="relative mx-auto object-cover sm:w-140 lg:w-120"
                />
            </div>
            <div
                v-if="isSoldOut"
                class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/30"
            >
                <div
                    class="bg-primary/80 absolute bottom-0 flex w-full items-center justify-center rounded-b-2xl py-2"
                >
                    <p class="text-lg font-bold text-white">
                        {{
                            currentStockStatus === 'outofstock'
                                ? 'สินค้าหมด'
                                : 'สินค้าหมดชั่วคราว'
                        }}
                    </p>
                </div>
            </div>
        </div>
        <div v-if="productImages.length > 1">
            <UCarousel
                v-slot="{ item, index }"
                :items="productImages"
                :ui="{
                    container: 'gap-3 max-sm:gap-0',
                    item: 'basis-auto',
                }"
                class="w-full"
            >
                <div
                    :ref="(el) => (thumbnailRefs[index] = el)"
                    class="size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white transition-all max-sm:border-2"
                    :class="
                        activeIndex === index
                            ? 'border-primary opacity-100 shadow-sm'
                            : 'border-gray-400 opacity-50 hover:opacity-100'
                    "
                    @click="selectThumbnail(index)"
                >
                    <NuxtImg
                        :src="item"
                        loading="lazy"
                        draggable="false"
                        class="pointer-events-none h-full w-full rounded-md object-contain select-none"
                    />
                </div>
            </UCarousel>
        </div>
        <ClientOnly>
            <VueEasyLightbox
                :visible="visibleRef"
                :imgs="productImages"
                :rotate-disabled="true"
                :move-disabled="true"
                :loop="false"
                :index="indexRef"
                class="bg-black backdrop-blur-sm"
                @on-index-change="
                    (oldIdx: number, newIdx: number) => (indexRef = newIdx)
                "
                @hide="onHide"
            >
                <template #close-btn>
                    <div
                        class="hover:text-primary absolute top-6 right-6 z-100 cursor-pointer text-white transition-colors disabled:cursor-not-allowed"
                        @click="onHide"
                    >
                        <UIcon
                            name="i-iconamoon:close-duotone"
                            class="size-10"
                        />
                    </div>
                </template>
                <template #prev-btn="{ prev }">
                    <div
                        :aria-disabled="indexRef === 0"
                        class="text-primary active:bg-primary/50 absolute top-1/2 z-100 flex size-12 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:bg-gray-50 active:scale-90"
                        :class="[
                            'left-1/2 -translate-x-[min(48vw,480px)] -translate-y-1/2',
                            'aria-disabled:cursor-not-allowed aria-disabled:opacity-30',
                            'cursor-pointer opacity-100',
                        ]"
                        @click="indexRef > 0 ? prev() : null"
                    >
                        <UIcon name="i-iconamoon:arrow-left-2" class="size-6" />
                    </div>
                </template>
                <template #next-btn="{ next }">
                    <div
                        :aria-disabled="indexRef === productImages.length - 1"
                        class="text-primary active:bg-primary/50 absolute top-1/2 z-100 flex size-12 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 hover:bg-gray-50 active:scale-90"
                        :class="[
                            'right-1/2 translate-x-[min(48vw,480px)] -translate-y-1/2',
                            'aria-disabled:cursor-not-allowed aria-disabled:opacity-30',
                            'cursor-pointer opacity-100',
                        ]"
                        @click="
                            indexRef < productImages.length - 1 ? next() : null
                        "
                    >
                        <UIcon
                            name="i-iconamoon:arrow-right-2"
                            class="size-6"
                        />
                    </div>
                </template>
            </VueEasyLightbox>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{
    product: Product
    productImages: string[]
    selectedVariation?: any
}>()

const { displayPriceData: basePriceData } = useProductPrice(() => props.product)

const displayPriceData = computed(() => {
    if (props.selectedVariation) {
        const v = props.selectedVariation
        const sale = v.sale_price || v.regular_price
        const regular = v.regular_price
        const discount =
            sale && regular && parseFloat(regular) > parseFloat(sale)
                ? Math.round(
                      ((parseFloat(regular) - parseFloat(sale)) /
                          parseFloat(regular)) *
                          100
                  )
                : null
        return { sale, regular, discount }
    }
    return basePriceData.value
})

const currentStockStatus = computed(() => {
    return props.selectedVariation?.stock_status || props.product.stock_status
})

const isSoldOut = computed(
    () =>
        currentStockStatus.value === 'outofstock' ||
        currentStockStatus.value === 'onbackorder'
)

const carouselRef = useTemplateRef('carouselRef')
const activeIndex = ref(0)
const thumbnailRefs = ref<any[]>([])

const visibleRef = ref(false)
const indexRef = ref(0)

function onSelect(index: number) {
    activeIndex.value = index
    const activeThumb = thumbnailRefs.value[index]
    if (activeThumb) {
        activeThumb.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        })
    }
}

function selectThumbnail(index: number) {
    activeIndex.value = index
    carouselRef.value?.emblaApi?.scrollTo(index)
}

function showLightbox(index: number) {
    indexRef.value = index
    visibleRef.value = true
}
function onHide() {
    visibleRef.value = false
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

:deep(.vel-img) {
    border-radius: var(--radius-4xl);
    box-shadow: var(--shadow-xs);
    background: white;
    aspect-ratio: 1/1;
}
</style>
