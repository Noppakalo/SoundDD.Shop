<template>
    <footer class="bg-white pt-10 pb-4">
        <UContainer>
            <div
                class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]"
            >
                <div
                    class="flex flex-col gap-4 max-sm:col-span-2 max-sm:items-center max-sm:text-center"
                >
                    <ULink to="/">
                        <NuxtImg
                            src="logos/SoundDD-Group-Main.webp"
                            alt="SoundDD Group"
                            loading="lazy"
                            draggable="false"
                            class="h-8 w-auto"
                        />
                    </ULink>
                    <address class="flex flex-col gap-2.5 text-sm not-italic">
                        <p class="text-base font-bold">
                            บริษัท ซาวด์ดีดี กรุ๊ป จำกัด
                        </p>
                        <p>
                            7, 9 ถนนชัยพฤกษ์ แขวงตลิ่งชัน<br />เขตตลิ่งชัน
                            กรุงเทพมหานคร 10170
                        </p>
                        <div class="flex flex-col gap-1 max-sm:items-center">
                            <ULink
                                to="tel:024358998"
                                class="hover:text-primary flex items-center gap-2 transition-colors"
                            >
                                <UIcon
                                    name="i-iconamoon:phone"
                                    class="size-5"
                                />
                                02-435-8998
                            </ULink>
                            <ULink
                                to="tel:0653968888"
                                class="hover:text-primary flex items-center gap-2 transition-colors"
                            >
                                <UIcon
                                    name="line-md:cellphone"
                                    class="size-5"
                                />
                                065-396-8888
                            </ULink>
                        </div>
                        <p>เลขที่ทะเบียน: 0105562106163</p>
                    </address>
                </div>
                <nav
                    v-for="nav in footerNavs"
                    :key="nav.title"
                    class="flex flex-col gap-4"
                >
                    <p class="font-bold">{{ nav.title }}</p>
                    <ul class="space-y-3">
                        <li v-for="link in nav.links" :key="link.to">
                            <ULink
                                :to="link.to"
                                class="hover:text-primary text-sm transition-colors"
                            >
                                {{ link.label }}
                            </ULink>
                        </li>
                    </ul>
                </nav>
                <div class="flex flex-col gap-8">
                    <div class="flex flex-col gap-4">
                        <p class="font-bold">วิธีการชำระเงิน</p>
                        <div class="flex flex-wrap gap-2">
                            <NuxtImg
                                v-for="img in paymentMethods"
                                :key="img.name"
                                :src="img.src"
                                :alt="img.name"
                                loading="lazy"
                                draggable="false"
                                class="h-9 w-auto max-sm:h-8"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <p class="font-bold">เช็คสถานะการจัดส่ง</p>
                        <div class="flex flex-wrap gap-2">
                            <NuxtImg
                                v-for="img in shippingPartners"
                                :key="img.name"
                                :src="img.src"
                                :alt="img.name"
                                loading="lazy"
                                draggable="false"
                                class="h-9 w-auto max-sm:h-8"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-8">
                    <div class="flex flex-col gap-4">
                        <p class="font-bold">ติดตามเรา</p>
                        <div class="flex gap-4">
                            <ULink
                                v-for="social in socialLinks"
                                :key="social.to"
                                :to="social.to"
                                target="_blank"
                                class="text-xl transition-transform hover:scale-110"
                                :class="social.color"
                            >
                                <UIcon :name="social.icon" class="h-6" />
                            </ULink>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <p class="font-bold">รับรองโดย</p>
                        <ULink
                            to="social.to"
                            target="_blank"
                            class="text-xl transition-transform hover:scale-110"
                        >
                            <NuxtImg
                                src="/icons/certificate/dbd-silver.webp"
                                alt="name"
                                loading="lazy"
                                draggable="false"
                                class="h-6 w-auto"
                            />
                        </ULink>
                    </div>
                </div>
            </div>
            <div
                class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 md:flex-row"
            >
                <p class="text-xs text-gray-500">
                    © {{ new Date().getFullYear() }} SoundDD Group CO., LTD. All
                    Rights Reserved.
                </p>
                <div class="flex gap-4 text-xs text-gray-500">
                    <ULink to="/privacy-policy" class="hover:text-primary"
                        >นโยบายความเป็นส่วนตัว</ULink
                    >
                    <span class="text-gray-300">|</span>
                    <ULink to="/refund-policy" class="hover:text-primary"
                        >นโยบายการคืนสินค้า</ULink
                    >
                </div>
            </div>
        </UContainer>
    </footer>
</template>

<script setup lang="ts">
const footerNavs = [
    {
        title: 'ติดต่อเรา',
        links: [
            { label: 'ติดต่อฝ่ายขาย', to: '/contact/sales' },
            { label: 'ติดต่อทีมเซอร์วิส', to: '/contact/service' },
            { label: 'วิธีการสั่งซื้อ', to: '/how-to-order' },
            { label: 'ขั้นตอนการติดตั้งสินค้า', to: '/track-order' },
            { label: 'ขอใบเสนอราคา', to: '/quotation' },
        ],
    },
    {
        title: 'บริการลูกค้า',
        links: [
            { label: 'แจ้งชำระเงิน', to: '/payment-notification' },
            { label: 'นโยบายการรับประกัน', to: '/warranty-policy' },
            { label: 'ศูนย์ซ่อมสินค้า', to: '/service-center' },
            { label: 'บทความและรีวิว', to: '/blog' },
            { label: 'คำถามที่พบบ่อย', to: '/faq' },
        ],
    },
]

const paymentMethods = [
    { name: 'Visa', src: '/icons/payment/logo-visa.webp' },
    { name: 'Mastercard', src: '/icons/payment/logo-mastercard.webp' },
    { name: 'Kasikorn', src: '/icons/payment/logo-kasikornbank.webp' },
    { name: 'Scb', src: '/icons/payment/logo-Scbbank.webp' },
]

const shippingPartners = [
    { name: 'NIM Express', src: '/icons/shipping/Nim-Express.webp' },
    { name: 'BEST Express', src: '/icons/shipping/Best-Express.webp' },
    { name: 'NTC Express', src: '/icons/shipping/NTC-Express.webp' },
]

const socialLinks = [
    {
        icon: 'i-simple-icons-facebook',
        to: 'https://facebook.com/sounddd',
        color: 'text-[#0866ff]',
    },
    {
        icon: 'i-simple-icons-line',
        to: 'https://line.me/ti/p/@sounddd',
        color: 'text-[#06C755]',
    },
    {
        icon: 'i-simple-icons-youtube',
        to: 'https://youtube.com/sounddd',
        color: 'text-[#ff0033]',
    },
    {
        icon: 'i-simple-icons-tiktok',
        to: 'https://tiktok.com/@sounddd',
        color: 'text-black',
    },
]
</script>
