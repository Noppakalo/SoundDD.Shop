export default defineEventHandler(async (event) => {
    try {
        await clearUserSession(event)
        
        const config = useRuntimeConfig()
        deleteCookie(event, config.session?.name || 'auth_SoundDD', {
            path: '/',
        })

        return { success: true }
    } catch (err) {
        throw createError({ statusCode: 500, statusMessage: 'Logout failed' })
    }
})