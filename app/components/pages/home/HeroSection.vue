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
            >
                <ULink :to="item.link">
                    <NuxtImg
                        :src="item.src"
                        :alt="item.alt"
                        loading="lazy"
                        draggable="false"
                        class="w-full cursor-pointer rounded-2xl object-cover"
                    />
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

const items = computed<CarouselItem[]>(() => [
    {
        src: '/images/promotions/Valentines-Special-Deal-FEB2026.webp',
        alt: 'GA4 SEO Result',
        link: 'https://www.sounddd.shop/?s=soundvision+raptor&post_type=product&dgwt_wcas=1&orderby=relevance',
    },
    {
        src: '/images/promotions/SVS-Raptor-Series-Desktop-Banner.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/SOUNDDD-Chinese-New-year-FEB2026.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/dBTechnologies_Sub.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/Banner-Wiim-Sound-JAN2026.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/Banner-RODE-POD-mic-JAN2026.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/Banner-QSC-KC12-JAN2026.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/Banner-Mixer-TOA-M-124FX-JAN2026.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/promotions/Banner-Klipsch-ProMedia-Lumina-JAN2026.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
    {
        src: '/images/promotions/Banner-Jabra-Speak-2-JAN2026webp.webp',
        alt: 'Keyword SEO Result',
        link: '/blog?tag=ga4',
    },
])
</script>
