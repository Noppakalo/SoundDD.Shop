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
    price: string
    regular_price: string
    on_sale: boolean
    weight?: string
    dimensions?: { length: string; width: string; height: string }
    categories?: ProductCategories[]
    brands?: ProductBrands[]
    tags?: ProductTag[]
    images: ProductImages[]
    attributes: {
        id: number
        name: string
        position?: number
        visible?: boolean
        variation?: boolean
        options: string[]
    }[]
    variations: number[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
    acf?: ProductAcf
}

export interface ProductVariations {
    id: number
    name: string
    sku: string
    price: string
    regular_price: string
    on_sale: boolean
    weight?: string
    dimensions?: { length: string; width: string; height: string }
    images: ProductImages[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
}
