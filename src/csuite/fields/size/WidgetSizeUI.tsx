import type { ResolutionState } from './ResolutionState'
import type { Widget_size } from './WidgetSize'
import type { AspectRatio, ModelType } from './WidgetSizeTypes'

import { observer } from 'mobx-react-lite'

import { InputBoolToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WigetSize_LineUI = observer(function WigetSize_LineUI_(p: { widget: Widget_size }) {
    return <WidgetSizeX_LineUI sizeHelper={p.widget.sizeHelper} bounds={p.widget.config} />
})

export const WigetSize_BlockUI = observer(function WigetSize_BlockUI_(p: { widget: Widget_size }) {
    return <WigetSizeXUI sizeHelper={p.widget.sizeHelper} bounds={p.widget.config} />
})

export const WidgetSizeX_LineUI = observer(function WidgetSize_LineUI_(p: {
    sizeHelper: ResolutionState
    bounds?: { min?: number; max?: number; step?: number }
}) {
    const uist = p.sizeHelper

    const modelBtn = (model: ModelType) => (
        <InputBoolToggleButtonUI //
            tw='w-input'
            value={uist.desiredModelType == model}
            onValueChange={() => uist.setModelType(model)}
            text={model}
        />
    )

    // const ratio = uist.width / uist.height
    // const ratioIcon = ratio == 1.0 ? 'mdiApproximatelyEqual' : ratio > 1.0 ? 'mdiCropLandscape' : 'mdiCropPortrait'

    return (
        <div className='flex flex-1 flex-col gap-0.5'>
            <Frame //Joined container
                border={{ contrast: 0.05 }}
                tw={['h-input w-full h-full flex gap-2 items-center overflow-clip']}
                style={{ padding: '0px' }}
            >
                <div tw='flex'>
                    {modelBtn('1.5')}
                    {modelBtn('xl')}
                </div>
                <InputNumberUI
                    //
                    min={p.bounds?.min ?? 128}
                    max={p.bounds?.max ?? 4096}
                    step={p.bounds?.step ?? 32}
                    mode='int'
                    value={uist.width}
                    hideSlider
                    onValueChange={(next) => uist.setWidth(next)}
                    forceSnap={true}
                    text='Width'
                    suffix='px'
                />
                <div tw='h-full' style={{ width: '1px' }} />
                <InputNumberUI
                    //
                    min={p.bounds?.min ?? 128}
                    max={p.bounds?.max ?? 4096}
                    step={p.bounds?.step ?? 32}
                    hideSlider
                    mode='int'
                    value={uist.height}
                    onValueChange={(next) => uist.setHeight(next)}
                    forceSnap={true}
                    text='Height'
                    suffix='px'
                />
                {/* <Button onClick={uist.flip} icon={ratioIcon} style={{ border: 'none', borderRadius: '0px' }} /> */}
                <div tw='h-full' style={{ width: '1px' }} />
                <AspectRatioSquareUI sizeHelper={uist} />
                <div tw='h-full' style={{ width: '1px' }} />
                <AspectLockButtonUI sizeHelper={uist} />
            </Frame>
        </div>
    )
})

export const AspectLockButtonUI = observer(function AspectLockButtonUI_(p: { sizeHelper: ResolutionState }) {
    const uist = p.sizeHelper
    return (
        <Frame // Aspect Lock button
            active={uist.isAspectRatioLocked}
            style={{ border: 'unset', borderRadius: '0px' }}
            icon={uist.isAspectRatioLocked ? 'mdiLink' : 'mdiLinkOff'}
            onMouseDown={(ev) => {
                uist.isAspectRatioLocked = !uist.isAspectRatioLocked
                if (!uist.isAspectRatioLocked) return
                // Need to snap value if linked
                if (uist.wasHeightAdjustedLast) uist.setHeight(uist.height)
                else uist.setWidth(uist.width)
            }}
        />
    )
})

export const AspectRatioSquareUI = observer(function AspectRatioSquareUI_(p: { sizeHelper: ResolutionState }) {
    const uist = p.sizeHelper
    const ratioDisplaySize = 26
    return (
        <Frame // Aspect ratio display background
            square
            size='xs'
            border={10}
            tw={['flex', 'overflow-clip', 'items-center justify-center', 'cursor-pointer']}
            style={{ borderRadius: '0px' }}
            onClick={uist.flip}
            hover
        >
            <Frame
                base={10}
                tw='!relative w-full h-full'
                style={{
                    //
                    width: '100%',
                    height: '100%',
                    borderRadius: '0px',
                    // Use transform here because it works with floats and will not cause popping/mis-alignments.
                    transform: `
                 scaleX(${uist.width < uist.height ? Math.round((uist.width / uist.height) * ratioDisplaySize) / ratioDisplaySize : '1'})
                 scaleY(${uist.height < uist.width ? Math.round((uist.height / uist.width) * ratioDisplaySize) / ratioDisplaySize : '1'})`,
                }}
                // icon='mdiCheckboxBlank'
                square
            />
        </Frame>
    )
})

export const WigetSizeXUI = observer(function WigetSizeXUI_(p: {
    // size: SizeAble
    sizeHelper: ResolutionState
    bounds?: { min?: number; max?: number; step?: number }
}) {
    const uist = p.sizeHelper
    // if (!uist.isAspectRatioLocked) return null
    const resoBtn = (ar: AspectRatio) => (
        <InputBoolUI //
            display='button'
            value={uist.desiredAspectRatio == ar}
            onValueChange={() => uist.setAspectRatio(ar)}
            text={ar}
        />
    )

    const portrait = uist.height / uist.width > 1.0

    return (
        <Frame
        // border={{ contrast: uist.isAspectRatioLocked ? 0.0 : -0.05 }}
        // base={{ contrast: uist.isAspectRatioLocked ? 0.0 : -0.05 }}
        >
            <div tw='flex'>
                {/* <div tw='btn btn-xs' onClick={() => uist.flip()}> */}
                {/* <span className='material-symbols-outlined'>rotate_right</span> */}
                {/* </div> */}
                <div tw='ml-auto flex flex-wrap items-center gap-1.5'>
                    <div tw='join'>{resoBtn('1:1')}</div>
                    {/* <div>|</div> */}
                    <div tw='join flex flex-col'>
                        {resoBtn('16:9')}
                        {resoBtn('9:16')}
                    </div>
                    {/* <div>|</div> */}
                    <div tw='join flex flex-col'>
                        {resoBtn('4:3')}
                        {resoBtn('3:4')}
                    </div>
                    {/* <div>|</div> */}
                    <div tw='join flex flex-col'>
                        {resoBtn('3:2')}
                        {resoBtn('2:3')}
                    </div>
                    {p.sizeHelper.desiredModelType === 'xl' && (
                        <>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('16:15')}
                                {resoBtn('15:16')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('17:15')}
                                {resoBtn('15:17')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('9:7')}
                                {resoBtn('7:9')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('18:13')}
                                {resoBtn('13:18')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('19:13')}
                                {resoBtn('13:19')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('7:4')}
                                {resoBtn('4:7')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('21:11')}
                                {resoBtn('11:21')}
                            </div>
                            {/* <div>|</div> */}
                            <div tw='join flex flex-col'>
                                {resoBtn('2:1')}
                                {resoBtn('1:2')}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Frame>
    )
})
