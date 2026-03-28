<template>
    <section>
        <UContainer class="py-6">
            <UCarousel
                v-slot="{ item }"
                :prev="{ color: 'primary' }"
                :next="{ color: 'primary' }"
                :items="items"
                :autoplay="{ delay: 5000 }"
                arrows
                dots
                wheel-gestures
            >
                <ULink :to="item.link" :aria-label="`ดูโปรโมชั่น ${item.alt}`">
                    <NuxtImg
                        v-if="item.src"
                        :src="item.src"
                        :alt="item.alt"
                        loading="lazy"
                        draggable="false"
                        class="w-full cursor-pointer rounded-2xl object-cover"
                    />
                    <div
                        v-else
                        class="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-gray-100 text-gray-400"
                    >
                        <UIcon
                            name="i-iconamoon:folder-image-light"
                            class="size-20"
                            aria-hidden="true"
                        />
                    </div>
                </ULink>
            </UCarousel>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
interface CarouselItem {
    src: string
    alt: string
    link: string
}

const { data: promotionsData } = await useAsyncData('promotions', () =>
    $fetch('/api/woo/promotion')
)

const items = computed<CarouselItem[]>(() => {
    if (!promotionsData.value?.success || !promotionsData.value?.data) {
        return []
    }

    return promotionsData.value.data.map((promotion) => ({
        src: promotion.acf.image_promotion.url,
        alt: promotion.acf.image_promotion.alt || 'Promotion',
        link: promotion.acf.link_promotion,
    }))
})
</script>
