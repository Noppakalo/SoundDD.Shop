<template>
    <div class="flex h-80 w-full flex-col justify-center gap-4 p-8">
        <div class="relative flex items-center">
            <UButton
                icon="i-iconamoon:arrow-left-2"
                color="neutral"
                variant="ghost"
                size="xl"
                class="absolute left-0"
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
            <UFormField label="ระบุอีเมลเพื่อรีเซ็ตรหัสผ่าน" name="email">
                <UInput
                    v-model="state.email"
                    placeholder="กรอกอีเมลของคุณ"
                    class="w-full"
                />
            </UFormField>
            <UButton type="submit" color="primary" block :loading="isLoading">
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
    email: string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมลล์'),
})

type Schema = InferType<typeof schema>

const state = reactive({
    email: '',
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    isLoading.value = true
    try {
        // TODO: implement API call to send forgot password email
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // simulate success
        emit('success')
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>
