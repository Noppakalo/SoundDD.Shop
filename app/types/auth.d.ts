export interface Register {
    name?: string
    email: string
    password: string
    confirmPassword?: string
}

export interface RegisterResponse {
    id: number
    username: string
    email: string
    name: string
    slug: string
    roles: string[]
}

export interface WpJwtResponse {
    token: string
    user_email: string
    user_nicename: string
    user_display_name: string
    user_id?: number | string
}

export interface Login {
    email: string
    password: string
}

export interface LoginResponse {
    success: boolean
    user?: {
        name: string
        email: string
        nicename: string
    }
    error?: string
}

declare module '#auth-utils' {
    interface User {
        name: string
        email: string
        nicename: string
        avatar?: string
        nickname?: string
    }
    interface SecureSessionData {
        token: string | null
        provider?: string
    }
    interface SessionData {
        facebookPending?: {
            email: string
            name: string
            picture?: string
            sub: string
        }
    }
}

export {}
