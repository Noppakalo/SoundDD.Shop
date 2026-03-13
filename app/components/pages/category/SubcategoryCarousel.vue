<template>
    <UCarousel
        v-if="items && items.length > 0"
        :items="items"
        :ui="{
            viewport: 'px-2 py-4',
            controls: 'inset-x-10',
            item: 'basis-1/2 md:basis-1/3 lg:basis-1/4',
            prev: 'bg-white text-primary ring-0 shadow-sm transition-all duration-200 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
            next: 'bg-white text-primary ring-0 shadow-sm transition-all duration-200 active:scale-90 active:bg-primary/50 hover:bg-gray-50 disabled:opacity-50',
        }"
        arrows
    >
        <template v-slot="{ item }">
            <ULink
                :to="`${parentPath}/${item.slug}`"
                class="group hover:shadow-primary/20 relative mx-2 flex h-22 cursor-pointer items-center justify-center gap-6 overflow-hidden rounded-xl p-4 shadow-lg transition-transform"
            >
                <NuxtImg
                    v-if="item.acf?.image_category"
                    :src="item.acf.image_category.url"
                    :alt="item.acf.image_category.alt || item.name"
                    class="size-25 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                    v-else
                    class="flex items-center justify-center text-gray-400"
                >
                    <UIcon
                        name="i-iconamoon:folder-image-light"
                        class="size-12"
                    />
                </div>
                <p class="text-center text-sm font-semibold">
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
