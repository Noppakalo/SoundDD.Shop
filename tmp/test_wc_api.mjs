
import { Buffer } from 'buffer'

const WP_URL = 'https://928374.insightx.dev'
const WP_USERNAME = 'Oatzys'
const WP_APP_PASSWORD = '7ttyUDqjqdEIBwgSz8Bsz8LA' // from .env without spaces

const authHeader = `Basic ${Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')}`

async function test() {
    console.log('Testing WooCommerce API...')
    try {
        const res = await fetch(`${WP_URL}/wp-json/wc/v3/customers?per_page=1`, {
            headers: {
                'Authorization': authHeader
            }
        })
        const data = await res.json()
        console.log('Status:', res.status)
        console.log('Response:', JSON.stringify(data, null, 2))
    } catch (err) {
        console.error('Error:', err)
    }
}

test()
