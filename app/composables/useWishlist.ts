export const useWishlist = () => {
    const { user } = useWpAuthApi()
    const { getCustomer, updateCustomer } = useWooCustomerApi()
    
    const wishlistItems = useState<number[]>('wishlistItems', () => [])
    const isLoading = ref(false)
    const customerId = ref<number | null>(null)

    const fetchCustomerData = async (email: string, updateItems: boolean = true) => {
        isLoading.value = true
        try {
            const result = await getCustomer(email)
            if (result.success && result.data) {
                customerId.value = result.data.id
                
                if (updateItems) {
                    const wishlistMeta = result.data.meta_data?.find(
                        (meta) => meta.key === 'wishlist'
                    )

                    if (wishlistMeta && wishlistMeta.value) {
                        try {
                            const parsed = typeof wishlistMeta.value === 'string' 
                                ? JSON.parse(wishlistMeta.value) 
                                : wishlistMeta.value
                            
                            const serverItems = Array.isArray(parsed) ? parsed : []
                            
                            // Merge local items with server items
                            const mergedItems = Array.from(new Set([...wishlistItems.value, ...serverItems]))
                            wishlistItems.value = mergedItems

                            if (import.meta.client) {
                                localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems.value))
                            }

                            if (mergedItems.length > serverItems.length) {
                                saveWishlist()
                            }
                        } catch (e) {
                            wishlistItems.value = []
                        }
                    } else {
                        wishlistItems.value = []
                    }
                }
            }
        } catch (error) {
            if (updateItems) wishlistItems.value = []
        } finally {
            isLoading.value = false
        }
    }

    const initWishlist = () => {
        if (import.meta.client) {
            const stored = localStorage.getItem('wishlistItems')
            if (stored) {
                try {
                    wishlistItems.value = JSON.parse(stored)
                } catch (e) {
                    console.error('Failed to parse local wishlist:', e)
                }
            }
        }

        if (user.value?.email) {
            fetchCustomerData(user.value.email)
        } else {
            const unwatch = watch(() => user.value?.email, (newEmail) => {
                if (newEmail) {
                    fetchCustomerData(newEmail)
                    unwatch()
                }
            }, { immediate: true })
        }
    }

    const saveWishlist = async () => {
        if (!customerId.value) {
            if (user.value?.email) {
               await fetchCustomerData(user.value.email, false)
            }
            if (!customerId.value) return
        }

        try {
            await updateCustomer(customerId.value, {
                wishlist: JSON.stringify(wishlistItems.value),
            })
        } catch (error) {
            console.error('Failed to save wishlist:', error)
        }
    }

    const toggleWishlist = async (productId: number) => {
        const index = wishlistItems.value.indexOf(productId)
        if (index > -1) {
            wishlistItems.value.splice(index, 1)
            useToast().add({
                title: 'นำออกจากรายการที่สนใจแล้ว',
                color: 'success',
                icon: 'i-iconamoon:check-circle-1',
            })
        } else {
            wishlistItems.value.push(productId)
            useToast().add({
                title: 'เพิ่มลงในรายการที่สนใจแล้ว',
                color: 'success',
                icon: 'i-iconamoon:check-circle-1',
            })
        }

        if (import.meta.client) {
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems.value))
        }

        if (user.value) {
            await saveWishlist()
        }
    }

    const isInWishlist = (productId: number) => {
        return wishlistItems.value.includes(productId)
    }

    const wishlistItemCount = computed(() => wishlistItems.value.length)

    return {
        wishlistItems,
        wishlistItemCount,
        isLoading,
        initWishlist,
        toggleWishlist,
        isInWishlist,
    }
}
