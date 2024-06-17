export function braceExpansion(str: string): string[] {
    const matches = str.match(/{([^{}]+)}/)
    if (!matches) return [str]
    const parts = matches[1]!.split(',')
    const result: Set<string> = new Set()
    for (const part of parts) {
        const expanded = braceExpansion(str.replace(matches[0], part))
        expanded.forEach((item) => result.add(item))
    }
    return Array.from(result)
}
// let posit_text2: string = '{man,women} riding, a {horse,{{light,dark}{green,blue},new} motorcycle}'

// console.log(braceExpansion(posit_text2))
