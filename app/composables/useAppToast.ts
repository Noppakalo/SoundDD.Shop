export const useAppToast = () => {
    const toast = useToast()
    const route = useRoute()
    const { fetch, user } = useUserSession()

    const success = (title: string, description?: string) => {
        toast.add({
            title,
            description:
                description ||
                (user.value?.name
                    ? `ยินดีต้อนรับคุณ ${user.value.name}`
                    : undefined),
            color: 'success',
            icon: 'i-iconamoon:check-circle-1-light',
        })
    }

    const error = (title: string, description?: string) => {
        toast.add({
            title,
            description,
            color: 'error',
            icon: 'i-iconamoon:close-circle-1-light',
        })
    }

    const handleAuthQueries = async () => {
        if (route.query.auth === 'success') {
            await fetch()
            success('เข้าสู่ระบบสำเร็จ')
            navigateTo(
                { query: { ...route.query, auth: undefined } },
                { replace: true }
            )
        }

        if (route.query.auth === 'error') {
            const msg = route.query.message
                ? decodeURIComponent(route.query.message as string)
                : 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            error('เกิดข้อผิดพลาด', msg)
            navigateTo(
                {
                    query: {
                        ...route.query,
                        auth: undefined,
                        message: undefined,
                    },
                },
                { replace: true }
            )
        }
    }

    return {
        success,
        error,
        handleAuthQueries,
    }
}
