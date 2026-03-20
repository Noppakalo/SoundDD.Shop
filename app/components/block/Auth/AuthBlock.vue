<template>
    <div v-if="!showForgotPassword" class="flex justify-center border-0 pt-8">
        <NuxtImg
            src="/logos/SoundDD-logo.webp"
            alt="SoundDD Shop"
            loading="lazy"
            draggable="false"
            class="h-14 w-auto"
        />
    </div>
    <UTabs
        v-if="!showForgotPassword"
        v-model="activeTab"
        :items="items"
        variant="link"
        :ui="{ trigger: 'grow text-base font-bold' }"
        class="w-full gap-4 p-8"
    >
        <template #login>
            <Login
                @close="handleLoginSuccess"
                @forgot-password="showForgotPassword = true"
            />
        </template>
        <template #register>
            <Register
                @success="handleLoginSuccess"
                @close="handleLoginSuccess"
            />
        </template>
    </UTabs>
    <ForgotBlock
        v-else
        @back="showForgotPassword = false"
        @success="showForgotPassword = false"
    />
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const emit = defineEmits<{
    close: []
}>()

const activeTab = ref('login')
const showForgotPassword = ref(false)

const items = [
    {
        label: 'เข้าสู่ระบบ',
        slot: 'login',
        value: 'login',
    },
    {
        label: 'สมัครสมาชิก',
        slot: 'register',
        value: 'register',
    },
] satisfies TabsItem[]

const handleLoginSuccess = () => {
    emit('close')
}
</script>
