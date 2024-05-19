import type { ResolutionState } from './ResolutionState'
import type { Widget_size } from './WidgetSize'
import type { AspectRatio, ModelType } from './WidgetSizeTypes'

import { observer } from 'mobx-react-lite'

import { Box } from '../../../theme/colorEngine/Box'
import { InputNumberUI } from '../number/InputNumberUI'

export const WigetSize_BlockUI = observer(function WigetSize_BlockUI_(p: { widget: Widget_size }) {
    return <WigetSizeXUI sizeHelper={p.widget.sizeHelper} bounds={p.widget.config} />
})

export const WigetSize_LineUI = observer(function WigetSize_LineUI_(p: { widget: Widget_size }) {
    return <WidgetSizeX_LineUI sizeHelper={p.widget.sizeHelper} bounds={p.widget.config} />
})

export const WidgetSizeX_LineUI = observer(function WidgetSize_LineUI_(p: {
    sizeHelper: ResolutionState
    bounds?: { min?: number; max?: number; step?: number }
}) {
    const uist = p.sizeHelper

    return (
        <div className='flex flex-1 flex-col gap-1'>
            <div //Joined container
                tw={[
                    'WIDGET-FIELD w-full h-full flex items-center join rounded gap-0.5 overflow-clip',
                    'border border-base-100 border-b-base-200',
                    'border-b-2 hover:border-base-200 hover:border-b-base-300',
                ]}
            >
                <AspectLockButtonUI sizeHelper={uist} />
                <InputNumberUI
                    //
                    min={p.bounds?.min ?? 128}
                    max={p.bounds?.max ?? 4096}
                    step={p.bounds?.step ?? 32}
                    mode='int'
                    tw='join-item !border-none'
                    value={uist.width}
                    hideSlider
                    onValueChange={(next) => uist.setWidth(next)}
                    forceSnap={true}
                    text='Width'
                    suffix='px'
                />
                <InputNumberUI
                    //
                    tw='join-item !border-none'
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
                <AspectRatioSquareUI sizeHelper={uist} />
            </div>
            {/* <div tw='flex items-center gap-1'>
                <div // Extra div because gap-1 will eat in to the child's width for SOME reason
                ></div>
            </div> */}
        </div>
    )
})

export const AspectLockButtonUI = observer(function AspectLockButtonUI_(p: { sizeHelper: ResolutionState }) {
    const uist = p.sizeHelper
    return (
        <button // Aspect Lock button
            tw={[
                'btn btn-xs h-8 rounded-none join-item !border-none !outline-none',
                uist.isAspectRatioLocked && 'bg-primary hover:bg-primary text-primary-content !border-none',
            ]}
            onClick={(ev) => {
                uist.isAspectRatioLocked = !uist.isAspectRatioLocked
                if (!uist.isAspectRatioLocked) {
                    return
                }
                // Need to snap value if linked
                if (uist.wasHeightAdjustedLast) {
                    uist.setHeight(uist.height)
                } else {
                    uist.setWidth(uist.width)
                }
            }}
        >
            <span className='material-symbols-outlined'>{uist.isAspectRatioLocked ? 'link' : 'link_off'}</span>
        </button>
    )
})

export const AspectRatioSquareUI = observer(function AspectRatioSquareUI_(p: { sizeHelper: ResolutionState }) {
    const uist = p.sizeHelper
    const ratioDisplaySize = 26
    return (
        <Box // Aspect ratio display background
            border
            tw={[
                //
                'flex rounded-sm',
                'overflow-clip',
                'items-center justify-center',
            ]}
            style={{ width: `${ratioDisplaySize}px`, height: `${ratioDisplaySize}px` }}
        >
            <Box // Aspect ratio display foreground
                base={{ contrast: 0.5 }}
                tw='relative'
                style={{
                    //
                    width: '100%',
                    height: '100%',
                    // Use transform here because it works with floats and will not cause popping/mis-alignments.
                    transform: `
        scaleX(${uist.width < uist.height ? Math.round((uist.width / uist.height) * ratioDisplaySize) / ratioDisplaySize : '1'})
        scaleY(${uist.height < uist.width ? Math.round((uist.height / uist.width) * ratioDisplaySize) / ratioDisplaySize : '1'})`,
                }}
            ></Box>
        </Box>
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
        <button
            type='button'
            tw={['btn btn-xs join-item', uist.desiredAspectRatio === ar ? 'btn-primary' : 'btn-ghost']}
            onClick={() => uist.setAspectRatio(ar)}
        >
            {ar}
        </button>
    )

    const modelBtn = (model: ModelType) => (
        <button
            type='button'
            tw={['btn btn-xs join-item', uist.desiredModelType === model ? 'btn-primary' : 'btn-ghost']}
            onClick={() => uist.setModelType(model)}
        >
            {model}
        </button>
    )

    return (
        <div className='flex flex-col gap-1 mt-0.5 rounded-b'>
            <div tw='flex items-start gap-2'>
                <div tw='join virtualBorder'>
                    {modelBtn('1.5')}
                    {modelBtn('xl')}
                </div>
                <div tw='btn btn-xs' onClick={() => uist.flip()}>
                    <span className='material-symbols-outlined'>rotate_right</span>
                </div>
                <div tw='ml-auto flex items-center gap-1'>
                    <div tw='join virtualBorder'>{resoBtn('1:1')}</div>
                    {/* <div>|</div> */}
                    <div tw='join virtualBorder'>
                        {resoBtn('16:9')}
                        {resoBtn('9:16')}
                    </div>
                    {/* <div>|</div> */}
                    <div tw='join virtualBorder'>
                        {resoBtn('4:3')}
                        {resoBtn('3:4')}
                    </div>
                    {/* <div>|</div> */}
                    <div tw='join virtualBorder'>
                        {resoBtn('3:2')}
                        {resoBtn('2:3')}
                    </div>
                </div>
            </div>
        </div>
    )
})
