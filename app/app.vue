<template>
    <UApp :toaster="toaster">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const toaster = { max: 3, duration: 2000 }
useAuthToast()

const { initWishlist } = useWishlist()
const { initCart } = useCart()

onMounted(() => {
    initWishlist()
    initCart()
})
</script>
