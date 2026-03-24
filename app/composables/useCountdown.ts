// useCountdown.ts
import {
    ref,
    onMounted,
    onUnmounted,
    watch,
    toValue,
    type MaybeRefOrGetter,
} from 'vue'

export const useCountdown = (
    dateFrom: MaybeRefOrGetter<string | number | Date | undefined | null>,
    dateTo: MaybeRefOrGetter<string | number | Date | undefined | null>
) => {
    const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const isFlashSale = ref(false)
    let countdownInterval: any = null

    const updateCountdown = () => {
        const start = toValue(dateFrom)
        const end = toValue(dateTo)

        // 1. ถ้าไม่มีวันสิ้นสุด ไม่ต้องทำงาน
        if (!end) {
            isFlashSale.value = false
            return
        }

        const now = new Date().getTime()

        // 2. ฟังก์ชันช่วยแปลงค่าให้เป็น Timestamp ที่แม่นยำ
        const parseToMs = (val: any) => {
            if (!val) return 0
            // ถ้าเป็นตัวเลข หรือสตริงตัวเลข (เช่นจาก PHP ที่คูณ 1000 มาแล้ว)
            if (!isNaN(val)) return parseInt(val)
            // ถ้าเป็น ISO String หรือรูปแบบวันที่อื่นๆ
            const d = new Date(val).getTime()
            return isNaN(d) ? 0 : d
        }

        const startTime = parseToMs(start)
        const endTime = parseToMs(end)

        // --- DEBUG: ลองเปิด Console ดูค่าที่คำนวณได้ ---
        // console.log('Now:', now, 'End:', endTime, 'Diff:', endTime - now)

        // 3. เงื่อนไข: ต้องมีวันสิ้นสุด และ (ตอนนี้ยังไม่หมดเวลา)
        // หมายเหตุ: ผมเอา startTime ออกก่อนเพื่อเช็คว่ามันยอมโชว์ไหม
        // ถ้าโชว์แล้วค่อยใส่ (now >= startTime) กลับเข้าไปครับ
        if (endTime > 0 && now < endTime) {
            isFlashSale.value = true
            const diff = endTime - now

            timeLeft.value = {
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor(
                    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                ),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            }
        } else {
            isFlashSale.value = false
            stopTimer()
        }
    }

    const startTimer = () => {
        stopTimer()
        updateCountdown()
        if (isFlashSale.value) {
            countdownInterval = setInterval(updateCountdown, 1000)
        }
    }

    const stopTimer = () => {
        if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
        }
    }

    onMounted(() => startTimer())
    onUnmounted(() => stopTimer())

    watch(
        [() => toValue(dateFrom), () => toValue(dateTo)],
        () => {
            startTimer()
        },
        { immediate: true }
    )

    return { timeLeft, isFlashSale }
}
