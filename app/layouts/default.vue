<template>
    <div>
        <Navbar />
        <main>
            <slot />
        </main>
        <ServiceFeatures />
        <MobileNavbar />
        <Footer />
    </div>
</template>

<script setup lang="ts">
const siteName: string = 'SoundDD.shop'
const route = useRoute()

const canonicalPath = computed(() => `https://www.sounddd.shop${route.path}`)

useHead({
    htmlAttrs: {
        lang: 'th',
        dir: 'ltr',
    },
    titleTemplate: (titleChunk?: string): string => {
        return titleChunk ? `${siteName} | ${titleChunk}` : siteName
    },
    meta: [
        { name: 'theme-color', content: '#1878f1' },
        { name: 'color-scheme', content: 'light' },
        { name: 'application-name', content: 'SoundDD.shop' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'SoundDD.shop' },
        { name: 'msapplication-TileColor', content: '#1878f1' },
        {
            name: 'msapplication-TileImage',
            content: '/favicon/SoundDD-window-icon-144x144.png',
        },
    ],
    link: [
        { rel: 'canonical', href: canonicalPath.value },
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
        { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
        {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon/favicon.ico',
        },
        {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/favicon/SoundDD-favicon.svg',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicon/SoundDD-16x16.png',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicon/SoundDD-32x32.png',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '96x96',
            href: '/favicon/SoundDD-96x96.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            type: 'image/png',
            href: '/favicon/SoundDD-180x180.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
    ],
})
</script>
