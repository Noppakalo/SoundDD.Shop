<template>
    <UCarousel
        v-if="youtubeItems.length > 0"
        v-slot="{ item }"
        :items="youtubeItems"
        :ui="{
            viewport: 'px-2 py-4',
            controls: 'inset-x-10 max-sm:-inset-x-4',
            item: 'basis-1/2 lg:basis-1/4',
            prev: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
            next: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
        }"
        arrows
    >
        <div class="video-card w-full">
            <div
                class="aspect-video w-full overflow-hidden rounded-xl"
                v-html="item"
            ></div>
        </div>
    </UCarousel>
    <p v-else-if="!youtubeList" class="text-center text-gray-400">
        กำลังโหลดวิดีโอ...
    </p>
</template>

<script setup lang="ts">
const props = defineProps<{
    youtubeList: Record<string, string> | undefined
}>()

const youtubeItems = computed(() => {
    const list = props.youtubeList
    if (!list) return []

    return Object.values(list).filter((content) => {
        return typeof content === 'string' && content.includes('<iframe')
    })
})
</script>

<style scoped>
.video-card :deep(iframe) {
    width: 100% !important;
    height: 100% !important;
}
</style>
