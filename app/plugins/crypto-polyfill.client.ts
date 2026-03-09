export default defineNuxtPlugin(() => {
    if (process.client) {
        // เช็คว่ามี crypto หรือไม่ ถ้าไม่มีให้สร้าง object เปล่ารอไว้
        if (!globalThis.crypto) {
            // @ts-ignore
            globalThis.crypto = {}
        }

        // ถ้าไม่มี randomUUID (เพราะไม่ได้รันผ่าน HTTPS) ให้สร้างฟังก์ชันจำลองขึ้นมา
        if (!globalThis.crypto.randomUUID) {
            globalThis.crypto.randomUUID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                    (c) => {
                        const r = (Math.random() * 16) | 0
                        const v = c === 'x' ? r : (r & 0x3) | 0x8
                        return v.toString(16)
                    }
                ) as `${string}-${string}-${string}-${string}-${string}`
            }

            console.warn(
                'Crypto Polyfill: randomUUID has been generated manually (Insecure Context)'
            )
        }
    }
})
