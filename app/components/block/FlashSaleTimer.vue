<template>
    <div
        v-if="isFlashSale"
        class="bg-primary flex items-center justify-center gap-2 rounded-sm px-2 py-1.5 text-white"
    >
        <p class="text-xs font-medium">เหลือเวลาอีก</p>
        <div class="flex items-center gap-0.5 text-xs font-bold">
            <span v-if="timeLeft.days > 0" class="rounded bg-white/20 px-1">
                {{ pad(timeLeft.days) }} วัน
            </span>
            <span class="rounded bg-white/20 px-1">{{
                pad(timeLeft.hours)
            }}</span>
            <span>:</span>
            <span class="rounded bg-white/20 px-1">{{
                pad(timeLeft.minutes)
            }}</span>
            <span>:</span>
            <span class="rounded bg-white/20 px-1">{{
                pad(timeLeft.seconds)
            }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    dateFrom?: string | number | Date | null
    dateTo?: string | number | Date | null
}>()

const { timeLeft, isFlashSale } = useCountdown(
    computed(() => props.dateFrom),
    computed(() => props.dateTo)
)

const pad = (num: number) => String(num).padStart(2, '0')
</script>
