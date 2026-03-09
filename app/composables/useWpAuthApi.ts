import type { LoginResponse, RegisterResponse } from '~/types/auth'

export const useWpAuthApi = () => {
    const { user, fetch, clear } = useUserSession()
    const authCookie = useCookie('auth_SoundDD')

    const register = async (data: any) => {
        try {
            const response = await $fetch<RegisterResponse>(
                '/api/auth/register',
                {
                    method: 'POST',
                    body: data,
                }
            )
            return { success: true, data: response }
        } catch (error: any) {
            return {
                success: false,
                error: error.data?.statusMessage || 'สมัครสมาชิกไม่สำเร็จ',
                statusCode: error.statusCode,
            }
        }
    }

    const login = async (data: any) => {
        try {
            const response = await $fetch<LoginResponse>('/api/auth/login', {
                method: 'POST',
                body: data,
            })

            await fetch()

            return {
                success: true,
                user: response.user,
            }
        } catch (error: any) {
            return {
                success: false,
                error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            }
        }
    }

    const logout = async () => {
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (e) {}
        authCookie.value = null
        await clear()
        await navigateTo('/', { replace: true })
        try {
            await $fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (e) {}

        authCookie.value = null
        await clear()
        await navigateTo('/', { replace: true })
    }

    return { register, login, logout, user }
}
