export interface ProductCategories {
    id: number
    name: string
    slug: string
    count?: number
}
export interface ProductBrands {
    id: number
    name: string
    slug: string
    count?: number
}

export interface ProductTag {
    id: number
    name: string
    slug: string
    count?: number
}

export interface ProductImages {
    id: number
    src: string
    name: string
    alt: string
}

export interface ProductAcf {
    promotional_price?: string | null
    variant_title?: string | null
    variant_links_data?: {
        url: string
        label: string
    }[]
    image_gift?: {
        url: string
        alt: string
    } | null
}

export interface ProductAttributes {
    id: number
    name?: string
    option?: string
    color?: string
}

export interface ProductVariations {
    id: number
    sku: string
    sale_price: string
    regular_price: string
    date_on_sale_from?: string
    date_on_sale_to?: string
    on_sale: boolean
    images: ProductImages[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
    attributes?: ProductAttributes[]
}

export interface Product {
    id: number
    name: string
    slug: string
    description?: string
    short_description?: string
    sku?: string
    sale_price: string
    regular_price: string
    date_on_sale_from?: string
    date_on_sale_to?: string
    on_sale: boolean
    categories?: ProductCategories[]
    brands?: ProductBrands[]
    tags?: ProductTag[]
    images: ProductImages[]
    default_attributes: ProductAttributes[]
    attributes: ProductAttributes[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
    acf?: ProductAcf
    variations_data?: ProductVariations[]
    variation_id?: number
}
