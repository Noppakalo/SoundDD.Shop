<template>
    <div class="col-span-2 grid grid-cols-2 gap-4">
        <template v-if="!onlyContact">
            <template v-if="isBilling">
                <URadioGroup
                    v-model="state.customer_type"
                    orientation="horizontal"
                    :items="typeOptions"
                    size="xl"
                    class="col-span-2"
                    aria-label="เลือกประเภทลูกค้า"
                    :ui="{ fieldset: 'flex gap-x-10 justify-center' }"
                />
                <template v-if="state.customer_type === 'natural'">
                    <UFormField label="ชื่อ" :name="fieldName('first_name')">
                        <UInput
                            v-model="state.first_name"
                            placeholder="ชื่อ"
                            class="w-full"
                            aria-label="ชื่อลูกค้า"
                        />
                    </UFormField>
                    <UFormField label="นามสกุล" :name="fieldName('last_name')">
                        <UInput
                            v-model="state.last_name"
                            placeholder="นามสกุล"
                            class="w-full"
                            aria-label="นามสกุลลูกค้า"
                        />
                    </UFormField>
                </template>
                <template v-if="state.customer_type === 'juristic'">
                    <UFormField
                        label="ชื่อบริษัท / นิติบุคคล"
                        :name="fieldName('company')"
                    >
                        <UInput
                            v-model="state.company"
                            placeholder="ระบุชื่อบริษัท"
                            class="w-full"
                            aria-label="ชื่อบริษัทหรือนิติบุคคล"
                        />
                    </UFormField>
                    <UFormField
                        label="เลขประจำตัวผู้เสียภาษี"
                        :name="fieldName('tax_id')"
                    >
                        <UInput
                            v-model="state.tax_id"
                            maxlength="13"
                            placeholder="เลข 13 หลัก"
                            @input="handleTaxIdInput"
                            class="w-full"
                            aria-label="เลขประจำตัวผู้เสียภาษี 13 หลัก"
                        />
                    </UFormField>
                </template>
            </template>
            <template v-else>
                <UFormField label="ชื่อ" :name="fieldName('first_name')">
                    <UInput
                        v-model="state.first_name"
                        placeholder="ชื่อ"
                        class="w-full"
                    />
                </UFormField>
                <UFormField label="นามสกุล" :name="fieldName('last_name')">
                    <UInput
                        v-model="state.last_name"
                        placeholder="นามสกุล"
                        class="w-full"
                    />
                </UFormField>
            </template>
            <UFormField
                label="เบอร์โทรศัพท์"
                :name="fieldName('phone')"
                class="col-span-2"
            >
                <UInput
                    v-model="state.phone"
                    maxlength="10"
                    placeholder="0XXXXXXXXX"
                    @input="handlePhoneInput"
                    class="w-full"
                    aria-label="เบอร์โทรศัพท์ติดต่อ"
                />
            </UFormField>
            <UFormField
                label="ที่อยู่ (บ้านเลขที่ / หมู่บ้าน / ซอย / ถนน)"
                class="col-span-2"
                :name="fieldName('address_1')"
            >
                <UTextarea
                    v-model="state.address_1"
                    placeholder="ที่อยู่..."
                    class="w-full"
                    autoresize
                    aria-label="ที่อยู่"
                />
            </UFormField>
            <UFormField label="อำเภอ / เขต" :name="fieldName('city')">
                <UInput
                    v-model="state.city"
                    placeholder="อำเภอ / เขต"
                    class="w-full"
                    aria-label="อำเภอ / เขต"
                />
            </UFormField>
            <UFormField label="ตำบล / แขวง" :name="fieldName('address_2')">
                <UInput
                    v-model="state.address_2"
                    placeholder="ตำบล / แขวง"
                    class="w-full"
                    aria-label="ตำบล / แขวง"
                />
            </UFormField>
            <UFormField label="จังหวัด" :name="fieldName('state')">
                <UInput
                    v-model="state.state"
                    placeholder="จังหวัด"
                    class="w-full"
                    aria-label="จังหวัด"
                />
            </UFormField>
            <UFormField label="รหัสไปรษณีย์" :name="fieldName('postcode')">
                <UInput
                    v-model="state.postcode"
                    maxlength="5"
                    placeholder="รหัสไปรษณีย์"
                    @input="handlePostcodeInput"
                    class="w-full"
                    aria-label="รหัสไปรษณีย์ 5 หลัก"
                />
            </UFormField>
        </template>
        <template v-else>
            <UFormField label="ชื่อ" :name="fieldName('first_name')">
                <UInput
                    v-model="state.first_name"
                    placeholder="ชื่อ"
                    class="w-full"
                    aria-label="ชื่อ"
                />
            </UFormField>
            <UFormField label="นามสกุล" :name="fieldName('last_name')">
                <UInput
                    v-model="state.last_name"
                    placeholder="นามสกุล"
                    class="w-full"
                    aria-label="นามสกุล"
                />
            </UFormField>
            <UFormField
                label="อีเมล์์"
                :name="fieldName('email')"
                class="col-span-2"
            >
                <UInput
                    v-model="state.email"
                    placeholder="อีเมล์์"
                    class="w-full"
                    aria-label="อีเมล์์"
                />
            </UFormField>
            <UFormField label="เบอร์โทรศัพท์" :name="fieldName('phone')">
                <UInput
                    v-model="state.phone"
                    maxlength="10"
                    placeholder="0XXXXXXXXX"
                    @input="handlePhoneInput"
                    class="w-full"
                    aria-label="เบอร์โทรศัพท์ติดต่อ"
                />
            </UFormField>
            <UFormField label="วัน / เดือน / ปีเกิด">
                <UInputDate
                    ref="inputDate"
                    v-model="internalBirthDate"
                    class="w-full"
                    locale="th-TH-u-ca-buddhist"
                    aria-label="เลือกวันเดือนปีเกิด"
                >
                    <template #trailing>
                        <UPopover :reference="inputDate?.inputsRef[2]?.$el">
                            <UButton
                                color="primary"
                                variant="link"
                                icon="i-iconamoon:calendar-1-light"
                                class="px-0"
                                aria-label="เปิดปฏิทินเลือกวันเกิด"
                            />
                            <template #content>
                                <UCalendar
                                    v-model="internalBirthDate"
                                    locale="th-TH-u-ca-buddhist"
                                    class="p-2"
                                />
                            </template>
                        </UPopover>
                    </template>
                </UInputDate>
            </UFormField>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef, shallowRef, watchEffect, watch } from 'vue'
