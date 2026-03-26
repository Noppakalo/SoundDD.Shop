<template>
    <div class="flex flex-col gap-8">
        <div
            class="flex justify-between"
            :class="
                customer?.billing?.address_1
                    ? 'flex-row items-center'
                    : 'flex-col items-start gap-8'
            "
        >
            <div>
                <h2 class="text-xl font-bold">ใบกำกับภาษี</h2>
                <p>จัดการใบกำกับภาษี สำหรับการสั่งซื้อสินค้า</p>
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
                    v-if="!customer?.billing?.address_1"
                    class="flex w-full flex-col items-center justify-center gap-4 px-4 py-16"
                >
                    <UIcon name="i-iconamoon:invoice-light" class="text-5xl" />
                    <p>ยังไม่มีข้อมูลใบกำกับภาษี</p>
                    <UButton
                        v-if="customer"
                        label="เพิ่มใบกำกับภาษี"
                        icon="i-heroicons-plus-circle"
                        aria-label="เปิดหน้าต่างเพิ่มข้อมูลใบกำกับภาษี"
                        @click="openEditModal"
                    />
                </div>
                <UButton
                    v-else-if="customer"
                    label="แก้ไขใบกำกับภาษี"
                    color="primary"
                    size="md"
                    icon="i-heroicons-pencil-square"
                    aria-label="เปิดหน้าต่างแก้ไขใบกำกับภาษี"
                    @click="openEditModal"
                />
                <template #header>
                    <p class="text-xl font-semibold">
                        {{
                            customer?.billing
                                ? 'แก้ไขใบกำกับภาษี'
                                : 'เพิ่มใบกำกับภาษี'
                        }}
                    </p>
                </template>
                <template #body>
                    <UForm
                        :schema="schema"
                        :state="editForm"
                        id="edit-tax-form"
                        @submit="UpdateAddress"
                        class="grid grid-cols-2 gap-4"
                    >
                        <AddressFormFields
                            :state="editForm.billing"
                            prefix="billing"
                            isBilling
                        />
                    </UForm>
                </template>
                <template #footer="{ close }">
                    <UButton
                        type="button"
                        label="ยกเลิก"
                        color="neutral"
                        variant="ghost"
                        aria-label="ยกเลิก"
                        @click="close"
                    />
                    <UButton
                        type="submit"
                        form="edit-tax-form"
                        label="บันทึกใบกำกับภาษี"
                        :loading="isUpdating"
                        aria-label="บันทึกใบกำกับภาษี"
                        @click="
                            () => {
                                submitCloseFn = close as any
                            }
                        "
                    />
                </template>
            </UModal>
        </div>
        <div
            v-if="props.loading"
            class="grid grid-cols-2 gap-6"
            aria-hidden="true"
        >
            <div class="col-span-2 space-y-2">
                <USkeleton class="h-4 w-24" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-32" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-40" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="col-span-2 space-y-2">
                <USkeleton class="h-4 w-20" /><USkeleton class="h-10 w-full" />
            </div>
            <div class="col-span-2 space-y-2">
                <USkeleton class="h-4 w-28" /><USkeleton class="h-24 w-full" />
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
        <div
            v-else-if="customer?.billing?.address_1"
            class="grid grid-cols-2 gap-4"
        >
            <AddressDisplay
                :address="customer.billing"
                :customer="customer"
                isBilling
            />
        </div>
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

const schema = taxSchema
type Schema = InferType<typeof taxSchema>
const editForm = ref<Schema>({
    billing: {
        customer_type: 'natural',
        first_name: '',
        last_name: '',
        company: '',
        tax_id: '',
        phone: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
    },
})

const openEditModal = () => {
    const b = props.customer?.billing
    const meta = props.customer?.meta_data
    const storedType = meta?.find((m: any) => m.key === 'customer_type')?.value
    const storedTaxId = meta?.find((m: any) => m.key === 'tax_id')?.value || ''
    editForm.value.billing = {
        customer_type: storedType || (b?.company ? 'juristic' : 'natural'),
        first_name: b?.first_name || '',
        last_name: b?.last_name || '',
        company: b?.company || '',
        tax_id: storedTaxId,
        phone: b?.phone || '',
        address_1: b?.address_1 || '',
        address_2: b?.address_2 || '',
        city: b?.city || '',
        state: b?.state || '',
        postcode: b?.postcode || '',
    }
    open.value = true
}

const UpdateAddress = async () => {
    if (!props.customer?.id) return

    isUpdating.value = true

    const payload = {
        billing: {
            first_name: editForm.value.billing.first_name,
            last_name: editForm.value.billing.last_name,
            company: editForm.value.billing.company,
            phone: editForm.value.billing.phone,
            address_1: editForm.value.billing.address_1,
            address_2: editForm.value.billing.address_2,
            city: editForm.value.billing.city,
            state: editForm.value.billing.state,
            postcode: editForm.value.billing.postcode,
            country: 'TH',
        },
        customer_type: editForm.value.billing.customer_type,
        tax_id: editForm.value.billing.tax_id,
    }

    try {
        const result = await updateCustomer(props.customer.id, payload)
        if (result.success) {
            appToast.success('สำเร็จ', 'อัปเดตใบกำกับภาษีเรียบร้อยแล้ว')

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
                'อัปเดทใบกำกับภาษีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
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
