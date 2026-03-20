export const processingQueue = new Map<
    string,
    { email: string; password: string; name: string; timestamp: number }
>()

export const completedJobs = new Map<
    string,
    { success: boolean; data?: any; error?: string }
>()
