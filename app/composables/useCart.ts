import type { Product } from '~/types/product'

export interface CartItem {
    product: Product
    quantity: number
}

export const useCart = () => {

    const items = useState<CartItem[]>('cart', () => [])
    const toast = useToast()

    const initCart = () => {
        if (import.meta.client) {
            const stored = localStorage.getItem('cart')
            if (stored) {
                try {
                    items.value = JSON.parse(stored)
                } catch (e) {
                    console.error('Failed to parse local cart:', e)
                }
            }
        }
    }

    const saveCart = async () => {
        if (import.meta.client) {
            localStorage.setItem('cart', JSON.stringify(items.value))
        }
    }



    const isInCart = (productId: number | string) => {
        return items.value.some((item) => item.product.id === productId)
    }

    const addToCart = async (product: Product, quantity: number = 1) => {
        const existingItem = items.value.find(
            (item) => item.product.id === product.id
        )
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            items.value.push({ product, quantity })
        }

        toast.add({
            title: 'เพิ่มสินค้าเข้าตะกร้า',
            color: 'success',
            icon: 'i-iconamoon:check-circle-1',
        })

        await saveCart()
    }

    const removeFromCart = async (productId: string | number) => {
        const index = items.value.findIndex(
            (item) => item.product.id === productId
        )
        if (index > -1) {
            items.value.splice(index, 1)
            await saveCart()
        }
    }

    const updateQuantity = async (
        productId: string | number,
        quantity: number
    ) => {
        const existingItem = items.value.find(
            (item) => item.product.id === productId
        )
        if (existingItem) {
            existingItem.quantity = quantity
            if (existingItem.quantity <= 0) {
                await removeFromCart(productId)
            } else {
                await saveCart()
            }
        }
    }

    const clearCart = async () => {
        items.value = []
        await saveCart()
    }

    const cartItemCount = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    const cartTotal = computed(() => {
        return items.value.reduce((total, item) => {
            const price = parseFloat(item.product.sale_price || '0')
            return total + price * item.quantity
        }, 0)
    })

    return {
        items,
        initCart,
        isInCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartTotal,
    }
}
