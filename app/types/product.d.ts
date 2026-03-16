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
    variant_links?: string[] | null
    image_gift?: {
        url: string
        alt: string
    } | null
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
    on_sale: boolean
    categories?: ProductCategories[]
    brands?: ProductBrands[]
    tags?: ProductTag[]
    images: ProductImages[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
    acf?: ProductAcf
    variations_data?: ProductVariations[]
}

export interface ProductVariations {
    id: number
    sku: string
    sale_price: string
    regular_price: string
    on_sale: boolean
    images: ProductImages[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
    attributes?: {
        option?: string
    }[]
}
