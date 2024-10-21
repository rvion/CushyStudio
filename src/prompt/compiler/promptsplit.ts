export function generatePromptCombinations(prompt: string): string[] {
    // First, expand braces to generate all combinations of the parts inside braces
    let combinations = expandBraces(prompt)
    // Finally, replace words between < and > with a random word from the list
    combinations = combinations.map(replaceWithRandomWord)

    // Then, for each combination, expand brackets
    combinations = combinations.map(expandBracket).flat()

    // Finally, replace words between < and > with a random word from the list
    combinations = combinations.map(replaceWithRandomWord)

    return combinations
}

export const expandBraces = (prompt: string): string[] => {
    const prompts = prompt.split(/(?<!\\)\|/).map((item) => item.trim().replace(/\\\|/g, '|'))
    const combinations: Set<string> = new Set()

    const generateCombinations = (list: string[], prefix: string = ''): void => {
        for (const item of list) {
            const newPrefix = prefix ? `${prefix}, ${item}` : item
            combinations.add(newPrefix)
            generateCombinations(list.slice(list.indexOf(item) + 1), newPrefix)
        }
    }

    const firstPrompt = prompts.shift()
    if (firstPrompt) {
        combinations.add(firstPrompt)
        generateCombinations(prompts, firstPrompt)
    }

    return Array.from(combinations).map(expandNestedBraces).flat()
}

function expandBracket(input: string): string {
    return input.replace(
        /(, )?\s*([^,[]+)\s*\[([^\]]+)\]\s*(, )?/g,
        (_, leadingComma = '', prefix, content, trailingComma = '') => {
            // Split the content by commas not preceded by a backslash
            const words = content.split(/(?<!\\),/).map((s: any) => s.trim().replace(/\\,/g, ','))
            return leadingComma + words.map((s: string) => `${prefix.trim()} ${s}`).join(', ') + trailingComma
        },
    )
}

const expandNestedBraces = (combination: string): string[] => {
    const matches = combination.match(/(?<!\\\/){([^{}]+)}/)
    if (!matches) {
        return [combination]
    } else {
        const parts = matches[1]!.split(/(?<!\\),/).map((part) => part.replace(/\\,/g, ','))
        const result: Set<string> = new Set()
        for (const part of parts) {
            const expanded = expandBraces(combination.replace(matches[0], part))
            expanded.forEach((item) => result.add(item))
        }
        return Array.from(result)
    }
}

/**
 * Replaces words between < and > with a random word from the list.
 * @param {string} input - The string to replace words in.
 * @returns {string} The input string with words replaced.
 */
function replaceWithRandomWord(input: string): string {
    const regex = /<([^<>]+)>/g
    let match
    while ((match = regex.exec(input)) !== null) {
        let replacement = match[1]!
        // Check for nested replacements
        if (/<([^<>]+)>/.test(replacement)) {
            replacement = replaceWithRandomWord(replacement)
        }
        // Expand brackets before splitting the options
        replacement = expandBracket(replacement)
        // Split by comma not preceded by backslash
        const options = replacement.split(/(?<!\\),/).map((s) => s.trim().replace(/\\,/g, ','))
        const randomIndex = Math.floor(Math.random() * options.length)
        // Replace the placeholder with the random option
        input = input.slice(0, match.index) + options[randomIndex] + input.slice(match.index + match[0].length)
        // Reset the regex index
        regex.lastIndex = 0
    }
    return input
}
