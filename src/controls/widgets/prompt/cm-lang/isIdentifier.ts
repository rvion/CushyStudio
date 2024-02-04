export const isPromptLangIdentifier = (text: string) => {
    return /^$[A-Za-z0-9._\\\/\-]+$/.test(text)
}
