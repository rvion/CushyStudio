type StatLine = {
    key: string
    sum: number | string
    avg: number | string
    count: number | string
    min: number | string
    max: number | string
}

class QuickBench {
    entries: { [key: string]: number[] } = {}

    addStats = (key: string, value: number) => {
        if (this.entries[key] == null) this.entries[key] = []
        this.entries[key].push(value)
    }

    health = (val: number, max: number) => {
        if (val > max) return `🔴 ${val.toFixed(2)}`
        if (val > max * 0.5) return `🟠 ${val.toFixed(2)}`
        return val.toFixed(2)
    }

    getStatLine = (key: string): StatLine => {
        const arr = this.entries[key]
        const sum = arr.reduce((a, b) => a + b, 0)
        const avg = sum / arr.length
        const min = Math.min(...arr)
        const max = Math.max(...arr)
        const count = arr.length
        if (key.startsWith('init')) {
            return {
                key,
                sum: this.health(sum, 100),
                count,
                avg: this.health(avg, 2),
                min,
                max,
            }
        }
        return { key, sum, count, avg, min, max }
    }
    printStatLine = (key: string) => {
        const { count, avg, min, max } = this.getStatLine(key)
        console.log(`[📊] ${key} count=${count} avg=${avg}ms | min=${min} | max${max}`)
    }

    printAllStats = () => {
        const stats: StatLine[] = []
        for (const key in this.entries) {
            stats.push(this.getStatLine(key))
        }
        console.table(stats)
    }
}

export const quickBench = new QuickBench()
