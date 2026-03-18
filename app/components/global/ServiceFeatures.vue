<template>
    <section class="bg-primary/10">
        <UContainer class="py-2.5">
            <div
                class="grid grid-cols-2 items-center gap-4 text-center sm:grid-cols-4"
            >
                <div
                    v-for="(f, i) in features"
                    :key="i"
                    class="flex items-center justify-center gap-2.5 max-lg:flex-col"
                >
                    <div
                        class="bg-primary flex size-12 items-center justify-center rounded-full text-white"
                    >
                        <UIcon :name="f.icon" class="text-2xl" />
                    </div>
                    <div class="flex flex-col items-start max-lg:items-center">
                        <p class="text-lg font-medium max-md:text-base">
                            {{ f.title }}
                        </p>
                        <p class="text-sm">{{ f.subtitle }}</p>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>

<script setup>
const features = [
    {
        icon: 'i-heroicons-truck',
        title: 'จัดส่งฟรี',
        subtitle: 'ตามเงื่อนไขที่กำหนด',
    },
    {
        icon: 'i-heroicons-shield-check',
        title: 'ของแท้',
        subtitle: 'ประกันศูนย์ไทย',
    },
    {
        icon: 'i-heroicons-credit-card',
        title: 'ชำระหลายช่องทางได้',
        subtitle: 'ระบบที่มีความปลอดภัย',
    },
    {
        icon: 'i-heroicons-chat-bubble-left-right',
        title: 'สอบถามข้อมูล',
        subtitle: 'บริการอย่างมืออาชีพ',
    },
]
</script>
