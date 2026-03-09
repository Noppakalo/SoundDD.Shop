<template>
    <div class="flex flex-col gap-8">
        <h2 class="text-xl font-bold">รายการคำสั่งซื้อ</h2>
        <div
            v-if="!customer?.billing?.address_1"
            class="flex w-full flex-col items-center justify-center gap-4 px-4 py-16"
        >
            <UIcon name="i-iconamoon:invoice-light" class="text-5xl" />
            <p>ยังไม่มีรายการคำสั่งซื้อ</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/customer'

const props = defineProps<{
    customerId?: number
}>()

const { getOrders } = useWooCustomerApi()
const orders = ref<Order[]>([])
const ordersLoading = ref(false)

watch(
    () => props.customerId,
    async (newId) => {
        if (!newId) return
        ordersLoading.value = true
        const result = await getOrders(newId)
        if (result.success && result.data) {
            orders.value = result.data
        }
        ordersLoading.value = false
    },
    { immediate: true }
)

const orderStatusLabel = (status: string) => {
    const map: Record<string, string> = {
        pending: 'รอชำระเงิน',
        processing: 'กำลังดำเนินการ',
        on_hold: 'รอยืนยัน',
        completed: 'สำเร็จแล้ว',
        cancelled: 'ยกเลิกแล้ว',
        refunded: 'คืนเงินแล้ว',
        failed: 'ล้มเหลว',
    }
    return map[status] ?? status
}

const orderStatusColor = (status: string) => {
    const map: Record<
        string,
        'success' | 'error' | 'neutral' | 'primary' | 'secondary'
    > = {
        pending: 'secondary',
        processing: 'primary',
        on_hold: 'secondary',
        completed: 'success',
        cancelled: 'neutral',
        refunded: 'neutral',
        failed: 'error',
    }
    return map[status] ?? 'neutral'
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}
</script>
