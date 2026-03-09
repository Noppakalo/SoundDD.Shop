export interface CustomerAddress {
    first_name: string
    last_name: string
    company?: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
    email?: string
    phone?: string
    birth_date?: string
    customer_type?: string
    tax_id?: string
}

export interface Customer {
    id: number
    username: string
    slug: string
    email: string
    first_name: string
    last_name: string
    billing: CustomerAddress
    shipping: CustomerAddress
    avatar_url: string
    meta_data: { key: string; value: any }[]
    wishlist?: string
}

export interface UpdateCustomerPayload {
    first_name?: string
    last_name?: string
    company?: string
    phone?: string
    billing?: Partial<CustomerAddress>
    shipping?: Partial<CustomerAddress>
    meta_data?: { key: string; value: any }[]
    birth_date?: string
    customer_type?: string
    tax_id?: string
    wishlist?: string
}

export interface OrderLineItem {
    id: number
    name: string
    quantity: number
    price: number
    total: string
    image?: { src: string }
}

export interface Order {
    id: number
    status: string
    currency_symbol: string
    date_created: string
    total: string
    line_items: OrderLineItem[]
    billing: CustomerAddress
    shipping: CustomerAddress
}
