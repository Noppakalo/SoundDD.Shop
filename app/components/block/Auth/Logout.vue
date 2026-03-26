<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
                @click.self="closeModal"
            >
                <div class="w-96 rounded-lg bg-white p-6 shadow-lg">
                    <h2
                        class="mb-4 text-center text-xl font-semibold text-gray-900"
                    >
                        ออกจากระบบ
                    </h2>
                    <p class="mb-6 text-center text-gray-600">
                        คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
                    </p>
                    <div class="flex justify-center gap-4">
                        <UButton
                            label="ยกเลิก"
                            color="neutral"
                            variant="ghost"
                            aria-label="ยกเลิกและกลับสู่หน้าเดิม"
                            @click="$emit('update:modelValue', false)"
                        />
                        <UButton
                            label="ยืนยันออกจากระบบ"
                            color="primary"
                            variant="solid"
                            aria-label="ยืนยันการออกจากระบบ"
                            @click="handleLogout"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const { clear } = useUserSession()
const toast = useAppToast()
const isLoading = ref(false)

const closeModal = () => {
    if (isLoading.value) return
    emit('update:modelValue', false)
}

const handleLogout = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
        await clear()
        await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
        emit('update:modelValue', false)

        toast.success('ออกจากระบบสำเร็จ', 'ขอบคุณที่ใช้บริการ SoundDD Shop')
    } catch (error) {
        toast.error('ออกจากระบบไม่สำเร็จ', 'ไม่สามารถดำเนินการได้ในขณะนี้')
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
