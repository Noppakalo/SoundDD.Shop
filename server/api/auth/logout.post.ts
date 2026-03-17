export default defineEventHandler(async (event) => {
    try {
        await clearUserSession(event)
        const config = useRuntimeConfig()
        const cookieName = config.session?.name || 'auth_SoundDD'
        
        deleteCookie(event, cookieName, {
            path: '/',
            secure: true,
            httpOnly: true
        })

        return { success: true }
    } catch (err) {
        throw createError({ statusCode: 500, statusMessage: 'Logout failed' })
    }
})