import type { Customer } from '~/types/customer'

function buildBasicAuth(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}

export function buildWooAuth(
    config: ReturnType<typeof useRuntimeConfig>
): string {
    const wpUsername =
        (config.wpAppUsername as string) ||
        process.env.NUXT_WP_APP_USERNAME ||
        'Oatzys'
    const wpPassword =
        (config.wpAppPassword as string) ||
        process.env.NUXT_WP_APP_PASSWORD ||
        ''
    if (wpPassword) return buildBasicAuth(wpUsername, wpPassword)

    const key =
        (config.wooConsumerKey as string) ||
        process.env.NUXT_WOO_CONSUMER_KEY ||
        ''
    const secret =
        (config.wooConsumerSecret as string) ||
        process.env.NUXT_WOO_CONSUMER_SECRET ||
        ''

    return buildBasicAuth(key, secret)
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

export async function wooFetchJwtToken(
    username: string,
    password: string,
    wpUrl: string
): Promise<string | null> {
    try {
        const res = await $fetch<{ token: string }>(
            `${wpUrl}/wp-json/jwt-auth/v1/token`,
            {
                method: 'POST',
                body: { username, password },
            }
        )
        return res.token ?? null
    } catch (error) {
        console.error('JWT Token Error:', error)
        return null
    }
}
