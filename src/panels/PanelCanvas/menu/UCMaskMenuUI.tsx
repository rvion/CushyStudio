import type { Layer$, Mask$, Masks$ } from '../V2/ucV2'

import { observer } from 'mobx-react-lite'

import { ShellInputOnly } from '../../../csuite-cushy/shells/ShellInputOnly'
import { ShellSimpleUI } from '../../../csuite-cushy/shells/ShellSimple'
import { Button } from '../../../csuite/button/Button'
import { Frame } from '../../../csuite/frame/Frame'
import { CachedResizedImage } from '../../../csuite/image/CachedResizedImageUI'
import { InputStringUI } from '../../../csuite/input-string/InputStringUI'

export const UCMaskMenuUI = observer(function UCMaskMenuUI_(p: {
    //
    mask: Mask$['$Field']
    index: number
}) {
    const inputHeight = cushy.preferences.interface.value.inputHeight
    const isVisible: boolean = p.mask.Visible.value
    const imgField = p.mask.Image
    const image = imgField?.value

    // TEMP
    // Do not use interface.value.inputHeight in the future. Have a separate option for layer size?
    const SIZE = 2 // was:3
    const frameSize_ = `${inputHeight * SIZE + 0.5}rem`
    const imageSize_ = `${inputHeight * SIZE}rem`

    const ui = (
        <Frame
            tw={['flex gap-2', 'p-1', 'rounded-md']}
            base={{ contrast: 0.1, chroma: 0.077 }}
            style={{ height: frameSize_ }}
            hover
        >
            <Frame
                base={{ contrast: -0.1 }}
                border={{ contrast: 0.4 }}
                tw='overflow-clip rounded-md'
                style={{ width: imageSize_, minWidth: imageSize_, maxWidth: imageSize_ }}
                // filter: 'drop-shadow(0px 1px 0px black)',
            >
                <img src={image?.url} />
                {/*
                // TODO add back
                <CachedResizedImage
                    draggable={false}
                    onDragStart={() => false}
                    onDrop={() => false}
                    src={image?.url}
                    size={128}
                /> */}
            </Frame>
            {/*  */}
            <div tw='flex w-full flex-col'>
                <div tw={['flex flex-grow gap-2']} style={{ height: `${inputHeight}rem` }}>
                    <p.mask.Name.UI Shell={ShellInputOnly} />
                </div>
                {/* <div tw={['flex flex-grow gap-2']} style={{ height: `${inputHeight}rem` }}></div> */}
                <div tw={['flex flex-grow']} style={{ height: `${inputHeight}rem` }}>
                    <Button //
                        // base={{ hue: 250, chroma: 0.1, contrast: 0.5 }}
                        onClick={() => p.mask.Visible.toggle()}
                        icon='mdiBrush'
                    />

                    {/* <SpacerUI /> */}
                    <Button onClick={() => p.mask.disableSelfWithinParent()} icon={'mdiDelete'} borderless subtle />
                    <Button
                        onClick={() => p.mask.Visible.toggle()}
                        icon={isVisible ? 'mdiEye' : 'mdiEyeClosed'}
                        borderless
                        subtle
                    />
                </div>
            </div>
        </Frame>
    )
    return ui
})
