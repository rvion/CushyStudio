import type { Widget_seed } from './WidgetSeed'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../../icons/iconHelpers'
import { Button } from '../../../rsuite/Button'
import { InputNumberUI } from '../number/InputNumberUI'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.serial.val

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
                <Button
                    icon='mdiShuffle'
                    appearance='ghost'
                    active={widget.serial.mode === 'randomize'}
                    onClick={() => widget.setToRandomize()}
                >
                    Random
                </Button>
                <Button //
                    icon='mdiAccessPoint'
                    active={widget.serial.mode === 'fixed'}
                    onClick={() => widget.setToFixed()}
                >
                    Fixed
                </Button>
                <InputNumberUI
                    disabled={widget.serial.mode === 'randomize'}
                    tw={['!border-none flex-1']}
                    min={widget.config.min}
                    max={widget.config.max}
                    step={1}
                    value={val}
                    mode='int'
                    onValueChange={(value) => widget.setValue(value)}
                />
                <Button
                    tw='flex !outline-none'
                    size='sm'
                    appearance='ghost'
                    onClick={() => widget.setToFixed(Math.floor(Math.random() * 1000000))}
                    icon='mdiAutorenew'
                />
            </div>
            <div // Invisible undo button to make the widget line up with everything else neatly.
                tw='cursor-default opacity-0' /* 🔴 */
                className='btn btn-xs btn-narrower btn-ghost'
            >
                <Ikon.mdiUndoVariant />
            </div>
        </>
    )
})
