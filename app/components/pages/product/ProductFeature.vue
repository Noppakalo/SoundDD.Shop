<template>
    <UTabs
        :items="items"
        variant="link"
        :ui="{ trigger: 'grow' }"
        class="w-full gap-4"
    >
        <template #description="{ item }">
            <div v-if="product?.description" class="relative py-4">
                <div
                    class="prose description prose-sm max-w-none overflow-hidden transition-all duration-500 ease-in-out"
                    :class="[isExpanded ? 'max-h-[5000px]' : 'max-h-[300px]']"
                    v-html="product.description"
                ></div>

                <div
                    v-if="!isExpanded"
                    class="absolute bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent pb-4"
                >
                    <UButton
                        label="ดูเพิ่มเติม"
                        icon="i-iconamoon:arrow-down-2-light"
                        color="primary"
                        variant="soft"
                        aria-label="ดูรายละเอียดสินค้าเพิ่มเติม"
                        @click="isExpanded = true"
                    />
                </div>

                <div v-else class="flex justify-center">
                    <UButton
                        label="แสดงน้อยลง"
                        icon="i-iconamoon:arrow-up-2-light"
                        aria-label="แสดงรายละเอียดสินค้าน้อยลง"
                        @click="isExpanded = false"
                    />
                </div>
            </div>
            <p v-else class="py-4 text-center text-gray-500">
                ไม่มีคำอธิบายสินค้า
            </p>
        </template>
        <template #features="{ item }">
            <div class="flex py-4">
                <table
                    v-if="product?.attributes?.length"
                    class="w-full border-b border-gray-400"
                >
                    <tbody>
                        <tr v-for="attr in product.attributes" :key="attr.id">
                            <td class="py-3 pl-4 font-bold">
                                {{ attr.name }}
                            </td>
                            <td class="py-3">
                                {{ attr.options?.join(', ') || attr.option }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-else>ไม่มีข้อมูลคุณสมบัติสินค้า</p>
            </div>
        </template>
        <template #downloads="{ item }"> </template>
    </UTabs>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'
import type { TabsItem } from '@nuxt/ui'

const props = defineProps<{
    product: Product | null
}>()

const isExpanded = ref(false)

watch(
    () => props.product?.id,
    () => {
        isExpanded.value = false
    }
)

const items: TabsItem[] = [
    {
        label: 'รายละเอียดสินค้า',
        slot: 'description',
    },
    {
        label: 'คุณสมบัติสินค้า',
        slot: 'features',
    },
    {
        label: 'ดาวน์โหลด',
        slot: 'downloads',
    },
]
</script>

<style scoped>
.description :deep(h1) {
    font-size: var(--text-6xl);
    font-weight: 700;
    line-height: 1.5;
}
.description :deep(h2) {
    font-size: var(--text-5xl);
    font-weight: 700;
    line-height: 1.625;
}
.description :deep(h3) {
    font-size: var(--text-2xl);
    font-weight: 600;
    line-height: 1.6;
}
.description :deep(h4) {
    font-size: var(--text-xl);
    font-weight: 500;
    line-height: 1.6;
}
.description :deep(h5) {
    font-size: var(--text-base);
    font-weight: 500;
    line-height: 1.75;
}
.description :deep(h6) {
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 2;
}

.description :deep(p),
.description :deep(ul),
.description :deep(ol) {
    font-size: var(--text-base);
    font-weight: 400;
    line-height: 2;
    color: var(--color-black-400);
}

.description :deep(ul),
.description :deep(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}
.description :deep(ul) {
    list-style: disc;
}
.description :deep(ol) {
    list-style: decimal;
}
.description :deep(li strong) {
    font-weight: 700;
}
.description :deep(hr) {
    margin-bottom: 1rem;
}

.description :deep(a:hover) {
    color: var(--color-primary);
}

@media screen and (max-width: 48rem) {
    .content-body :deep(h1) {
        font-size: var(--text-5xl);
        line-height: 1.625;
    }
    .content-body :deep(h2) {
        font-size: var(--text-3xl);
        line-height: 1.57;
    }
    .content-body :deep(h3) {
        font-size: var(--text-2xl);
        line-height: 1.6;
    }
    .content-body :deep(h4) {
        font-size: var(--text-xl);
        line-height: 1.8;
    }
    .content-body :deep(h5) {
        font-size: var(--text-lg);
    }
    .content-body :deep(h6) {
        font-size: var(--text-base);
    }
}
</style>
