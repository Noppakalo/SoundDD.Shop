export interface ProductTag {
    id: number
    name: string
    slug: string
    count?: number
}

export interface ProductCategories {
    id: number
    name: string
    slug: string
    count?: number
}

export interface Category {
    id: number
    name: string
    slug: string
    parent: number
}

export interface ProductBrands {
    id: number
    name: string
    slug: string
    count?: number
}

export interface Brands {
    id: number
    name: string
    slug: string
    image?: ProductImages
}

export interface ProductImages {
    id: number
    src: string
    name: string
    alt: string
}

export interface Product {
    id: number
    name: string
    slug: string
    permalink: string
    date_created?: string
    description?: string
    short_description?: string
    sku?: string
    price: string
    regular_price: string
    sale_price: string
    on_sale: boolean
    weight?: string
    dimensions?: { length: string; width: string; height: string }
    categories?: ProductCategories[]
    brands?: ProductBrands[]
    tags?: ProductTag[]
    images: ProductImages[]
    attributes?: []
    related_ids?: number[]
    stock_status: 'instock' | 'outofstock' | 'onbackorder'
    meta_data?: { key: string; value: any }[]
    promotional_price?: string | null
}
