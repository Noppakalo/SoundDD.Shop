<template>
    <section class="py-8">
        <UContainer class="flex flex-col gap-4">
            <div class="flex flex-col items-start gap-8 md:flex-row">
                <aside class="w-1/4 shrink-0">
                    <div v-if="user" class="flex min-w-0 items-baseline gap-2">
                        <span class="shrink-0">สวัสดีคุณ,</span>
                        <p class="truncate text-lg font-bold">
                            {{ user?.name }}
                        </p>
                        <USeparator class="my-4" />
                    </div>
                    <UNavigationMenu
                        orientation="vertical"
                        :items="navigation"
                        class="data-[orientation=vertical]:w-full"
                    />
                </aside>
                <div class="w-3/4 flex-1">
                    <NuxtPage
                        :customer="customer"
                        :loading="customerLoading"
                        :user="user"
                        @update="loadCustomer"
                    />
                </div>
            </div>
        </UContainer>
        <Logout v-model="showLogoutModal" />
    </section>
</template>

<script setup lang="ts">
import type { Customer } from '~/types/customer'
import type { NavigationMenuItem } from '@nuxt/ui'

const { user } = useUserSession()
const { getCustomer } = useWooCustomerApi()

const customer = useState<Customer | null>('current_customer', () => null)
const customerLoading = ref(false)
const showLogoutModal = ref(false)

const loadCustomer = async (updatedData?: Customer) => {
    if (updatedData) {
        customer.value = updatedData
        return
    }
    if (!user.value?.email) return
    customerLoading.value = true
    const result = await getCustomer(user.value.email)
    if (result.success && result.data) {
        customer.value = result.data
    }
    customerLoading.value = false
}

const handleLogout = () => {
    showLogoutModal.value = true
}

const navigation = computed<NavigationMenuItem[]>(() => {
    const items: NavigationMenuItem[] = [
        {
            label: 'ข้อมูลส่วนตัว',
            icon: 'i-iconamoon:profile-light',
            to: '/account',
            exact: true,
        },
        {
            label: 'ที่อยู่จัดส่งสินค้า',
            icon: 'i-iconamoon:location-pin',
            to: '/account/shipping-address',
        },
        {
            label: 'ใบกำกับภาษี',
            icon: 'i-iconamoon:invoice-light',
            to: '/account/tax-invoice',
        },
        {
            label: 'รายการคำสั่งซื้อ',
            icon: 'i-iconamoon:file-document-light',
            to: '/account/order-history',
        },
        {
            label: 'รายการสินค้าที่สนใจ',
            icon: 'i-iconamoon:heart-light',
            to: '/account/my-wishlist',
        },
        {
            label: 'รีวิวของฉัน',
            icon: 'i-iconamoon:star',
            to: '/account/my-review',
        },
        {
            label: 'คูปองของฉัน',
            icon: 'i-iconamoon:ticket-light',
            to: '/account/my-coupon',
        },
        {
            label: 'ใบเสนอราคา',
            icon: 'i-heroicons-document-duplicate',
            to: '/account/quotation',
        },
    ]

    if (user.value) {
        items.push({
            label: 'ออกจากระบบ',
            icon: 'i-iconamoon:exit-light',
            class: 'cursor-pointer',
            onSelect: handleLogout,
        })
    }

    return items
})

await loadCustomer()
</script>
