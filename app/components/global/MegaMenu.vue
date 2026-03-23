<template>
    <UPopover
        mode="hover"
        :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
        }"
    >
        <UButton
            icon="i-tabler:layout-grid"
            label="สินค้าทั้งหมด"
            color="primary"
            size="md"
        />
        <template #content>
            <div
                class="flex h-[500px] w-[900px] overflow-hidden rounded-xl bg-white px-2 shadow-2xl"
            >
                <aside
                    class="custom-scrollbar w-1/4 overflow-y-auto border-r border-gray-100 bg-gray-50/50 p-2"
                >
                    <p class="text-lg font-bold">สินค้าทั้งหมด</p>
                    <div class="space-y-1">
                        <div
                            v-for="cat in categoryTree"
                            :key="cat.id"
                            @mouseenter="activeTab = cat.id"
                            class="group flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all"
                            :class="[
                                activeTab === cat.id
                                    ? 'text-primary bg-white shadow-sm'
                                    : 'hover:text-primary text-gray-600 hover:bg-white',
                            ]"
                        >
                            <NuxtImg
                                v-if="cat.acf?.image_category"
                                :src="cat.acf.image_category.url"
                                loading="lazy"
                                draggable="false"
                                class="size-6 object-contain"
                            />
                            <UIcon
                                v-else
                                name="i-iconamoon:category-light"
                                class="size-6 opacity-50"
                            />
                            <span class="text-sm font-semibold">{{
                                cat.name
                            }}</span>
                            <UIcon
                                name="i-heroicons-chevron-right-20-solid"
                                class="ms-auto size-4 opacity-0 group-hover:opacity-100"
                            />
                        </div>
                    </div>
                </aside>

                <main class="custom-scrollbar flex-1 overflow-y-auto p-6">
                    <div v-if="activeCategory" class="space-y-8">
                        <div
                            class="flex items-center justify-between border-b border-gray-100 pb-4"
                        >
                            <h2 class="text-xl font-bold text-gray-900">
                                {{ activeCategory.name }}
                            </h2>
                            <ULink
                                :to="`/product-category/${activeCategory.slug}`"
                                class="text-primary flex items-center gap-1 text-xs font-bold hover:underline"
                            >
                                ดูทั้งหมด
                                <UIcon
                                    name="i-heroicons-arrow-right-20-solid"
                                />
                            </ULink>
                        </div>

                        <div
                            v-if="activeCategory.children?.length"
                            class="grid grid-cols-3 gap-4"
                        >
                            <ULink
                                v-for="sub in activeCategory.children"
                                :key="sub.id"
                                :to="`/product-category/${sub.slug}`"
                                class="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-gray-100 hover:bg-gray-50 hover:shadow-sm"
                            >
                                <div
                                    class="size-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
                                >
                                    <NuxtImg
                                        v-if="sub.acf?.image_category"
                                        :src="sub.acf.image_category.url"
                                        loading="lazy"
                                        draggable="false"
                                        class="h-full w-full object-contain p-1 transition-transform group-hover:scale-110"
                                    />
                                </div>
                                <div class="flex flex-col">
                                    <span
                                        class="text-sm font-bold text-gray-800"
                                        >{{ sub.name }}</span
                                    >
                                    <span class="text-[10px] text-gray-400"
                                        >{{ sub.count }} รายการ</span
                                    >
                                </div>
                            </ULink>
                        </div>
                        <div
                            v-else
                            class="py-10 text-center text-sm text-gray-400 italic"
                        >
                            ไม่มีหมวดหมู่ย่อยในส่วนนี้
                        </div>

                        <div
                            v-if="activeCategory.children?.length"
                            class="pt-4"
                        >
                            <h4
                                class="mb-4 text-xs font-bold text-gray-400 uppercase"
                            >
                                แบรนด์ที่เกี่ยวข้อง
                            </h4>
                            <div
                                class="flex flex-wrap gap-6 opacity-60 grayscale transition-all hover:grayscale-0"
                            >
                                <span class="text-xs font-bold text-gray-400"
                                    >MARSHALL</span
                                >
                                <span class="text-xs font-bold text-gray-400"
                                    >JBL</span
                                >
                                <span class="text-xs font-bold text-gray-400"
                                    >BOSE</span
                                >
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts">
const activeTab = ref<number | null>(null)

// 1. ดึงข้อมูลหมวดหมู่ทั้งหมด
const { data: categoriesRes } = await useAsyncData('mega-menu-categories', () =>
    useWooCategoriesApi().getCategories({ limit: 100, hide_empty: true })
)

// 2. แปลงเป็น Tree Structure
const categoryTree = computed(() => {
    const categories = categoriesRes.value?.success
        ? categoriesRes.value.data
        : []
    const map = new Map()
    const roots: any[] = []

    categories.forEach((cat: any) => map.set(cat.id, { ...cat, children: [] }))
    categories.forEach((cat: any) => {
        const node = map.get(cat.id)
        if (cat.parent === 0) roots.push(node)
        else {
            const parent = map.get(cat.parent)
            if (parent) parent.children.push(node)
        }
    })

    // ตั้งค่า Tab แรกเป็น Active เริ่มต้น
    if (roots.length > 0 && activeTab.value === null) {
        activeTab.value = roots[0].id
    }

    return roots
})

// 3. หาข้อมูลหมวดหมู่ที่กำลัง Active
const activeCategory = computed(() => {
    return categoryTree.value.find((cat) => cat.id === activeTab.value)
})
</script>