import {
    parseDate,
    createCalendar,
    toCalendar,
    type CalendarDate,
} from '@internationalized/date'

const birthDateString = defineModel<string>('birthDate')

const props = withDefaults(
    defineProps<{
        state: any
        prefix?: string
        isBilling?: boolean
        onlyContact?: boolean
    }>(),
    {
        prefix: '',
        isBilling: false,
        onlyContact: false,
    }
)

const fieldName = (name: string) =>
    props.prefix ? `${props.prefix}.${name}` : name

const inputDate = useTemplateRef('inputDate')
const internalBirthDate = shallowRef<CalendarDate | undefined>(undefined)

watchEffect(() => {
    if (
        birthDateString.value &&
        typeof birthDateString.value === 'string' &&
        birthDateString.value.trim() !== ''
    ) {
        try {
            internalBirthDate.value = toCalendar(
                parseDate(birthDateString.value),
                createCalendar('buddhist')
            )
        } catch (e) {
            internalBirthDate.value = undefined
        }
    } else {
        internalBirthDate.value = undefined
    }
})

watch(internalBirthDate, (newVal) => {
    if (newVal) {
        birthDateString.value = toCalendar(
            newVal,
            createCalendar('gregory')
        ).toString()
    } else {
        birthDateString.value = ''
    }
})

const typeOptions = [
    { value: 'natural', label: 'บุคคลธรรมดา' },
    { value: 'juristic', label: 'นิติบุคคล' },
]

const handlePhoneInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const filtered = input.value.replace(/[^0-9]/g, '')
    props.state.phone = filtered
    input.value = filtered
}

const handlePostcodeInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const filtered = input.value.replace(/[^0-9]/g, '')
    props.state.postcode = filtered
    input.value = filtered
}

const handleTaxIdInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const filtered = input.value.replace(/[^0-9]/g, '')
    props.state.tax_id = filtered
    input.value = filtered
}
</script>
