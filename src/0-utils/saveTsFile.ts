export const saveTsFile = async (target: string, code: string) => {
    Deno.writeTextFileSync(target, code)
    await new Promise((yes) => setTimeout(yes, 100))
    await Deno.run({ cmd: ['deno', 'fmt', target] }).status()
    await new Promise((yes) => setTimeout(yes, 10))
}
