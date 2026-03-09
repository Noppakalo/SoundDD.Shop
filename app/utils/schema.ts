import { object, string } from 'yup'

export const accountSchema = object({
    first_name: string().required('กรุณากรอกชื่อ'),
    last_name: string().required('กรุณากรอกนามสกุล'),
    email: string().email('กรุณากรอกอีเมลให้ถูกต้อง').required('กรุณากรอกอีเมล'),
    phone: string()
        .matches(/^[0-9]+$/, 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก')
        .required('กรุณากรอกเบอร์โทร'),
})

export const shippingSchema = object({
    shipping: object({
        first_name: string().required('กรุณากรอกชื่อ'),
        last_name: string().required('กรุณากรอกนามสกุล'),
        phone: string()
            .matches(/^0[0-9]{9}$/, 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก')
            .required('กรุณากรอกเบอร์โทร'),
        address_1: string().required('กรุณากรอกที่อยู่'),
        address_2: string().required('กรุณากรอกตำบล'),
        city: string().required('กรุณากรอกอำเภอ'),
        state: string().required('กรุณากรอกจังหวัด'),
        postcode: string()
            .matches(/^[0-9]{5}$/, 'กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก')
            .required('กรุณากรอกรหัสไปรษณีย์'),
    }),
})

export const taxSchema = object({
    billing: object({
        customer_type: string().default('natural'),
        first_name: string().when('customer_type', {
            is: 'natural',
            then: (s) => s.required('กรุณากรอกชื่อ'),
            otherwise: (s) => s.optional(),
        }),
        last_name: string().when('customer_type', {
            is: 'natural',
            then: (s) => s.required('กรุณากรอกนามสกุล'),
            otherwise: (s) => s.optional(),
        }),
        company: string().when('customer_type', {
            is: 'juristic',
            then: (s) => s.required('กรุณากรอกชื่อบริษัท'),
            otherwise: (s) => s.optional(),
        }),
        tax_id: string().when('customer_type', {
            is: 'juristic',
            then: (s) =>
                s
                    .matches(
                        /^[0-9]{13}$/,
                        'กรุณากรอกเลขผู้เสียภาษีให้ครบ 13 หลัก'
                    )
                    .required('กรุณากรอกเลขผู้เสียภาษี'),
            otherwise: (s) => s.optional(),
        }),
        phone: string()
            .matches(/^0[0-9]{9}$/, 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก')
            .required('กรุณากรอกเบอร์โทร'),
        address_1: string().required('กรุณากรอกที่อยู่'),
        address_2: string().required('กรุณากรอกตำบล'),
        city: string().required('กรุณากรอกอำเภอ'),
        state: string().required('กรุณากรอกจังหวัด'),
        postcode: string()
            .matches(/^[0-9]{5}$/, 'กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก')
            .required('กรุณากรอกรหัสไปรษณีย์'),
    }),
})
