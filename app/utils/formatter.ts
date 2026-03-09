export const formatPrice = (price: string | number) => {
    if (!price) return '0'
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
    return numericPrice.toLocaleString()
}

export const calculateDiscount = (
    regularPrice: string | number,
    salePrice: string | number,
    promotionalPrice?: string | number | null
) => {
    const regular =
        typeof regularPrice === 'string'
            ? parseFloat(regularPrice)
            : regularPrice
    const sale =
        typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice

    const promotional = promotionalPrice
        ? typeof promotionalPrice === 'string'
            ? parseFloat(promotionalPrice)
            : promotionalPrice
        : 0

    if (regular > promotional && promotional > 0) {
        const discount = ((regular - promotional) / regular) * 100
        return Math.round(discount)
    }
    if (regular > sale && sale > 0) {
        const discount = ((regular - sale) / regular) * 100
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
