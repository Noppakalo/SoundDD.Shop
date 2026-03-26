<template>
    <div class="flex justify-between max-sm:flex-col max-sm:gap-4">
        <USlideover
            title="ตัวกรองทั้งหมด"
            :ui="{
                content: 'w-96 max-w-full',
            }"
        >
            <UButton
                icon="i-iconamoon:options-light"
                label="ตัวกรองทั้งหมด"
                color="neutral"
                variant="subtle"
                aria-label="เปิดเมนูตัวกรองสินค้า"
                size="md"
            />
            <template #body>
                <div class="flex flex-col gap-6">
                    <div v-if="priceRange" class="space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="font-semibold">ช่วงราคา</p>
                            <span class="text-sm text-gray-500">
                                {{ formatPrice(priceValue[0] || 0) }} -
                                {{ formatPrice(priceValue[1] || 0) }}
                            </span>
                        </div>
                        <USlider
                            v-model="priceValue"
                            :min="priceRange.min"
                            :max="priceRange.max"
                            :step="100"
                            class="w-full"
                        />
                        <div class="flex justify-between text-xs text-gray-400">
                            <p>{{ formatPrice(priceRange.min) }}</p>
                            <p>{{ formatPrice(priceRange.max) }}</p>
                        </div>
                    </div>
                    <USeparator />
                    <div v-if="availableBrands.length > 0" class="space-y-3">
                        <p class="font-semibold">แบรนด์</p>
                        <div class="flex flex-col gap-2">
                            <UCheckbox
                                v-for="brand in availableBrands"
                                :key="brand.id"
                                :model-value="selectedBrands.includes(brand.id)"
                                :value="brand.id"
                                :label="brand.name"
                                @update:model-value="
                                    (checked) => {
                                        if (checked) {
                                            selectedBrands = [
                                                ...selectedBrands,
                                                brand.id,
                                            ]
                                        } else {
                                            selectedBrands =
                                                selectedBrands.filter(
                                                    (id) => id !== brand.id
                                                )
                                        }
                                    }
                                "
                            />
                        </div>
                    </div>
                    <USeparator v-if="availableBrands.length > 0" />
                    <div
                        v-if="availableCategories.length > 0"
                        class="space-y-3"
                    >
                        <p class="font-semibold">หมวดหมู่</p>
                        <div class="flex flex-col gap-2">
                            <UCheckbox
                                v-for="cat in availableCategories"
                                :key="cat.id"
                                :model-value="
                                    selectedCategories.includes(cat.id)
                                "
                                :value="cat.id"
                                :label="cat.name"
                                @update:model-value="
                                    (checked) => {
                                        if (checked) {
                                            selectedCategories = [
                                                ...selectedCategories,
                                                cat.id,
                                            ]
                                        } else {
                                            selectedCategories =
                                                selectedCategories.filter(
                                                    (id) => id !== cat.id
                                                )
                                        }
                                    }
                                "
                            />
                        </div>
                    </div>
                    <USeparator v-if="availableCategories.length > 0" />
                    <div
                        v-for="attr in otherAttributes"
                        :key="attr.id"
                        class="space-y-3"
                    >
                        <p class="font-semibold">{{ attr.name }}</p>
                        <div class="flex flex-col gap-2">
                            <UCheckbox
                                v-for="option in attr.options"
                                :key="option"
                                :model-value="
                                    (
                                        selectedAttributes[attr.name] || []
                                    ).includes(option)
                                "
                                :value="option"
                                :label="decodeURIComponent(option)"
                                @update:model-value="
                                    (checked) => {
                                        const current =
                                            selectedAttributes[attr.name] || []
                                        if (checked) {
                                            selectedAttributes = {
                                                ...selectedAttributes,
                                                [attr.name]: [
                                                    ...current,
                                                    option,
                                                ],
                                            }
                                        } else {
                                            selectedAttributes = {
                                                ...selectedAttributes,
                                                [attr.name]: current.filter(
                                                    (o) => o !== option
                                                ),
                                            }
                                        }
                                    }
                                "
                            />
                        </div>
                        <USeparator />
                    </div>
                    <UButton
                        v-if="hasActiveFilters"
                        label="ล้างตัวกรองทั้งหมด"
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        icon="i-heroicons-x-mark"
                        @click="clearAllFilters"
                    />
                </div>
            </template>
        </USlideover>
        <div class="flex items-center justify-center gap-8">
            <div class="flex gap-2">
                <UButton
                    icon="i-tabler:layout-grid"
                    :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'grid' ? 'solid' : 'subtle'"
                    aria-label="แสดงผลแบบตาราง"
                    @click="viewMode = 'grid'"
                />
                <UButton
                    icon="i-tabler:baseline-density-medium"
                    :color="viewMode === 'list' ? 'primary' : 'neutral'"
                    :variant="viewMode === 'list' ? 'solid' : 'subtle'"
                    aria-label="แสดงผลแบบรายการ"
                    @click="viewMode = 'list'"
                />
            </div>
            <USelect
                v-model="activeSort"
                :items="sortItems"
                icon="i-iconamoon:sorting-left-light"
                color="neutral"
                variant="subtle"
                aria-label="เลือกการเรียงลำดับ"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types/category'
