<template>
    <div class="flex flex-col gap-2.5">
        <div class="group relative">
            <div
                class="absolute top-4 left-4 z-10 flex flex-col gap-2 tracking-wider"
            >
                <UBadge
                    v-if="product.stock_status === 'outofstock'"
                    color="error"
                    variant="solid"
                    size="md"
                >
                    สินค้าหมด
                </UBadge>
                <UBadge
                    v-else-if="product.on_sale"
                    color="error"
                    variant="solid"
                    size="xl"
                    class="rounded-full"
                >
                    {{
                        calculateDiscount(
                            product.regular_price,
                            product.price,
                            product.acf?.promotional_price || undefined
                        )
                    }}%
                </UBadge>
            </div>
            <UCarousel
                v-if="productImages.length"
                ref="carouselRef"
                v-slot="{ item }"
                :items="productImages"
                :ui="{
                    item: 'basis-full',
                    prev: 'bg-white text-primary ring-0 shadow-sm transition-all duration-200 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
                    next: 'bg-white text-primary ring-0 shadow-sm transition-all duration-200 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
                }"
                arrows
                @select="onSelect"
            >
                <NuxtImg
                    :src="item"
                    :alt="product.name"
                    loading="lazy"
                    draggable="false"
                    class="h-full w-full cursor-pointer rounded-2xl object-contain"
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
                class="absolute right-0 bottom-4 left-0 mx-auto w-120 px-4"
            >
                <NuxtImg
                    v-if="product.acf?.image_gift.url"
                    :src="product.acf?.image_gift.url"
                    :alt="product.acf?.image_gift.alt"
                    loading="lazy"
                    draggable="false"
                    class="relative size-full object-cover"
                />
            </div>
        </div>
        <div v-if="productImages.length > 1">
            <UCarousel
                v-slot="{ item, index }"
                :items="productImages"
                :ui="{
                    container: 'gap-3',
                    item: 'basis-auto',
                }"
                class="w-full"
            >
                <div
                    :ref="(el) => (thumbnailRefs[index] = el)"
                    class="size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white transition-all"
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
                        class="group absolute top-1/2 left-1/2 z-100 flex -translate-x-[min(45vw,calc(500px+5rem))] -translate-y-1/2 items-center justify-center rounded-full p-2 text-white ring transition-all active:scale-95"
                        :class="
                            indexRef === 0
                                ? 'cursor-not-allowed opacity-30'
                                : 'hover:text-primary hover:ring-primary cursor-pointer text-white ring-white hover:ring-2'
                        "
                        @click="indexRef > 0 && prev()"
                    >
                        <UIcon
                            name="i-iconamoon:arrow-left-2"
                            class="group-hover:text-primary size-8 transition-colors max-sm:size-5"
                        />
                    </div>
                </template>
                <template #next-btn="{ next }">
                    <div
                        class="group absolute top-1/2 right-1/2 z-100 flex translate-x-[min(45vw,calc(500px+5rem))] -translate-y-1/2 items-center justify-center rounded-full p-2 text-white ring transition-all active:scale-95"
                        :class="
                            indexRef === productImages.length - 1
                                ? 'cursor-not-allowed opacity-30'
                                : 'hover:text-primary hover:ring-primary cursor-pointer text-white ring-white hover:ring-2'
                        "
                        @click="indexRef < productImages.length - 1 && next()"
                    >
                        <UIcon
                            name="i-iconamoon:arrow-right-2"
                            class="group-hover:text-primary size-8 transition-colors max-sm:size-5"
                        />
                    </div>
                </template>
            </VueEasyLightbox>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import { calculateDiscount } from '~/utils/formatter'

const props = defineProps<{
    product: Product
    productImages: string[]
}>()

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
