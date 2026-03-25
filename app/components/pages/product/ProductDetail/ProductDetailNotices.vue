<template>
    <USeparator class="my-2" />
    <div class="flex flex-col gap-3 text-xs sm:text-sm">
        <div
            v-for="(notice, index) in productNotices"
            :key="index"
            class="flex items-start gap-2"
            :class="notice.class || ''"
        >
            <UIcon
                :name="notice.icon"
                :class="['mt-0.5 shrink-0', notice.iconClass || '']"
            />
            <p>{{ notice.text }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const productNotices = [
    {
        icon: 'i-iconamoon:star-fill',
        text: 'เช็ค Stock และราคาสินค้า กับเจ้าหน้าที่ก่อนสั่งซื้อทุกครั้ง',
        class: 'text-error font-medium',
    },
    {
        icon: 'i-iconamoon:badge-light',
        text: 'สงวนสิทธิ์การเปลี่ยนแปลงข้อมูล ราคา ไม่แจ้งให้ทราบล่วงหน้า',
        iconClass: 'text-success',
    },
    {
        icon: 'i-heroicons-truck',
        text: 'รับสินค้าภายใน 3 - 7 วัน (ขึ้นอยู่กับที่อยู่จัดส่งของลูกค้า)',
        iconClass: 'text-success',
    },
    {
        icon: 'i-iconamoon:file-document-light',
        text: 'สงวนสิทธิ์การรับผิดชอบเนื่องจากการพิมพ์ผิดพลาดต่างๆ',
        iconClass: 'text-success',
    },
]
</script>
