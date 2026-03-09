import type { Customer, UpdateCustomerPayload, Order } from '~/types/customer'

export const useWooCustomerApi = () => {
    const getCustomer = async (email: string) => {
        try {
            const response = await $fetch<{
                success: boolean
                data: Customer | null
            }>('/api/woo/customers', { query: { email } })
            return response
        } catch {
            return { success: false, data: null }
        }
    }

    const getOrders = async (customerId: number) => {
        try {
            const response = await $fetch<{ success: boolean; data: Order[] }>(
                '/api/woo/orders',
                { query: { customer: customerId } }
            )
            return response
        } catch {
            return { success: false, data: [] as Order[] }
        }
    }

    const updateCustomer = async (id: number, data: UpdateCustomerPayload) => {
        try {
            const response = await $fetch<{ success: boolean; data: Customer }>(
                `/api/woo/customers`,
                {
                    method: 'PUT',
                    body: { id, ...data },
                }
            )
            return response
        } catch (error: any) {
            return {
                success: false,
                data: null,
                message:
                    error.response?._data?.statusMessage ||
                    error.response?._data?.message ||
                    'เกิดข้อผิดพลาดในการเชื่อมต่อ',
            }
        }
    }

    return { getCustomer, getOrders, updateCustomer }
}
