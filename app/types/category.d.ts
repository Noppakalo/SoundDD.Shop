export interface CategoryImages {
    id: number
    src: string
    name: string
    alt: string
}

export interface CategoryAcf {
    image_category?: {
        url: string
        alt: string
    } | null
}

export interface Category {
    id: number
    name: string
    slug: string
    parent: number
    description?: string
    image?: CategoryImages
    count?: number
    acf?: CategoryAcf
    price_range?: {
        min: number
        max: number
    }
}
