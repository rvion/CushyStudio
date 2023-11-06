export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    maxWait?: number,
): (...funcArgs: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null
    let lastInvokeTime = Date.now()

    return (...args: Parameters<T>): void => {
        const now = Date.now()
        const needInvoke = maxWait !== undefined && now - lastInvokeTime >= maxWait

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        if (needInvoke) {
            func(...args)
            lastInvokeTime = now
        } else {
            timeoutId = setTimeout(() => {
                func(...args)
                lastInvokeTime = Date.now()
            }, delay)
        }
    }
}
