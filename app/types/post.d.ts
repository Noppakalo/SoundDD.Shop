export interface PostTag {
    id: number
    name: string
    slug: string
    count?: number
}

export interface PostCategories {
    id: number
    name: string
    slug: string
    count?: number
}

export interface Post {
    id: number
    date: string
    modified?: string
    slug: string
    link?: string
    title: { rendered: string }
    excerpt?: { rendered: string }
    featured_image_data?: {
        url: string
        alt: string
    } | null
    tags_data?: PostTag[]
    categories_data?: PostCategories[]
}
