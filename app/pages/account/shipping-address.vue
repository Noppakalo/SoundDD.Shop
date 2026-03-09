<template>
    <div class="flex flex-col gap-8">
        <div
            class="flex justify-between"
            :class="
                customer?.shipping?.address_1
                    ? 'flex-row items-center'
                    : 'flex-col items-start gap-8'
            "
        >
            <div>
                <h2 class="text-xl font-bold">ที่อยู่จัดส่งสินค้า</h2>
                <p>จัดการที่อยู่จัดส่ง สำหรับการสั่งซื้อสินค้า</p>
            </div>
            <UModal
                v-model="open"
                :ui="{
                    header: 'justify-center',
                    content: 'ring-0 divide-y-0 p-4',
                    footer: 'justify-center',
                    overlay: 'bg-black/50 backdrop-blur-xs',
                }"
            >
                <div
                    v-if="!customer?.shipping?.address_1"
                    class="flex w-full flex-col items-center justify-center gap-4 px-4 py-16"
                >
                    <UIcon name="i-heroicons-map-pin" class="text-5xl" />
                    <p>ยังไม่มีข้อมูลที่อยู่จัดส่งสินค้า</p>
                    <UButton
                        label="เพิ่มที่อยู่จัดส่ง"
                        icon="i-heroicons-plus-circle"
                        @click="openEditModal"
                    />
                </div>
                <UButton
                    v-else
                    label="แก้ไขที่อยู่จัดส่ง"
                    color="primary"
                    size="md"
                    icon="i-heroicons-pencil-square"
                    @click="openEditModal"
                />
                <template #header>
                    <p class="text-xl font-semibold">
                        {{
                            customer?.shipping
                                ? 'แก้ไขที่อยู่จัดส่ง'
                                : 'เพิ่มที่อยู่จัดส่ง'
                        }}
                    </p>
                </template>
                <template #body>
                    <UForm
                        :schema="schema"
                        :state="editForm"
                        id="edit-shipping-form"
                        @submit="UpdateAddress"
                        class="grid grid-cols-2 gap-4"
                    >
                        <AddressFormFields
                            :state="editForm.shipping"
                            prefix="shipping"
                        />
                    </UForm>
                </template>
                <template #footer="{ close }">
                    <UButton
                        type="button"
                        label="ยกเลิก"
                        color="neutral"
                        variant="ghost"
                        @click="close"
                    />
                    <UButton
                        type="submit"
                        form="edit-shipping-form"
                        label="บันทึกที่อยู่จัดส่ง"
                        :loading="isUpdating"
                        @click="() => { submitCloseFn = close as any; }"
                    />
                </template>
            </UModal>
        </div>
        <div v-if="loading" class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
                <USkeleton class="h-4 w-12" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-16" /><USkeleton class="h-10 w-full" />
            </div>

            <div class="col-span-2 space-y-2">
                <USkeleton class="h-4 w-20" /><USkeleton class="h-10 w-full" />
            </div>

            <div class="col-span-2 space-y-2">
                <USkeleton class="h-4 w-24" /><USkeleton class="h-24 w-full" />
            </div>

            <div class="space-y-2">
                <USkeleton class="h-4 w-20" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-20" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-16" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-24" /><USkeleton class="h-10 w-full" />
            </div>
        </div>
        <UForm
            v-else-if="customer?.shipping?.address_1"
            class="grid grid-cols-2 gap-4"
        >
            <AddressDisplay :address="customer.shipping" />
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { type InferType } from 'yup'
import type { Customer } from '~/types/customer'

const props = defineProps<{
    customer: Customer | null
    loading: boolean
}>()

const emit = defineEmits(['update'])
const appToast = useAppToast()
const { updateCustomer } = useWooCustomerApi()

const open = ref(false)
const isUpdating = ref(false)
let submitCloseFn: (() => void) | undefined = undefined

const schema = shippingSchema
type Schema = InferType<typeof shippingSchema>
const editForm = ref<Schema>({
    shipping: {
        first_name: '',
        last_name: '',
        phone: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
    },
})

const openEditModal = () => {
    const s = props.customer?.shipping
    editForm.value = {
        shipping: {
            first_name: s?.first_name || '',
            last_name: s?.last_name || '',
            phone: s?.phone || '',
            address_1: s?.address_1 || '',
            address_2: s?.address_2 || '',
            city: s?.city || '',
            state: s?.state || '',
            postcode: s?.postcode || '',
        },
    }
    open.value = true
}

const UpdateAddress = async () => {
    if (!props.customer?.id) return
    isUpdating.value = true
    try {
        const result = await updateCustomer(props.customer.id, {
            shipping: { ...editForm.value.shipping, country: 'TH' },
        })
        if (result.success) {
            appToast.success('สำเร็จ', 'อัปเดตที่อยู่จัดส่งเรียบร้อยแล้ว')
            if (submitCloseFn) {
                submitCloseFn()
                submitCloseFn = undefined
            } else {
                open.value = false
            }
            emit('update', result.data as Customer)
        } else {
            appToast.error(
                'เกิดข้อผิดพลาด',
                'อัปเดทข้อมูลส่วนตัวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
            )
        }
    } catch (error) {
        appToast.error(
            'ระบบขัดข้อง',
            'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้'
        )
    } finally {
        isUpdating.value = false
    }
}
</script>
