import type { Field_string_config } from '../fields/string/FieldString'
import type { IconName } from '../icons/icons'
import type { CSSSizeString } from './CSSSizeString'
import type { CSSProperties, ForwardedRef, ReactElement, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { forwardRef, useEffect, useRef, useState } from 'react'

import { Button } from '../button/Button'
import { extractConfigValue } from '../errors/extractConfig'
import { Frame, type FrameProps } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { InputNumberUI } from '../input-number/InputNumberUI'
import { getLCHFromStringAsString } from '../kolor/getLCHFromStringAsString'
import { Kolor } from '../kolor/Kolor'
import { RevealUI } from '../reveal/RevealUI'
import { knownOKLCHHues } from '../tinyCSS/knownHues'
import { parseFloatNoRoundingErr } from '../utils/parseFloatNoRoundingErr'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

// bird_d: All of this is probably the most disgusting code I've ever written in my life.
type ColorPickerProps = {
   color: Kolor
   onColorChange: (value: Kolor) => void
}

const CANVASSIZE = 200

function quickToHex(value: number): string {
   const next = Math.round(value * 255)
      .toString(16)
      .toUpperCase()
   // Make sure to always return two characters
   return next.length == 1 ? `${next}${next}` : next
}

function hsvToRGB(h: number, s: number, v: number): { r: number; g: number; b: number } {
   const c = v * s // Chroma
   const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
   const m = v - c

   let r = 0,
      g = 0,
      b = 0

   if (s === 0) {
      // If saturation is 0, the color is gray and all RGB components are equal to value
      r = g = b = v
   } else {
      // Normal HSV to RGB conversion when saturation is not 0
      if (h >= 0 && h < 60) {
         r = c
         g = x
         b = 0
      } else if (h >= 60 && h < 120) {
         r = x
         g = c
         b = 0
      } else if (h >= 120 && h < 180) {
         r = 0
         g = c
         b = x
      } else if (h >= 180 && h < 240) {
         r = 0
         g = x
         b = c
      } else if (h >= 240 && h < 300) {
         r = x
         g = 0
         b = c
      } else if (h >= 300 && h < 360) {
         r = c
         g = 0
         b = x
      }
   }

   return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
   }
}

function hslToRGB(h: number, s: number, l: number): { r: number; g: number; b: number } {
   const c = (1 - Math.abs(2 * l - 1)) * s // Chroma
   const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
   const m = l - c / 2

   let r = 0,
      g = 0,
      b = 0

   if (s === 0) {
      // If saturation is 0, the color is gray (all RGB components are equal to lightness)
      r = g = b = l
   } else {
      if (h >= 0 && h < 60) {
         r = c
         g = x
         b = 0
      } else if (h >= 60 && h < 120) {
         r = x
         g = c
         b = 0
      } else if (h >= 120 && h < 180) {
         r = 0
         g = c
         b = x
      } else if (h >= 180 && h < 240) {
         r = 0
         g = x
         b = c
      } else if (h >= 240 && h < 300) {
         r = x
         g = 0
         b = c
      } else if (h >= 300 && h < 360) {
         r = c
         g = 0
         b = x
      }
   }

   return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
   }
}

