<template>
    <UCarousel
        v-if="items && items.length > 0"
        :items="items"
        :ui="{
            viewport: 'px-2 py-4',
            controls: 'inset-x-10 max-sm:-inset-x-4',
            item: 'basis-1/2 sm:basis-1/4 lg:basis-1/6',
            prev: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
            next: 'bg-white text-primary ring-0 shadow-sm transition-all duration-300 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
        }"
        arrows
    >
        <template v-slot="{ item }">
            <ULink
                :to="`${parentPath}/${item.slug}`"
                class="group flex flex-col items-center gap-3"
            >
                <div
                    class="flex size-40 items-center justify-center overflow-hidden max-sm:size-36"
                >
                    <NuxtImg
                        v-if="item.acf?.image_category"
                        :src="item.acf.image_category.url"
                        :alt="item.acf.image_category.alt || item.name"
                        loading="lazy"
                        draggable="false"
                        class="size-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />

                    <div
                        v-else
                        class="flex size-full items-center justify-center rounded-full bg-gray-50 text-gray-400"
                    >
                        <UIcon
                            name="i-iconamoon:folder-image-light"
                            class="size-20"
                        />
                    </div>
                </div>
                <p class="px-2 text-center text-sm leading-tight font-semibold">
                    {{ item.name }}
                </p>
            </ULink>
        </template>
    </UCarousel>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        items: any[]
        parentPath?: string
    }>(),
    {
        parentPath: '/product-category',
    }
)
</script>
