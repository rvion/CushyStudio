import { cva, type VariantProps } from 'class-variance-authority'

import { exhaust } from '../../utils/exhaust'

export const appearanceCVA = cva([], {
   // 🔶 todo: full playground
   // 🔶 todo: higher level intent api
   // 🔶 todo: lower level api spec (ltext, lbg, lborder)? or is it just tailwind?
   variants: {
      dominant: {
         //
         success: ['text-lsuite-success'],
         warning: ['text-lsuite-warning'],
         error: ['text-lsuite-error'],
         primary: ['text-lsuite-primary'],
         dark: ['text-lsuite-dark'],
         gray: ['text-lsuite-gray'],
         white: ['text-lsuite-white'],
         grayLight: ['text-gray-500'],
         light: ['text-lsuite-light'],
      },
      inverted: {
         true: ['text-lsuite-white'],
         colored: ['text-lsuite-white'], // currently equivalent to true
         light: ['bg-gray-100'], // more like a "background" props than "inverted"
         white: ['bg-lsuite-white'], // more like a "background" props than "inverted"
      },
      bordered: {
         true: ['border-gray-300'],
         light: ['border-gray-100'],
         colored: [''],
         false: ['border-transparent'],
         default: [''],
         none: ['border-none'],
      },
      hoverable: {
         true: [''],
         error: ['hover:text-lsuite-error'], // set via compound to have enough priority
         false: [],
      },
      typography: {
         title: ['font-xl font-bold'],
         subtitle: ['font-lg font-bold'],
         bold: ['font-bold'],
         semibold: ['font-semibold'],
         medium: ['font-medium'],

         body: [''],
         thin: ['font-thin'],
      },
      // LATER
      // 🔶 todo: maintain state for real via events
      // is it equivalent to "pressed"? "focus"?
      active: {
         true: ['rounded border border-black'],
         false: [],
      },
      disabled: {
         // in addition/identical look to standard disabled:
         true: ['cursor-not-allowed border-opacity-20 bg-opacity-30'],
         false: [],
      },
   },
   compoundVariants: [
      // INVERTED STUFF
      { inverted: [true], dominant: ['success'], className: ['bg-lsuite-success'] },
      { inverted: [true], dominant: ['warning'], className: ['bg-lsuite-warning'] },
      { inverted: [true], dominant: ['error'], className: ['bg-lsuite-error'] },
      { inverted: [true], dominant: ['primary'], className: ['bg-lsuite-primary'] },
      { inverted: [true], dominant: ['dark'], className: ['bg-lsuite-dark'] },
      { inverted: [true], dominant: ['gray'], className: ['bg-lsuite-gray'] },
      { inverted: [true], dominant: ['grayLight'], className: ['bg-gray-500'] },
      { inverted: [true], dominant: ['white'], className: ['bg-lsuite-white text-lsuite-dark'] },

      // BORDERED STUFF
      { bordered: ['colored', 'light', true], className: ['rounded border p-1'] },
      // { bordered: [false], className: ['border'] },
      { bordered: ['colored'], dominant: ['success'], className: ['border-lsuite-success'] },
      { bordered: ['colored'], dominant: ['warning'], className: ['border-lsuite-warning'] },
      { bordered: ['colored'], dominant: ['error'], className: ['border-lsuite-error'] },
      { bordered: ['colored'], dominant: ['primary'], className: ['border-lsuite-primary'] },
      { bordered: ['colored'], dominant: ['dark'], className: ['border-lsuite-dark'] },
      { bordered: ['colored'], dominant: ['gray'], className: ['border-lsuite-gray'] },

      // HOVERABLE STUFF
      {
         hoverable: [true],
         disabled: [false],
         inverted: [false],
         className: ['hover:bg-gray-100 focus:bg-gray-100'],
      },
      {
         hoverable: ['error'],
         disabled: [false],
         inverted: [false],
         className: ['hover:border-lsuite-error hover:bg-red-50 focus:bg-red-100'],
      },
      {
         hoverable: [true],
         disabled: [false],
         inverted: [false],
         active: [true],
         className: ['bg-gray-200 hover:bg-gray-200'],
      },
      { hoverable: [true], disabled: [false], inverted: [true], className: ['hover:border-opacity-80 hover:bg-opacity-80'] }, // prettier-ignore
      // DISABLED STUFF
      { disabled: [true], inverted: [false], className: ['text-lsuite-light'] },
   ],
   defaultVariants: {
      typography: 'body',
      bordered: 'default',
      inverted: false,
      hoverable: false,
      active: false,
      disabled: false,
   },
})

export type DovAppearanceProps = VariantProps<typeof appearanceCVA>

export type DovLook = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'error-hover' // | 'subtle'

// 🔶 WIP, to be defined properly
export const lookToProps = (look: Maybe<DovLook>): DovAppearanceProps => {
   if (look == null) return {}
   if (look === 'primary') return { dominant: 'primary', inverted: true, bordered: 'colored' }
   if (look === 'secondary') return { dominant: 'grayLight', bordered: true, typography: 'medium' }
   if (look === 'success') return { dominant: 'success', inverted: true, bordered: 'colored' }
   if (look === 'warning') return { dominant: 'warning', bordered: 'colored' }
   if (look === 'error') return { dominant: 'error', bordered: 'colored' }
   if (look === 'error-hover') return { dominant: 'grayLight', typography: 'body', bordered: true, hoverable: 'error' } // prettier-ignore
   exhaust(look)
}

export type DovSize = 'widget' | 'input' | 'inside'
