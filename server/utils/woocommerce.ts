import type { Customer } from '~/types/customer'

function buildBasicAuth(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}

export function buildWooAuth(
    config: ReturnType<typeof useRuntimeConfig>
): string {
    const wooKey =
        config.wooConsumerKey || process.env.NUXT_WOO_CONSUMER_KEY || ''
    const wooSecret =
        config.wooConsumerSecret || process.env.NUXT_WOO_CONSUMER_SECRET || ''

    if (!wooKey || !wooSecret) {
        console.warn(
            '⚠️ ไม่พบ Consumer Key หรือ Consumer Secret ของ WooCommerce'
        )
    }

    return buildBasicAuth(wooKey, wooSecret)
}

export async function wooFindCustomerByEmail(
    email: string,
    authHeader: string,
    wpUrl: string
): Promise<Customer | null> {
    const customers = await $fetch<Customer[]>(
        `${wpUrl}/wp-json/wc/v3/customers`,
        {
            headers: { Authorization: authHeader },
            query: { email, per_page: 1 },
        }
    )

    if (!customers || customers.length === 0) return null

    return (
        customers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
        null
    )
}

export async function wooCreateCustomer(
    data: Record<string, unknown>,
    authHeader: string,
    wpUrl: string
): Promise<Customer> {
    return $fetch<Customer>(`${wpUrl}/wp-json/wc/v3/customers`, {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: data,
    })
}

export async function wooUpdateCustomer(
    id: number,
    data: Record<string, unknown>,
    authHeader: string,
    wpUrl: string
): Promise<Customer> {
    return $fetch<Customer>(`${wpUrl}/wp-json/wc/v3/customers/${id}`, {
        method: 'PUT',
        headers: { Authorization: authHeader },
        body: { id, ...data },
    })
}

import type { WpJwtResponse } from '~/types/auth'

export async function wooFetchJwtToken(
    username: string,
    password: string,
    wpUrl: string
): Promise<string | null> {
    try {
        const res = await $fetch<WpJwtResponse>(
            `${wpUrl}/wp-json/jwt-auth/v1/token`,
            {
                method: 'POST',
                body: { username, password },
            }
        )
        return res.token ?? null
    } catch (error: any) {
        console.error(
            'JWT Token Error:',
            error.response?._data || error.message
        )
        return null
    }
}
