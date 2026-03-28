export interface PromotionImage {
    url: string
    alt: string
}

export interface PromotionACF {
    image_promotion: PromotionImage
    link_promotion: string
}

export interface PromotionCarousel {
    id: number
    acf: PromotionACF
}
