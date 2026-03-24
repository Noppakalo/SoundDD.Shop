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

        if (!end) {
            isFlashSale.value = false
            return
        }

        const now = new Date().getTime()

        const parseToMs = (val: any) => {
            if (!val) return 0
            if (!isNaN(val) && typeof val !== 'object') return parseInt(val)
            const d = new Date(val).getTime()
            return isNaN(d) ? 0 : d
        }

        const startTime = parseToMs(start)
        const endTime = parseToMs(end)

        if (endTime > 0 && now >= startTime && now < endTime) {
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

    const stopTimer = () => {
        if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
        }
    }

    const startTimer = () => {
        if (import.meta.server) return

        stopTimer()
        updateCountdown()

        if (isFlashSale.value) {
            countdownInterval = window.setInterval(updateCountdown, 1000)
        }
    }

    watch(
        [() => toValue(dateFrom), () => toValue(dateTo)],
        () => {
            startTimer()
        },
        { immediate: true }
    )

    onMounted(() => {
        startTimer()
    })

    onUnmounted(() => {
        stopTimer()
    })

    return { timeLeft, isFlashSale }
}