const ColorCirclePicker: React.FC<ColorPickerProps> = ({ color, onColorChange }) => {
   const hueSatCanvasRef = useRef<HTMLCanvasElement>(null)
   const valueCanvasRef = useRef<HTMLCanvasElement>(null)
   const [mode, setMode] = useState<'rgb' | 'hsv' | 'oklch'>('rgb')
   const [tempHex, setTempHex] = useState<string>('')

   const theme = cushy.preferences.theme.value

   const hsl = color.color.hsl

   useEffect(() => {
      const canvas = hueSatCanvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const radius = canvas.width / 2

      // Draw conic gradient for hues
      const gradientHue = ctx.createConicGradient(90 * (Math.PI / 180), radius, radius)

      function rgbFromHueLightness(hue: number, lightness: number): string {
         const HSL = hslToRGB(hue, 1, lightness)
         return `rgb(${HSL.r}, ${HSL.g}, ${HSL.b})`
      }

      const step = 360 / 6
      const l = hsl[2] / 100
      gradientHue.addColorStop(0, rgbFromHueLightness(0, l))
      gradientHue.addColorStop(1 / 6, rgbFromHueLightness(step, l))
      gradientHue.addColorStop(2 / 6, rgbFromHueLightness(step * 2, l))
      gradientHue.addColorStop(3 / 6, rgbFromHueLightness(step * 3, l))
      gradientHue.addColorStop(4 / 6, rgbFromHueLightness(step * 4, l))
      gradientHue.addColorStop(5 / 6, rgbFromHueLightness(step * 5, l))
      gradientHue.addColorStop(1, rgbFromHueLightness(0, l))

      ctx.fillStyle = gradientHue
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw radial gradient for saturation
      // ctx.globalCompositeOperation = ''

      const gradientSaturation = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius)
      gradientSaturation.addColorStop(0, `rgba(${l * 255}, ${l * 255}, ${l * 255}, 1)`)
      gradientSaturation.addColorStop(1, `rgba(${l * 255}, ${l * 255}, ${l * 255}, 0)`)

      ctx.fillStyle = gradientSaturation
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // ctx.globalCompositeOperation = 'multiply'

      // const l = Math.round((hsl[2] / 100) * 255)
      // ctx.fillStyle = `rgb(${l}, ${l}, ${l})`
      // ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'source-over' // Reset blend mode

      const valueCanvas = valueCanvasRef.current
      if (!valueCanvas) return

      const valueCtx = valueCanvas.getContext('2d')
      if (!valueCtx) return

      const gradientLightness = valueCtx.createLinearGradient(0, 0, 0, CANVASSIZE)
      gradientLightness.addColorStop(0, 'rgba(255, 255, 255, 1)')
      gradientLightness.addColorStop(1, 'rgba(0, 0, 0, 1)')

      valueCtx.fillStyle = gradientLightness
      valueCtx.fillRect(0, 0, valueCanvas.width, valueCanvas.height)

      const asSRGB = color.color.to('srgb')
      setTempHex(`#${quickToHex(asSRGB.r)}${quickToHex(asSRGB.g)}${quickToHex(asSRGB.b)}`)
   }, [color])

   function getCanvasPositionFromHueSaturation(
      hue: number,
      saturation: number,
      radius: number,
   ): { x: number; y: number } {
      const angle = (hue - 90) * (Math.PI / 180) // Convert hue to radians and rotate red to the bottom
      const distance = saturation * radius // Distance from the center

      const x = radius + distance * Math.cos(angle) // Center x + offset
      const y = radius + distance * Math.sin(angle) // Center y + offset

      return { x, y }
   }

   // -180 to adjust for the rotated hue, saturation should be 0-1, so divide by 100 prob not needed. clean later
   const circlePosition = getCanvasPositionFromHueSaturation(hsl[0] - 180, hsl[1] / 100, CANVASSIZE / 2)

   return (
      <Frame col tw='gap-2'>
         <Frame row tw='gap-2'>
            <Frame
               tw='relative gap-2 rounded-full !bg-transparent'
               row
               border={{ contrast: 0.25 }}
               dropShadow={theme.global.shadow}
            >
               <div
                  // Hue/Saturation indicator
                  tw='pointer-events-none absolute rounded-full'
                  style={{
                     border: '1px solid grey',
                     top: `${circlePosition.y}px`,
                     left: `${circlePosition.x}px`,
                     transform: 'translateX(-50%) translateY(-50%)',
                  }}
               >
                  <div
                     // Hue/Saturation indicator
                     tw='h-5 w-5 rounded-full'
                     style={{
                        border: '1px solid white',
                        background: color.toOKLCH(),
                     }}
                  />
               </div>
               <canvas
                  ref={hueSatCanvasRef}
                  width={CANVASSIZE}
                  height={CANVASSIZE}
                  style={{
                     borderRadius: '50%',
                     cursor: cushy.preferences.interface.value.useDefaultCursorEverywhere
                        ? 'default'
                        : 'pointer',
                  }}
                  onClick={(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
                     const canvas = hueSatCanvasRef.current
                     if (!canvas) return

                     const rect = canvas.getBoundingClientRect()
                     const x = e.clientX - rect.left
                     const y = e.clientY - rect.top

                     const radius = canvas.width / 2
                     const centerX = radius
                     const centerY = radius

                     // Calculate relative position
                     const dx = x - centerX
                     const dy = y - centerY
                     const distance = Math.sqrt(dx * dx + dy * dy)

                     // Saturation is the distance from the center normalized to the radius
                     const saturation = Math.min(1, distance / radius)

                     // Hue is the angle from the center (in degrees, 0–360)
                     let hue = Math.atan2(dy, dx) * (180 / Math.PI)

                     // Adjust 90 degrees (Probably arbitrary, but I'm literally just copying how blender "looks", their code is probably cleaner cause they actually know math there LMAO)
                     hue = (hue - 90) % 360
                     if (hue < 0) hue += 360

                     const lightness = hsl[2]
                     if (!lightness) {
                        return
                     }

                     const adjustedRgb = hslToRGB(hue, saturation, lightness / 100)
                     onColorChange(
                        Kolor.fromString(`rgb(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b})`),
                     )

                     // onColorChange(`rgb(${r}, ${g}, ${b})`)
                  }}
               />
            </Frame>
            <canvas ref={valueCanvasRef} width={'20px'} height={CANVASSIZE} />
         </Frame>
         {/* <Frame align col>
            <InputNumberUI
               text='hue'
               mode='int'
               min={0}
               step={10}
               value={Math.round(hsl[0])}
               onValueChange={(val) => {
                  console.log('[FD] Hue: ', val)
                  const adjustedRgb = hslToRGB(val, hsl[1] / 100, hsl[2] / 100)
                  onColorChange(Kolor.fromString(`rgb(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b})`))
               }}
            />
            <InputNumberUI
               text='saturation'
               mode='float'
               min={0}
               max={1}
               step={0.1}
               value={parseFloatNoRoundingErr(hsl[1] / 100)}
               onValueChange={(val) => {
                  console.log('[FD] Saturation: ', val)
                  const adjustedRgb = hslToRGB(hsl[0], hsl[1] / 100, hsl[2] / 100)
                  onColorChange(Kolor.fromString(`rgb(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b})`))
               }}
            />
            <InputNumberUI
               text='lightness'
               mode='float'
               min={0}
               max={0}
               step={0.1}
               value={parseFloatNoRoundingErr(hsl[2] / 100)}
               onValueChange={(val) => {
                  console.log('[FD] VALUE: ', val)
                  const adjustedRgb = hslToRGB(hsl[0], hsl[1] / 100, val)
                  onColorChange(Kolor.fromString(`rgb(${adjustedRgb.r}, ${adjustedRgb.g}, ${adjustedRgb.b})`))
               }}
            />
         </Frame> */}
         <InputStringUI
            buffered={{
               getTemporaryValue: () => {
                  return tempHex
               },
               setTemporaryValue: (val) => {
                  if (!val) {
                     return
                  }
                  setTempHex(val)
               },
            }}
            onFocus={() => {
               const asSRGB = color.color.to('srgb')
               setTempHex(`#${quickToHex(asSRGB.r)}${quickToHex(asSRGB.g)}${quickToHex(asSRGB.b)}`)
            }}
            onKeyDown={(ev) => {
               if (ev.key == 'Escape') {
                  ev.preventDefault()
                  ev.stopPropagation()
                  return
               }

               if (ev.key != 'Enter') {
                  return
               }

               ev.preventDefault()
               ev.stopPropagation()

               ev.currentTarget.blur()
            }}
            getValue={() => {
               const asSRGB = color.color.to('srgb')

               return `#${quickToHex(asSRGB.r)}${quickToHex(asSRGB.g)}${quickToHex(asSRGB.b)}`
            }}
            setValue={(value) => {
               console.log('[FD] HEX: ', value)
               const col = Kolor.fromString(value, true)
               const asSRGB = col.color.to('srgb')

               console.log('[FD] col: ', col)

               setTempHex(`#${quickToHex(asSRGB.r)}${quickToHex(asSRGB.g)}${quickToHex(asSRGB.b)}`)

               onColorChange(col)
            }}
         />
      </Frame>
   )
}

