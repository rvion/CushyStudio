import type { Widget_seed } from './WidgetSeed'

import { observer } from 'mobx-react-lite'

import { Button } from 'src/rsuite/shims'
import { InputNumberUI } from '../number/InputNumberUI'

let isDragging = false

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.serial.val

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            isDragging = false
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

    return (
        <>
            <div
                tw={[
                    'WIDGET-FIELD',
                    'flex-1 flex items-center join',
                    'rounded overflow-clip text-shadow',
                    'border border-base-200 hover:border-base-200',
                    'bg-primary/5',
                    'border-b-2 border-b-base-200 hover:border-b-base-300',
                    '!outline-none',
                ]}
            >
                <button
                    type='button'
                    tw={[
                        'flex items-center gap-1 whitespace-nowrap join-item btn-sm btn-ghost text-shadow px-2',
                        'bg-base-200 hover:bg-base-200 hover:brightness-110',
                        'border-0 !outline-none',
                        widget.serial.mode === 'randomize' && 'btn-active !bg-primary text-shadow-inv text-primary-content',
                    ]}
                    onMouseDown={(ev) => {
                        if (ev.button == 0) {
                            widget.serial.mode = 'randomize'
                            widget.serial.active = true
                            isDragging = true
                            window.addEventListener('mouseup', isDraggingListener, true)
                        }
                    }}
                    onMouseEnter={(ev) => {
                        if (isDragging) {
                            widget.serial.mode = 'randomize'
                            widget.serial.active = true
                        }
                    }}
                >
                    <span className='material-symbols-outlined'>shuffle</span>
                    <div>Random</div>
                </button>
                <button
                    type='button'
                    tw={[
                        'flex items-center gap-1 flex-shrink whitespace-nowrap join-item btn-sm btn-ghost text-shadow px-2',
                        'bg-base-200 hover:bg-base-200 hover:brightness-110',
                        'border-0 !outline-none',
                        widget.serial.mode === 'fixed' && 'btn-active !bg-primary text-shadow-inv text-primary-content',
                    ]}
                    onMouseDown={(ev) => {
                        if (ev.button == 0) {
                            widget.serial.mode = 'fixed'
                            widget.serial.active = true
                            isDragging = true
                            window.addEventListener('mouseup', isDraggingListener, true)
                        }
                    }}
                    onMouseEnter={(ev) => {
                        if (isDragging) {
                            widget.serial.mode = 'fixed'
                            widget.serial.active = true
                        }
                    }}
                >
                    <span className='material-symbols-outlined'>input</span>
                    <div>Fixed</div>
                </button>
                <div tw={['flex-1', widget.serial.mode == 'randomize' && 'pointer-events-none opacity-25']}>
                    <InputNumberUI
                        tw={'!border-none join-item'}
                        min={widget.config.min}
                        max={widget.config.max}
                        step={1}
                        value={val}
                        mode='int'
                        onValueChange={(value) => {
                            widget.serial.val = value
                        }}
                    />
                </div>
                <Button
                    tw={'flex w-7 !outline-none'}
                    size='sm'
                    appearance='subtle'
                    onClick={() => {
                        widget.serial.mode = 'fixed'
                        widget.serial.active = true
                        widget.serial.val = Math.floor(Math.random() * 1000000)
                    }}
                    icon={
                        <span tw='flex-1 pt-0.5' className='material-symbols-outlined'>
                            autorenew
                        </span>
                    }
                ></Button>
            </div>
            <div // Invisible undo button to make the widget line up with everything else neatly.
                tw='opacity-0 cursor-default'
                // tw={[widget.isChanged ? undefined : 'btn-disabled opacity-50']}
                // onClick={() => widget.reset()}
                className='btn btn-xs btn-narrower btn-ghost'
            >
                <span className='material-symbols-outlined'>undo</span>
            </div>
        </>
    )
})
