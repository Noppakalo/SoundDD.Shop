export const useAuthToast = () => {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()

    const showAuthSuccess = (description?: string) => {
        toast.add({
            title: 'เข้าสู่ระบบสำเร็จ!',
            description: description || 'ยินดีต้อนรับสู่ SoundDD',
            color: 'success',
        })
    }

    const showAuthError = (description?: string) => {
        toast.add({
            title: 'เกิดข้อผิดพลาด',
            description:
                description || 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง',
            color: 'error',
        })
    }

    const showAuthRequired = () => {
        toast.add({
            title: 'กรุณาเข้าสู่ระบบ',
            description: 'คุณต้องเข้าสู่ระบบก่อนเพื่อเข้าถึงหน้านี้',
            color: 'error',
            icon: 'i-iconamoon:attention-circle',
        })
    }

    const showRegisterSuccess = () => {
        toast.add({
            title: 'สมัครสมาชิกสำเร็จ',
            description: 'คุณสามารถเข้าสู่ระบบได้ทันที',
            color: 'success',
        })
    }

    const showRegisterError = (description?: string) => {
        toast.add({
            title: 'สมัครสมาชิกไม่สำเร็จ',
            description:
                description || 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง',
            color: 'error',
        })
    }

    const showLogoutSuccess = () => {
        toast.add({
            title: 'ออกจากระบบสำเร็จ',
            description: 'ขอบคุณที่ใช้บริการ SoundDD Shop',
            color: 'success',
            icon: 'i-iconamoon:check-circle-1-light',
        })
    }

    const showLogoutError = (description?: string) => {
        toast.add({
            title: 'เกิดข้อผิดพลาด',
            description: description || 'ไม่สามารถดำเนินการได้ในขณะนี้',
            color: 'error',
        })
    }

    let stopWatch: (() => void) | null = null

    onMounted(() => {
        stopWatch = watch(
            () => route.query.auth,
            (auth) => {
                const message = route.query.message as string | undefined

                if (auth === 'success') {
                    showAuthSuccess()
                } else if (auth === 'error') {
                    showAuthError(message)
                } else if (auth === 'required') {
                    showAuthRequired()
                }

                if (auth) {
                    setTimeout(() => {
                        const query = { ...route.query }
                        delete query.auth
                        delete query.message
                        router.replace({ query })
                    }, 50)
                }
            },
            { immediate: true }
        )
    })

    onUnmounted(() => {
        stopWatch?.()
    })

    return {
        showAuthSuccess,
        showAuthError,
        showAuthRequired,
        showRegisterSuccess,
        showRegisterError,
        showLogoutSuccess,
        showLogoutError,
    }
}
