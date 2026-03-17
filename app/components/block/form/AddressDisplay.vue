<template>
    <div class="col-span-2 grid grid-cols-2 gap-4">
        <template v-if="!onlyContact">
            <template v-if="isBilling">
                <UFormField label="ประเภทผู้เสียภาษี" class="col-span-2">
                    <UInput
                        :value="customerType === 'juristic' ? 'นิติบุคคล' : 'บุคคลธรรมดา'"
                        readonly
                        class="w-full"
                    />
                </UFormField>
                <template v-if="customerType === 'juristic'">
                    <UFormField label="ชื่อบริษัท / นิติบุคคล">
                        <UInput :value="address.company" readonly class="w-full" />
                    </UFormField>
                    <UFormField label="เลขประจำตัวผู้เสียภาษี">
                        <UInput :value="taxId" readonly class="w-full" />
                    </UFormField>
                </template>
                <template v-if="customerType === 'natural'">
                    <UFormField label="ชื่อ-นามสกุล" class="col-span-2">
                        <UInput
                            :value="`${address.first_name} ${address.last_name}`.trim()"
                            readonly
                            class="w-full"
                        />
                    </UFormField>
                </template>
            </template>
            <template v-else>
                <UFormField label="ชื่อ-นามสกุล">
                    <UInput :value="`${address.first_name} ${address.last_name}`.trim()" readonly class="w-full" />
                </UFormField>
            </template>
            <UFormField label="เบอร์โทรศัพท์" :class="isBilling ? 'col-span-2' : ''">
                <UInput :value="address.phone" readonly class="w-full" />
            </UFormField>
            <UFormField label="ที่อยู่ (บ้านเลขที่ / หมู่บ้าน / ซอย / ถนน)" class="col-span-2">
                <UTextarea :value="`${address.address_1}`.trim()" readonly class="w-full" autoresize />
            </UFormField>
            
            <UFormField label="อำเภอ / เขต">
                <UInput :value="address.city" placeholder="อำเภอ / เขต" readonly class="w-full" />
            </UFormField>
            <UFormField label="ตำบล / แขวง">
                <UInput :value="address.address_2" placeholder="ตำบล / แขวง" readonly class="w-full" />
            </UFormField>
            <UFormField label="จังหวัด">
                <UInput :value="address.state" readonly class="w-full" />
            </UFormField>
            <UFormField label="รหัสไปรษณีย์">
                <UInput :value="address.postcode" readonly class="w-full" />
            </UFormField>
        </template>
        <template v-else>
            <UFormField label="ชื่อ-นามสกุล">
                <UInput
                    :value="`${address.first_name} ${address.last_name}`.trim()"
                    readonly
                    placeholder="-- ยังไม่มีข้อมูล --"
                    class="w-full"
                />
            </UFormField>
            <UFormField label="อีเมล">
                <UInput :value="email" readonly class="w-full" />
            </UFormField>
            <UFormField label="เบอร์โทรศัพท์">
                <UInput
                    :value="address.phone"
                    readonly
                    placeholder="-- ยังไม่มีข้อมูล --"
                    class="w-full"
                />
            </UFormField>
            <UFormField label="วัน / เดือน / ปีเกิด">
                <UInput
                    :value="birthDate"
                    readonly
                    placeholder="-- ยังไม่มีข้อมูล --"
                    class="w-full"
                />
            </UFormField>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    address: any,
    isBilling?: boolean,
    customer?: any,
    onlyContact?: boolean,
    email?: string,
    birthDate?: string
}>(), {
    isBilling: false,
    onlyContact: false,
    email: '',
    birthDate: ''
})

const customerType = computed(() => {
    return props.customer?.meta_data?.find((m: any) => m.key === 'customer_type')?.value || 'natural'
})

const taxId = computed(() => {
    return props.customer?.meta_data?.find((m: any) => m.key === 'tax_id')?.value || ''
})
</script>
