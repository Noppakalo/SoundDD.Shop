<template>
    <UAuthForm
        :schema="schema"
        :fields="fields"
        :submit="{
            label: 'สมัครสมาชิก',
            loading: isLoading,
        }"
        @submit="onSubmit"
    />
</template>

<script setup lang="ts">
import { object, string, ref as yupRef, type InferType } from 'yup'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { RegisterResponse } from '~/types/auth'

const isLoading = ref(false)
const { fetch } = useUserSession()
const toast = useAppToast()

const emit = defineEmits(['success', 'close'])

const fields: AuthFormField[] = [
    {
        name: 'email',
        type: 'email',
        label: 'อีเมล์์',
        placeholder: 'กรอกอีเมล์ของคุณ',
        required: true,
    },
    {
        name: 'password',
        type: 'password',
        label: 'รหัสผ่าน',
        placeholder: 'ตั้งรหัสผ่าน 8 ตัวขึ้นไป',
        required: true,
    },
    {
        name: 'confirmPassword',
        type: 'password',
        label: 'ยืนยันรหัสผ่าน',
        placeholder: 'กรอกรหัสผ่านอีกครั้ง',
        required: true,
    },
]

const schema = object({
    email: string()
        .email('รูปแบบอีเมล์ไม่ถูกต้อง')
        .required('กรุณากรอกอีเมล์์'),
    password: string()
        .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว')
        .required('กรุณากรอกรหัสผ่าน'),
    confirmPassword: string()
        .oneOf([yupRef('password')], 'รหัสผ่านไม่ตรงกัน')
        .required('กรุณายืนยันรหัสผ่าน'),
})

type Schema = InferType<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    isLoading.value = true
    try {
        const response = await $fetch<RegisterResponse>('/api/auth/register', {
            method: 'POST',
            body: {
                email: event.data.email,
                password: event.data.password,
                confirmPassword: event.data.confirmPassword,
            },
        })
        await fetch()

        if (response.success) {
            toast.success('สมัครสมาชิกสำเร็จ')
            emit('success')
            emit('close')
        } else {
            toast.error('สมัครสมาชิกไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง')
        }
    } catch (error: any) {
        const message = error.data?.statusMessage || 'สมัครสมาชิกไม่สำเร็จ'
        toast.error('เกิดข้อผิดพลาด', message)
    } finally {
        isLoading.value = false
    }
}
</script>
