<template>
    <section class="py-8" role="region" aria-labelledby="shipping-title">
        <UContainer class="flex flex-col gap-4">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="space-y-4 lg:col-span-2">
                    <div class="flex items-center justify-between">
                        <p class="text-3xl font-bold">ที่อยู่จัดส่งสินค้า</p>
                        <UButton
                            to="/account/shipping-address"
                            color="primary"
                            variant="ghost"
                            icon="i-heroicons-map-pin"
                            aria-label="จัดการที่อยู่จัดส่งสินค้า"
                        >
                            จัดการที่อยู่
                        </UButton>
                    </div>
                    <div class="flex flex-col gap-8 rounded-lg p-8 shadow-sm">
                        <UForm
                            v-if="customer?.shipping?.address_1"
                            class="grid grid-cols-2 gap-4"
                        >
                            <AddressDisplay :address="customer.shipping" />
                        </UForm>
                        <div
                            v-if="loading"
                            class="flex justify-center py-10"
                            aria-busy="true"
                        >
                            <UIcon
                                name="i-heroicons-arrow-path"
                                class="text-primary animate-spin text-2xl"
                            />
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
                                <UIcon
                                    name="i-heroicons-map-pin"
                                    class="text-5xl"
                                />
                                <p>ยังไม่มีข้อมูลที่อยู่จัดส่งสินค้า</p>
                                <UButton
                                    label="เพิ่มที่อยู่จัดส่ง"
                                    icon="i-heroicons-plus-circle"
                                    aria-label="เพิ่มที่อยู่จัดส่งสินค้า"
                                    @click="openEditModal"
                                />
                            </div>
                            <UButton
                                v-else
                                label="แก้ไขที่อยู่จัดส่ง"
                                color="primary"
                                size="md"
                                icon="i-heroicons-pencil-square"
                                aria-label="แก้ไขที่อยู่จัดส่งสินค้า"
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
                                    @submit="UpdateAddress(undefined)"
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
                                    aria-label="ยกเลิก"
                                    @click="close"
                                />
                                <UButton
                                    label="บันทึกที่อยู่จัดส่ง"
                                    aria-label="บันทึกที่อยู่จัดส่งสินค้า"
                                    :loading="isUpdating"
                                    @click="UpdateAddress(close)"
                                />
                            </template>
                        </UModal>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { Customer } from '~/types/customer'

const props = defineProps<{
    customer: Customer | null
    loading: boolean
}>()

const emit = defineEmits(['update'])
const toast = useToast()
const { user } = useUserSession()
const { getCustomer, updateCustomer } = useWooCustomerApi()

const customer = ref<Customer | null>(null)
const loading = ref(false)
const open = ref(false)
const isUpdating = ref(false)

const loadCustomer = async () => {
    if (!user.value?.email) return
    loading.value = true
    const result = await getCustomer(user.value.email)
    if (result.success && result.data) {
        customer.value = result.data
    }
    loading.value = false
}

await loadCustomer()

const schema = object({
    shipping: object({
        first_name: string().required('กรุณากรอกชื่อ'),
        last_name: string().required('กรุณากรอกนามสกุล'),
        phone: string()
            .matches(/^0[0-9]{9}$/, 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก')
            .required('กรุณากรอกเบอร์โทร'),
        address_1: string().required('กรุณากรอกที่อยู่'),
        address_2: string().required('กรุณากรอกตำบล'),
        city: string().required('กรุณากรอกอำเภอ'),
        state: string().required('กรุณากรอกจังหวัด'),
        postcode: string()
            .matches(/^[0-9]{5}$/, 'กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก')
            .required('กรุณากรอกรหัสไปรษณีย์'),
    }),
})

type Schema = InferType<typeof schema>

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
    const s = customer.value?.shipping
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

const UpdateAddress = async (closeFn?: () => void) => {
    const currentCustomer = customer.value || props.customer
    if (!currentCustomer?.id) return

    if (
        !editForm.value.shipping.address_1 ||
        !editForm.value.shipping.postcode
    ) {
        toast.add({
            title: 'ข้อมูลไม่ครบถ้วน',
            description: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            color: 'error',
        })
        return
    }

    isUpdating.value = true

    try {
        const result = await updateCustomer(currentCustomer.id, {
            shipping: { ...editForm.value.shipping, country: 'TH' },
        })
        if (result.success) {
            toast.add({
                title: 'สำเร็จ',
                description: 'อัปเดตที่อยู่จัดส่งเรียบร้อยแล้ว',
                color: 'success',
            })
            await loadCustomer()
            if (closeFn) closeFn()
            else open.value = false
            emit('update')
        } else {
            toast.add({
                title: 'เกิดข้อผิดพลาด',
                description: 'กรุณาลองใหม่อีกครั้ง',
                color: 'error',
            })
        }
    } catch (error) {
        toast.add({
            title: 'ระบบขัดข้อง',
            description: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้',
            color: 'error',
        })
    } finally {
        isUpdating.value = false
    }
}
</script>
