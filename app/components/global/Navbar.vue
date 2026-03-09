<template>
    <header class="sticky top-0 z-50 bg-white shadow-lg">
        <div class="bg-primary">
            <UContainer class="text-center text-white">
                <p>
                    ซาวด์ดีดี ช็อป เครื่องเสียง / ระบบภาพ ออนไลน์ | โชว์รูมเปิด
                    จันทร์ - เสาร์ (9:00 - 17:00 น.)
                </p>
            </UContainer>
        </div>
        <UContainer class="grid grid-cols-3 items-center py-4"
            ><NuxtLink to="/">
                <NuxtImg
                    src="/logos/SoundDD-logo.webp"
                    alt="SoundDD Shop"
                    loading="lazy"
                    draggable="false"
                    class="h-10 w-auto"
                />
            </NuxtLink>
            <UInput
                icon="i-lucide-search"
                size="md"
                variant="outline"
                placeholder="Search..."
            />
            <div class="flex items-center justify-end gap-6">
                <div class="flex items-center gap-2">
                    <UChip
                        color="primary"
                        inset
                        size="3xl"
                        :text="cartItemCount"
                        :show="cartItemCount > 0"
                    >
                        <NuxtLink to="/cart">
                            <UButton
                                aria-label="สินค้าที่สนใจ"
                                icon="i-iconamoon:shopping-bag"
                                color="neutral"
                                variant="ghost"
                                size="xl"
                            />
                        </NuxtLink>
                    </UChip>
                </div>
                <div v-if="user">
                    <UPopover
                        mode="hover"
                        :popper="{
                            placement: 'bottom-end',
                            offsetDistance: 10,
                        }"
                    >
                        <UAvatar
                            :src="user.avatar"
                            :alt="user.name"
                            loading="lazy"
                            draggable="false"
                            size="xl"
                            class="cursor-pointer"
                        />
                        <template #content>
                            <ul class="w-48 space-y-1 p-2">
                                <li
                                    v-for="(item, index) in accountMenu"
                                    :key="index"
                                    @click="item.click"
                                    class="hover:text-primary hover:bg-primary/10 cursor-pointer rounded-md px-3 py-2 transition-colors"
                                >
                                    {{ item.label }}
                                </li>
                            </ul>
                        </template>
                    </UPopover>
                </div>
                <Logout v-model="showLogoutModal" />
                <UModal
                    v-if="!user"
                    v-model="isOpen"
                    :ui="{
                        content: 'ring-0 max-w-fit',
                        overlay: 'bg-black/50 backdrop-blur-xs',
                    }"
                >
                    <UButton label="เข้าสู่ระบบ" @click="isOpen = true" />
                    <template #content>
                        <AuthBlock @close="isOpen = false" />
                    </template>
                </UModal>
            </div>
        </UContainer>
    </header>
</template>

<script setup lang="ts">
const { user } = useWpAuthApi()
const { cartItemCount } = useCart()
const isOpen = ref(false)
const showLogoutModal = ref(false)

const accountMenu = [
    { label: 'บัญชีของฉัน', click: () => navigateTo('/account') },
    {
        label: 'รายการคำสั่งซื้อ',
        click: () => navigateTo('/account/order-history'),
    },
    { label: 'ใบเสนอราคา', click: () => navigateTo('/account/quotation') },
    {
        label: 'ออกจากระบบ',
        click: () => {
            showLogoutModal.value = true
        },
    },
]
</script>
