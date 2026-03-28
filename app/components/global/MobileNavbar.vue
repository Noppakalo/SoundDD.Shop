<template>
    <nav
        class="fixed right-0 bottom-0 left-0 z-50 bg-white drop-shadow-sm md:hidden"
    >
        <div class="flex justify-between">
            <UButton
                to="/"
                :color="isActive('/') ? 'primary' : 'neutral'"
                variant="ghost"
                aria-label="หน้าแรก"
                :class="[
                    'flex flex-col items-center gap-1',
                    isActive('/')
                        ? 'border-primary rounded-t-none border-t-2'
                        : '',
                ]"
                ><UIcon name="i-iconamoon:store-light" class="size-6" />
                <p class="text-xs">หน้าแรก</p></UButton
            >
            <UButton
                to="/product-category"
                :color="isActive('/product-category') ? 'primary' : 'neutral'"
                variant="ghost"
                aria-label="หมวดหมู่สินค้าทั้งหมด"
                :class="[
                    'flex flex-col items-center gap-1',
                    isActive('/product-category')
                        ? 'border-primary rounded-t-none border-t-2'
                        : '',
                ]"
                ><UIcon name="i-tabler:layout-grid" class="size-6" />
                <p class="text-xs">หมวดหมู่</p></UButton
            >
            <div class="relative">
                <UButton
                    to="/cart"
                    :color="isActive('/cart') ? 'primary' : 'neutral'"
                    variant="ghost"
                    :aria-label="`ตะกร้าสินค้า (${cartItemCount} รายการ)`"
                    :class="[
                        'flex flex-col items-center gap-1',
                        isActive('/cart')
                            ? 'border-primary rounded-t-none border-t-2'
                            : '',
                    ]"
                >
                    <div class="relative size-6">
                        <UIcon name="i-iconamoon:shopping-bag" class="size-6" />
                        <span
                            v-if="cartItemCount > 0"
                            class="bg-primary absolute -top-1 -right-2 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        >
                            {{ cartItemCount > 99 ? '99+' : cartItemCount }}
                        </span>
                    </div>
                    <p class="text-xs">ตะกร้าสินค้า</p>
                </UButton>
            </div>
            <UButton
                to="/blog"
                :color="isActive('/blog') ? 'primary' : 'neutral'"
                variant="ghost"
                aria-label="รีวิวและบทความ"
                :class="[
                    'flex flex-col items-center gap-1',
                    isActive('/blog')
                        ? 'border-primary rounded-t-none border-t-2'
                        : '',
                ]"
                ><UIcon name="i-iconamoon:news-light" class="size-6" />
                <p class="text-xs">รีวิว / บทความ</p></UButton
            >
            <div v-if="loggedIn && user">
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
                        aria-label="เมนูบัญชีผู้ใช้งาน"
                        class="cursor-pointer"
                    />
                    <template #content>
                        <Logout v-model="showLogoutModal" />
                    </template>
                </UPopover>
            </div>
            <UModal
                v-if="!user"
                v-model="isOpen"
                :ui="{
                    content: 'ring-0 max-w-xl',
                    overlay: 'bg-black/50 backdrop-blur-xs',
                }"
            >
                <UButton
                    @click="isOpen = true"
                    :color="isActive('/account') ? 'primary' : 'neutral'"
                    variant="ghost"
                    aria-label="เข้าสู่ระบบและสมัครสมาชิก"
                    :class="[
                        'flex flex-col items-center gap-1',
                        isActive('/account')
                            ? 'border-primary rounded-t-none border-t-2'
                            : '',
                    ]"
                >
                    <UIcon name="i-iconamoon:profile" class="size-6" />
                    <p class="text-xs">บัญชี</p>
                </UButton>
                <template #content>
                    <AuthBlock @close="isOpen = false" />
                </template>
            </UModal>
        </div>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { loggedIn, user } = useUserSession()
const { cartItemCount } = useCart()
const isOpen = ref(false)
const showLogoutModal = ref(false)

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}
</script>
