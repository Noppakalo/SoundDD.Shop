<template>
    <div class="flex flex-col gap-8">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-xl font-bold">ข้อมูลส่วนตัว</h2>
                <p>ข้อมูลส่วนบุคคลและตัวเลือกในการจัดการ</p>
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
                <UButton
                    v-if="user"
                    label="แก้ไขข้อมูลส่วนตัว"
                    color="primary"
                    size="md"
                    icon="i-iconamoon:edit-light"
                    variant="solid"
                    aria-label="เปิดหน้าต่างแก้ไขข้อมูลส่วนตัว"
                    @click="openEditModal"
                />
                <template #header>
                    <p class="text-xl font-semibold">แก้ไขข้อมูลส่วนตัว</p>
                </template>
                <template #body>
                    <UForm
                        :schema="schema"
                        :state="editForm"
                        id="edit-customer-form"
                        class="grid grid-cols-2 gap-4"
                        @submit="UpdateCustomer"
                    >
                        <AddressFormFields
                            v-model:birth-date="birthDateValue"
                            :state="editForm"
                            only-contact
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
                        form="edit-customer-form"
                        label="บันทึกข้อมูลส่วนตัว"
                        :loading="isUpdating"
                        aria-label="บันทึกข้อมูลส่วนตัว"
                        @click="
                            () => {
                                submitCloseFn = close as any
                            }
                        "
                    />
                </template>
            </UModal>
        </div>
        <div class="col-span-2 flex justify-center">
            <USkeleton v-if="loading" class="size-30 rounded-full shadow-sm" />
            <UAvatar
                v-else-if="user?.avatar || customer?.avatar_url"
                :src="user?.avatar || customer?.avatar_url"
                :alt="user?.name"
                loading="lazy"
                draggable="false"
                size="xl"
                class="size-30"
                aria-label="รูปโปรไฟล์ของคุณ"
            />
            <div
                v-else
                class="flex size-30 items-center justify-center rounded-full bg-gray-100 text-gray-400"
            >
                <UIcon
                    name="i-iconamoon:profile"
                    class="size-16"
                    aria-hidden="true"
                />
            </div>
        </div>
        <div v-if="loading" class="grid grid-cols-2 gap-6" aria-hidden="true">
            <div class="space-y-2">
                <USkeleton class="h-4 w-20" /> <USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-16" /> <USkeleton class="h-10 w-full" />
            </div>

            <div class="space-y-2">
                <USkeleton class="h-4 w-24" /> <USkeleton class="h-10 w-full" />
            </div>
            <div class="space-y-2">
                <USkeleton class="h-4 w-32" /> <USkeleton class="h-10 w-full" />
            </div>
        </div>
        <div v-else class="grid grid-cols-2 gap-4">
            <AddressDisplay
                :address="{
                    first_name:
                        customer?.first_name ||
                        (user?.name?.includes(' ')
                            ? user?.name?.split(' ')[0]
                            : user?.name) ||
                        '',
                    last_name:
                        customer?.last_name ||
                        (user?.name?.includes(' ')
                            ? user?.name?.split(' ').slice(1).join(' ')
                            : '') ||
                        '',
                    phone: customer?.billing?.phone || '',
                }"
                :email="user?.email || ''"
                :birth-date="displayBirthDate"
                only-contact
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { type InferType } from 'yup'
import type { Customer } from '~/types/customer'
import { accountSchema } from '~/utils/schema'

const props = defineProps<{
    customer: Customer | null
    loading: boolean
    user: any
}>()

const emit = defineEmits(['update'])
const appToast = useAppToast()
const { updateCustomer } = useWooCustomerApi()

const open = ref(false)
const isUpdating = ref(false)
const birthDateValue = ref<string>('')
let submitCloseFn: (() => void) | undefined = undefined

const schema = accountSchema
type Schema = InferType<typeof accountSchema>
const editForm = ref<Schema>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
})

const displayBirthDate = computed(() => {
    const dateStr = props.customer?.meta_data?.find(
        (m: any) => m.key === 'birth_date'
    )?.value
    return formatDisplayBirthDate(dateStr)
})

const openEditModal = () => {
    // แยกชื่อด้วยช่องว่าง
    const userName = props.user?.name || ''
    const nameParts = userName.trim().split(/\s+/) // ใช้ regex เพื่อจัดการช่องว่างหลายชั้น

    const metaDate = props.customer?.meta_data?.find(
        (m: any) => m.key === 'birth_date'
    )
    birthDateValue.value =
        typeof metaDate?.value === 'string' ? metaDate.value : ''

    editForm.value = {
        // ใช้ nameParts[0] เป็นชื่อจริง
        first_name: props.customer?.first_name || nameParts[0] || '',

        // ใช้ส่วนที่เหลือทั้งหมดเป็นนามสกุล
        last_name:
            props.customer?.last_name || nameParts.slice(1).join(' ') || '',

        email: props.user?.email || '',
        phone: props.customer?.billing?.phone || '',
    }
    open.value = true
}

const UpdateCustomer = async () => {
    if (!props.customer?.id) return
    isUpdating.value = true

    const payload: Record<string, unknown> = {
        first_name: editForm.value.first_name,
        last_name: editForm.value.last_name,
        email: editForm.value.email,
        phone: editForm.value.phone,
        birth_date: birthDateValue.value,
    }

    try {
        const result = await updateCustomer(props.customer.id, payload)
        if (result.success) {
            appToast.success('สำเร็จ', 'อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว')
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
