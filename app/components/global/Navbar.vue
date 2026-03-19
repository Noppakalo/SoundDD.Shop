<template>
    <header class="sticky top-0 z-50 bg-white shadow-lg">
        <div class="bg-primary">
            <UContainer class="text-center text-white max-md:hidden">
                <p>
                    ซาวด์ดีดี ช็อป เครื่องเสียง / ระบบภาพ ออนไลน์ | โชว์รูมเปิด
                    จันทร์ - เสาร์ (9:00 - 17:00 น.)
                </p>
            </UContainer>
        </div>
        <UContainer
            class="grid grid-cols-3 items-center py-4 max-md:grid-cols-2"
        >
            <div class="flex items-center gap-6">
                <ULink to="/">
                    <NuxtImg
                        src="/logos/SoundDD-logo.webp"
                        alt="SoundDD Shop"
                        loading="lazy"
                        draggable="false"
                        class="h-10 w-auto"
                    />
                </ULink>
                <MegaMenu />
            </div>
            <UInput
                icon="i-lucide-search"
                size="md"
                variant="outline"
                placeholder="Search..."
            />
            <div class="flex items-center justify-end gap-6 max-md:hidden">
                <div class="flex items-center gap-2">
                    <UChip
                    aria-label="สินค้าที่สนใจ"
                        color="primary"
                        inset
                        size="3xl"
                        :text="wishlistItemCount"
                        :show="wishlistItemCount > 0"
                    >
                        <UButton
                            to="/account/my-wishlist"
                            icon="i-iconamoon:heart"
                            color="neutral"
                            variant="ghost"
                            size="xl"
                        />
                    </UChip>
                    <UChip
                    aria-label="ตะกร้าสินค้า"
                        color="primary"
                        inset
                        size="3xl"
                        :text="cartItemCount"
                        :show="cartItemCount > 0"
                    >
                        <UButton
                            to="/cart"
                            icon="i-iconamoon:shopping-bag"
                            color="neutral"
                            variant="ghost"
                            size="xl"
                        />
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
                            :src="user?.avatar || customer?.avatar_url || ''"
                            :alt="user?.name"
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
                        content: 'ring-0 max-w-xl',
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
import type { Customer } from '~/types/customer'
const { user } = useWpAuthApi()
const { cartItemCount } = useCart()
const { wishlistItemCount } = useWishlist()
const isOpen = ref(false)
const showLogoutModal = ref(false)

const customer = useState<Customer | null>('current_customer')

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
