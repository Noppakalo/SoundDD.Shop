<template>
    <UApp :toaster="toaster">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const toaster = { max: 1, duration: 1000 }

const { initWishlist } = useWishlist()
const { initCart } = useCart()
const { handleAuthQueries } = useAppToast()

onMounted(() => {
    initWishlist()
    initCart()
    handleAuthQueries()
})
</script>
