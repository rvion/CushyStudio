/** by @Vinsi (slightly adapted) */

import type { OutputFor } from '../../local/pony/_prefab_PonyDiffusion'

export const run_advancedPrompt = (ui: OutputFor<typeof ui_advancedPrompt>): string => {
    return ui
        .map((item) => {
            const promptText = item.prompt?.text || ''
            const characterText = item.characters ? ` ${getCharacterText(item.characters)} ` : ''
            const styleText = item.styles ? ` ${getStyleText(item.styles)}` : ''
            return `${promptText}${characterText}${styleText}`
        })
        .join('\n')
}

export const ui_advancedPrompt = () => {
    const form = getCurrentForm()
    return form.list({
        min: 1,
        layout: 'H',
        element: () =>
            form.choice({
                appearance: 'tab',
                items: {
                    prompt: form.promptV2({ default: ' \n' }),
                    characters: form.choice({
                        appearance: 'tab',
                        items: Object.fromEntries(
                            Object.entries(CHARACTER_GROUPS).map(([group, characters]) => [
                                group,

                                form.choice({
                                    appearance: 'tab',
                                    items: Object.fromEntries(characters.map((character) => [character, form.group({})])),
                                }),
                            ]),
                        ),
                    }),
                    styles: form.choice({
                        appearance: 'tab',
                        items: Object.fromEntries(
                            Object.entries(STYLE_GROUPS).map(([group, subgroups]) => [
                                group,

                                form.choice({
                                    appearance: 'tab',
                                    items: Object.fromEntries(
                                        Object.entries(subgroups).map(([subgroup, styles]) => [
                                            subgroup,

                                            form.choice({
                                                appearance: 'tab',
                                                items: Object.fromEntries(styles.map((style) => [style, form.group({})])),
                                            }),
                                        ]),
                                    ),
                                }),
                            ]),
                        ),
                    }),
                },
            }),
    })
}

// Custom function

function camelCaseToReadable(text: string) {
    return text
        .replace(/([A-Z])/g, ' $1') // insert a space before all capital letters
        .replace(/^./, (str) => str.toUpperCase()) // capitalize the first letter
}

function getCharacterText(characters: any) {
    return Object.entries(CHARACTER_GROUPS)
        .filter(([group]) => characters[group])
        .flatMap(([group, groupCharacters]) => groupCharacters.filter((character) => characters[group]?.[character]))
        .join(' ')
}

function getStyleText(styles: any) {
    return Object.entries(STYLE_GROUPS)
        .filter(([group]) => styles[group])
        .flatMap(([group, subgroups]) =>
            Object.entries(subgroups)
                .filter(([subgroup]) => styles[group]?.[subgroup])
                .flatMap(([subgroup, groupStyles]) =>
                    groupStyles
                        .filter((style) => styles[group]?.[subgroup]?.[style])
                        .map((style) => `${style} ${group === 'ArtStyles' ? 'art' : camelCaseToReadable(subgroup)} style,`),
                ),
        )
        .join(', ')
}

// prettier-ignore
export const CHARACTER_GROUPS = {
    Sonic: [ 'Sally Acorn', 'Rouge The Bat', 'Amy Rose', 'Sonic the Hedgehog', 'Shadow the Hedgehog', 'Tails the Fox', 'Doctor Eggman Robotnik'],
    Zelda: [ 'Link', 'Zelda', 'Ganondorf', 'Navi', 'Impa', 'Paya', 'Midna', 'Sheik', 'Tetra', 'Malon', 'Saria', 'Ruto'],
    Mario: [ 'Mario', 'Luigi', 'Princess Peach', 'Daisy', 'Rosalina', 'Bowser', 'Bowsette', 'King Boo', 'Boosette', 'Toad', 'Toadette'],
}

export const STYLE_GROUPS = {
    ShowStyles: {
        Sonic: ['Classic', 'Modern', 'Boom', 'Comic', 'Pixel Art'],
        Zelda: ['Breath of the Wild', 'Twilight Princess', 'Wind Waker', 'Ocarina of Time', "Majora's Mask"],
    },
    ArtStyles: {
        VideoGame: ['Pixel Art', 'Low Poly', 'Cel Shaded', 'Realistic', 'Anime', 'Cartoon', 'Retro', 'Minimalist lineless'],
        Drawing: ['Sketch', 'Line Art', 'Coloring', 'Shading'],
        Painting: [
            'Impressionism',
            'Surrealism',
            'Cubism',
            'Abstract',
            'Expressionism',
            'Pop Art',
            'Dada',
            'Futurism',
            'Art Nouveau',
            'Art Deco',
            'Suprematism',
            'Pointillism',
            'Symbolism',
            'Romanticism',
            'Neoclassicism',
            'Renaissance',
            'Mannerism',
            'Gothic',
        ],
    },
}
