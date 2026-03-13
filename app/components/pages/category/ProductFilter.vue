<template>
    <div class="flex justify-between">
        <USlideover title="ตัวกรองทั้งหมด">
            <UButton
                icon="i-iconamoon:options-light"
                label="ตัวกรองทั้งหมด"
                color="neutral"
                variant="subtle"
                size="md"
            />
            <template #body>
                <div>
                    <USlider v-model="filterValue" />
                </div>
            </template>
        </USlideover>
        <div class="flex items-center gap-8">
            <div class="flex gap-2">
                <UButton
                    icon="i-tabler:layout-grid"
                    :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'grid' ? 'solid' : 'subtle'"
                    @click="viewMode = 'grid'"
                />
                <UButton
                    icon="i-tabler:baseline-density-medium"
                    :color="viewMode === 'list' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'list' ? 'solid' : 'subtle'"
                    @click="viewMode = 'list'"
                />
            </div>
            <USelect
                v-model="activeSort"
                :items="sortItems"
                icon="i-iconamoon:sorting-left-light"
                color="neutral"
                variant="subtle"
                class="w-48"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const viewMode = defineModel<'grid' | 'list'>('viewMode', { default: 'grid' })
const sortOptions = defineModel<{ orderby: string; order: string }>(
    'sortOptions',
    {
        default: () => ({ orderby: 'date', order: 'desc' }),
    }
)

const filterValue = ref(50)

const sortItems = [
    { label: 'ใหม่ที่สุด', value: 'date-desc' },
    { label: 'เก่าที่สุด', value: 'date-asc' },
    { label: 'ราคา: ต่ำ - สูง', value: 'price-asc' },
    { label: 'ราคา: สูง - ต่ำ', value: 'price-desc' },
]

const activeSort = computed({
    get: () => `${sortOptions.value.orderby}-${sortOptions.value.order}`,
    set: (val) => {
        if (val) {
            const [orderby, order] = val.split('-')
            if (orderby && order) {
                sortOptions.value = { orderby, order }
            }
        }
    },
})
</script>