export type InputStringProps = {
   /** when true => 'mdiText' */
   icon?: IconName // | boolean | null | undefined

   /** When there is text it will show a button at the end that when clicked will remove the text */
   clearable?: boolean

   disabled?: boolean

   /** when true, input will match the size of its content */
   autoResize?: boolean
   /** only taken into account when autoResize is true */
   autoResizeMaxWidth?: CSSSizeString

   // get / set value
   getValue: () => string
   setValue: (value: string) => void

   // get / set buffered value
   buffered?: Maybe<{
      getTemporaryValue: () => string | null
      setTemporaryValue: (value: string | null) => void
   }>

   /** default to text */
   type?: Field_string_config['inputType']

   /** text pattern */
   pattern?: Field_string_config['pattern']

   autoFocus?: boolean

   /** input placeholder */
   placeholder?: string

   // slots ---------------------
   slotBeforeInput?: ReactNode

   // styling -------------------
   // styling > frame:

   /** className added on the Frame enclosing the input */
   className?: string
   /** style added on the frame enclosing the input */
   style?: CSSProperties

   // styling > input
   /** className added on the input itself */
   inputClassName?: string
   /** style added on the input itself */
   inputStyle?: CSSProperties

   onBlur?: (ev: React.FocusEvent<HTMLInputElement, Element>) => void
   onFocus?: (ev: React.FocusEvent<HTMLInputElement, Element>) => void
   onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement>) => void
   noColorStuff?: boolean
} & {
   // 💬 2024-09-30 rvion:
   // Temporarilly, let's just accept the two we use manually,
   // and improve that later.
   //
   //> & FrameProps 🔴 will hhave to take all those props properly into account if we want to add taht here
   roundness?: FrameProps['roundness']
   dropShadow?: FrameProps['dropShadow']
}
export const InputStringUI = observer(
   forwardRef(function WidgetStringUI_(p: InputStringProps, ref: ForwardedRef<HTMLInputElement>) {
      // getValue is mandatory, but it may avoid crash to be permissive about it's absense
      // let's rely on typescript to catch this
      const value = p.getValue?.() ?? ''

      const isBuffered = Boolean(p.buffered)
      const temporaryValue = p.buffered?.getTemporaryValue?.()
      const isDirty = isBuffered && temporaryValue != null && temporaryValue !== value
      const autoResize = p.autoResize
      const inputClassNameWhenAutosize = autoResize
         ? 'absolute top-0 left-0 right-0 opacity-10 focus:opacity-100 z-50'
         : null
      const [reveal, setReveal] = useState(false)
      let inputTailwind: string | ClassLike[] | undefined
      let visualHelper: ReactElement<any, any> | undefined

      const theme = cushy.preferences.theme.value
      const interfacePref = cushy.preferences.interface.value

      switch (p.type) {
         case 'color':
            inputTailwind = 'w-full h-full !bg-transparent opacity-0 !p-0'
            visualHelper = (
               <Frame //
                  tw='UI-Color absolute left-0 flex h-full w-full items-center whitespace-nowrap pl-2 font-mono text-[0.6rem]'
                  base={value ? value : undefined}
                  text={{ contrast: 1 }}
               >
                  {interfacePref.widget.color.showText && getLCHFromStringAsString(value)}
               </Frame>
            )

            return (
               <RevealUI
                  placement='above-no-min-no-max-size'
                  content={() => {
                     const color = Kolor.fromString(p.getValue())

                     return (
                        <div tw='p-2'>
                           <ColorCirclePicker
                              color={color}
                              onColorChange={(value: Kolor) => {
                                 const next = `${value.toOKLCH()}`
                                 console.log('[FD] NEXT: ', next)
                                 p.setValue(next)
                              }}
                           />
                        </div>
                     )
                  }}
               >
                  <Frame
                     noColorStuff={p.noColorStuff}
                     className={p.className}
                     style={p.style}
                     base={theme.global.contrast}
                     text={{ contrast: 1, chromaBlend: 1 }}
                     hover={3}
                     // dropShadow={dropShadow}
                     roundness={theme.global.roundness}
                     role='textbox'
                     border={
                        isDirty //
                           ? { contrast: 0.3, hue: knownOKLCHHues.warning, chroma: 0.2 }
                           : theme.global.border
                     }
                     tw={[
                        //
                        p.icon && !p.clearable ? 'pr-1' : 'px-0',
                        'UI-InputString h-input relative flex items-center overflow-clip text-sm',
                     ]}
                  >
                     {visualHelper}
                  </Frame>
               </RevealUI>
            )
            break
         default:
            inputTailwind = 'w-full h-full !outline-none bg-transparent px-2'
            break
      }
      const input = (
         <input
            ref={ref}
            size={autoResize ? 1 : undefined}
            className={p.inputClassName}
            style={{ fontSize: `${theme.global.text.size}pt`, ...p.inputStyle }}
            tw={[inputClassNameWhenAutosize, inputTailwind]}
            type={reveal ? 'text' : p.type}
            pattern={extractConfigValue(p.pattern)?.toString()}
            placeholder={p.placeholder}
            autoFocus={p.autoFocus}
            disabled={p.disabled}
            value={p.buffered ? (temporaryValue ?? value) : value}
            onChange={(ev) => {
               if (p.buffered) p.buffered.setTemporaryValue(ev.target.value)
               else p.setValue(ev.currentTarget.value)
            }}
            /* Prevents drag n drop of selected text, so selecting is easier. */
            onDragStart={(ev) => ev.preventDefault()}
            onFocus={(ev) => {
               p.buffered?.setTemporaryValue(p.getValue() ?? '')
               // ev.currentTarget.select()
               p.onFocus?.(ev)
            }}
            onBlur={(ev) => {
               // need to be deferenced here because of how it's called in
               // the onKeyDown handler a few lines below
               const tempValue = p.buffered?.getTemporaryValue?.()
               if (tempValue != null) p.setValue(tempValue)
               p.onBlur?.(ev)
            }}
            onKeyDown={(ev) => {
               // 🔴 Prevents users from submitting the form when pressing enter (required by monoloco)
               // ⏸️ if (ev.key === 'Enter') {
               // ⏸️    ev.currentTarget.blur()
               // ⏸️ } else
               if (ev.key === 'Escape') {
                  if (!p.buffered && temporaryValue) p.setValue(temporaryValue)
                  p.buffered?.setTemporaryValue(null)
                  ev.currentTarget.blur()
               }
               p.onKeyDown?.(ev)
            }}
         />
      )
      const dropShadow = p.dropShadow ?? theme.global.shadow
      return (
         <Frame
            noColorStuff={p.noColorStuff}
            className={p.className}
            style={p.style}
            base={theme.global.contrast}
            text={{ contrast: 1, chromaBlend: 1 }}
            hover={3}
            dropShadow={dropShadow}
            roundness={theme.global.roundness}
            role='textbox'
            border={
               isDirty //
                  ? { contrast: 0.3, hue: knownOKLCHHues.warning, chroma: 0.2 }
                  : theme.global.border
            }
            tw={[
               //
               p.icon && !p.clearable ? 'pr-1' : 'px-0',
               'UI-InputString h-input relative flex items-center overflow-clip text-sm',
            ]}
            onMouseDown={(ev) => {
               if (ev.button == 1) {
                  const textInput = ev.currentTarget.querySelector('input[type="text"') as HTMLInputElement
                  textInput.focus()
               }
            }}
         >
            {visualHelper}
            {p.icon != null && (
               <IkonOf //
                  tw='mx-1 flex-none'
                  size='1.2rem'
                  name={typeof p.icon === 'string' ? p.icon : 'mdiText'}
               />
            )}
            {p.slotBeforeInput}
            {autoResize ? (
               <div className='minh-input relative'>
                  {input}
                  <span
                     style={{ maxWidth: p.autoResizeMaxWidth }}
                     tw='minh-input lh-input select-none whitespace-nowrap whitespace-pre px-1'
                  >
                     {p.getValue() ? p.getValue() : <span tw='opacity-30'>{p.placeholder || ' '}</span>}
                  </span>
               </div>
            ) : (
               input
            )}
            {p.type === 'password' && (
               <Button
                  subtle
                  borderless
                  icon={reveal ? 'mdiEyeOff' : 'mdiEye'}
                  onClick={() => setReveal(!reveal)}
                  tw='mx-1 cursor-pointer'
                  square
               />
            )}
            {value != '' && p.clearable && (
               <Button //
                  roundness={0}
                  subtle
                  borderless
                  icon={'_clear'}
                  onClick={() => p.setValue('')}
               />
            )}
         </Frame>
      )
   }),
)

// 1-a 2-a
// 1-b 2-a

// behaviours
// 1. updateValueOn:
//      - a keystroke
//      - b enter
// 2. onEscape or tab or click away:
//      - a revert to last committed value
//      - b do nothing
