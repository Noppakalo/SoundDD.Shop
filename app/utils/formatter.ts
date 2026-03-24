export const formatPrice = (price: string | number) => {
    if (!price || price === '') return '0'
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return numericPrice.toLocaleString()
}

export const calculateDiscount = (
    regularPrice: string | number,
    price: string | number,
    promotionalPrice?: string | number | null
) => {
    const regular =
        typeof regularPrice === 'string'
            ? parseFloat(regularPrice)
            : Number(regularPrice) || 0
    const currentPrice =
        typeof price === 'string' ? parseFloat(price) : Number(price) || 0
    const promotional = promotionalPrice
        ? typeof promotionalPrice === 'string'
            ? parseFloat(promotionalPrice)
            : Number(promotionalPrice)
        : 0
    if (promotional > 0 && currentPrice > promotional) {
        const discount = ((currentPrice - promotional) / currentPrice) * 100
        return Math.round(discount)
    }
    if (regular > currentPrice && currentPrice > 0) {
        const discount = ((regular - currentPrice) / regular) * 100
        return Math.round(discount)
    }
    return 0
}

export const formatDisplayBirthDate = (dateStr?: string | null) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length >= 3 && parts[0]) {
        try {
            return `${parts[2]}/${parts[1]}/${parseInt(parts[0]) + 543}`
        } catch (e) {
            return ''
        }
    }
    return ''
}
