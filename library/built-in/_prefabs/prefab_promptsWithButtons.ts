/** by @Vinsi (slightly adapted) */

import type { SchemaDict } from '../../../src/csuite/model/SchemaDict'
import type { OutputFor } from './_prefabs'

// 📝 2024-06-14 rvion: explicitly adding types is optional;
// I tend to prefer adding them in built-in prefabs to help
// with codebase typechecking performances, and making breaking
// changes more explicit.
export type UI_advancedPrompt = Z.List<
   Z.Choice<{
      prompt: Z.Prompt
      characters: Z.Choice<{
         [k: string]: Z.Choice<{
            [k: string]: Z.Group<SchemaDict>
         }>
      }>
      styles: Z.Choice<{
         [k: string]: Z.Choice<{
            [k: string]: Z.Choice<{
               [k: string]: Z.Group<SchemaDict>
            }>
         }>
      }>
   }>
>

export function ui_advancedPrompt(): UI_advancedPrompt {
   const form = getBuilder()
   return form.list({
      min: 1,
      layout: 'H',
      icon: IKONS.mdiBookAlphabet,
      element: () =>
         form.choice(
            {
               prompt: form.prompt({ default: ' \n' }),
               characters: form.choice(
                  Object.fromEntries(
                     Object.entries(CHARACTER_GROUPS).map(([group, characters]) => [
                        group,
                        form.choice(
                           Object.fromEntries(characters.map((character) => [character, form.group({})])),
                           {
                              appearance: 'tab',
                           },
                        ),
                     ]),
                  ),
                  {
                     appearance: 'tab',
                  },
               ),
               styles: form.choice(
                  Object.fromEntries(
                     Object.entries(STYLE_GROUPS).map(([group, subgroups]) => [
                        group,
                        form.choice(
                           Object.fromEntries(
                              Object.entries(subgroups).map(([subgroup, styles]) => [
                                 subgroup,

                                 form.choice(
                                    Object.fromEntries(styles.map((style) => [style, form.group({})])),
                                    {
                                       appearance: 'tab',
                                    },
                                 ),
                              ]),
                           ),
                           { appearance: 'tab' },
                        ),
                     ]),
                  ),
                  { appearance: 'tab' },
               ),
            },
            { appearance: 'tab' },
         ),
   })
}

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

// Custom function

function camelCaseToReadable(text: string): string {
   return text
      .replace(/([A-Z])/g, ' $1') // insert a space before all capital letters
      .replace(/^./, (str) => str.toUpperCase()) // capitalize the first letter
}

function getCharacterText(characters: any): string {
   return Object.entries(CHARACTER_GROUPS)
      .filter(([group]) => characters[group])
      .flatMap(([group, groupCharacters]) =>
         groupCharacters.filter((character) => characters[group]?.[character]),
      )
      .join(' ')
}

function getStyleText(styles: any): string {
   return Object.entries(STYLE_GROUPS)
      .filter(([group]) => styles[group])
      .flatMap(([group, subgroups]) =>
         Object.entries(subgroups)
            .filter(([subgroup]) => styles[group]?.[subgroup])
            .flatMap(([subgroup, groupStyles]) =>
               groupStyles
                  .filter((style) => styles[group]?.[subgroup]?.[style])
                  .map(
                     (style) =>
                        `${style} ${group === 'ArtStyles' ? 'art' : camelCaseToReadable(subgroup)} style,`,
                  ),
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
      VideoGame: [
         'Pixel Art',
         'Low Poly',
         'Cel Shaded',
         'Realistic',
         'Anime',
         'Cartoon',
         'Retro',
         'Minimalist lineless',
      ],
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
