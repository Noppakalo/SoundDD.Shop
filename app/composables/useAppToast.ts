export const useAppToast = () => {
    const toast = useToast()

    const success = (title: string, description?: string) => {
        toast.add({
            title,
            description,
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

    return {
        success,
        error,
    }
}
