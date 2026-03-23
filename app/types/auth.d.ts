export interface Register {
    username?: string
    email: string
    password: string
    confirmPassword: string
}
export interface RegisterResponse {
    success: boolean
    user?: {
        id: number
        name: string
        email: string
    }
    error?: string
}

export interface Login {
    email: string
    password: string
    remember?: boolean
}

export interface LoginResponse {
    success: boolean
    user: {
        id: number | string
        name: string
        email: string
        avatar?: string
    }
    error?: string
}
export interface WpJwtResponse {
    token: string
    user_id: number | string
    user_nicename: string
    user_email: string
}
declare module '#auth-utils' {
    interface User {
        id: number | string
        name: string
        email: string
        avatar?: string
    }
    interface SecureSessionData {
        token?: string
        refreshToken?: string
        googleSub?: string
        facebookSub?: string
        provider?: 'google' | 'facebook'
    }
    interface SessionData {
        googlePending?: {
            sub: string
            email: string
            name: string
            picture?: string
        }
        fbPending?: {
            sub: string
            email: string
            name: string
            picture?: string
        }
        loggedInAt?: string
    }
}

export {}
