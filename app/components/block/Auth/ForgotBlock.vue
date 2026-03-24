<template>
    <div class="flex h-80 w-full flex-col justify-center gap-4 p-8">
        <div class="relative flex items-center">
            <UButton
                icon="i-iconamoon:arrow-left-2"
                color="neutral"
                variant="ghost"
                size="xl"
                class="absolute left-0"
                aria-label="ย้อนกลับไปหน้าเข้าสู่ระบบ"
                @click="emit('back')"
            />

            <h2 class="w-full text-center text-xl font-bold">ลืมรหัสผ่าน</h2>
        </div>
        <UForm
            :schema="schema"
            :state="state"
            @submit="onSubmit"
            class="flex flex-col justify-center gap-4"
        >
            <UFormField label="ระบุอีเมล์เพื่อรีเซ็ตรหัสผ่าน" name="email">
                <UInput
                    v-model="state.email"
                    placeholder="กรอกอีเมล์ของคุณ"
                    class="w-full"
                />
            </UFormField>
            <UButton
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                aria-label="ส่งคำขอรีเซ็ตรหัสผ่าน"
            >
                ดำเนินการต่อ
            </UButton>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<{
    back: []
    success: []
}>()

const isLoading = ref(false)

const schema = object({
    email: string()
        .email('รูปแบบอีเมล์ไม่ถูกต้อง')
        .required('กรุณากรอกอีเมล์์'),
})

type Schema = InferType<typeof schema>

const state = reactive({
    email: '',
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    isLoading.value = true
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        emit('success')
    } catch (error) {
    } finally {
        isLoading.value = false
    }
}
</script>
