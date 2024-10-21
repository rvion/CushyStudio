export const sum = (nums: Iterable<number>): number => {
    let total = 0
    for (const num of nums) {
        total += num
    }
    return total
}