import type { Brands } from '~/types/brand'

interface AttributeFilter {
    id: number
    name: string
    slug: string
    options: string[]
}

const props = defineProps<{
    category?: Category | null
    brands?: Brands[]
    categories?: Category[]
}>()

const viewMode = defineModel<'grid' | 'list'>('viewMode', { default: 'grid' })
const sortOptions = defineModel<{ orderby: string; order: string }>(
    'sortOptions',
    {
        default: () => ({ orderby: 'date', order: 'desc' }),
    }
)

const filters = defineModel<{
    minPrice: number
    maxPrice: number
    brands: number[]
    categories: number[]
    attributes: Record<string, string[]>
}>('filters', {
    default: () => ({
        minPrice: 0,
        maxPrice: 1000000,
        brands: [],
        categories: [],
        attributes: {},
    }),
})

const priceRange = computed(() => props.category?.price_range)
const priceValue = computed({
    get: () => [filters.value.minPrice || 0, filters.value.maxPrice || 0],
    set: (val: number[]) => {
        filters.value.minPrice = val[0] || 0
        filters.value.maxPrice = val[1] || 0
    },
})

watch(
    () => priceRange.value,
    (range) => {
        if (range) {
            filters.value.minPrice = range.min
            filters.value.maxPrice = range.max
        }
    },
    { immediate: true }
)

const availableBrands = computed(() => props.brands || [])

const selectedBrands = computed({
    get: () => filters.value.brands,
    set: (val: number[]) => {
        filters.value.brands = val
    },
})

const availableCategories = computed(() => props.categories || [])

const selectedCategories = computed({
    get: () => filters.value.categories,
    set: (val: number[]) => {
        filters.value.categories = val
    },
})

const otherAttributes = ref<AttributeFilter[]>([])

const selectedAttributes = computed({
    get: () => filters.value.attributes,
    set: (val: Record<string, string[]>) => {
        filters.value.attributes = val
    },
})

const hasActiveFilters = computed(() => {
    const f = filters.value
    const range = priceRange.value
    if (range && (f.minPrice !== range.min || f.maxPrice !== range.max))
        return true
    if (f.brands.length > 0) return true
    if (f.categories.length > 0) return true
    if (Object.values(f.attributes).some((arr) => arr.length > 0)) return true
    return false
})

const clearAllFilters = () => {
    const range = priceRange.value
    filters.value = {
        minPrice: range?.min || 0,
        maxPrice: range?.max || 1000000,
        brands: [],
        categories: [],
        attributes: {},
    }
}

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
