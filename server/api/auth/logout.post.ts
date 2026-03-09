export default defineEventHandler(async (event) => {
    try {
        await clearUserSession(event)

        const config = useRuntimeConfig()
        const sessionCfg: any = config.session || {}
        const cookieCfg: any = sessionCfg.cookie || {}
        const cookieName: string = sessionCfg.name || 'auth_SoundDD'

        const host =
            (event.node.req.headers.host || '').split(':')[0] || undefined

        setCookie(event, cookieName, '', {
            path: cookieCfg.path || '/',
            httpOnly: true,
            sameSite: cookieCfg.sameSite ?? 'lax',
            secure: cookieCfg.secure ?? process.env.NODE_ENV === 'production',
            maxAge: 0,
            domain: host,
        })

        return { success: true }
    } catch (err) {
        throw createError({ statusCode: 500, statusMessage: 'Logout failed' })
    }
})
