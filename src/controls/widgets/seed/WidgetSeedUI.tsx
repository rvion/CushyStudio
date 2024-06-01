import type { Widget_seed } from './WidgetSeed'

import { observer } from 'mobx-react-lite'

import { Button } from '../../../rsuite/button/Button'
import { Frame } from '../../../rsuite/frame/Frame'
import { InputNumberUI } from '../number/InputNumberUI'

export const WidgetSeedUI = observer(function WidgetSeedUI_(p: { widget: Widget_seed }) {
    const widget = p.widget
    const val = widget.serial.val

    return (
        <Frame
            border
            tw={[
                'WIDGET-FIELD',
                'flex-1 flex items-center',
                'rounded overflow-clip text-shadow',
                // 'border border-base-200 hover:border-base-200',
                // 'bg-primary/5',
                // 'border-b-2 border-b-base-200 hover:border-b-base-300',
                // '!outline-none',
            ]}
        >
            <Button
                tw='!border-l-0'
                icon='mdiShuffle'
                active={widget.serial.mode === 'randomize'}
                onClick={() => widget.setToRandomize()}
            >
                Random
            </Button>
            <Button //
                tw='!border-l !border-r'
                // tw='!border-none'
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
                tw='!border-l !border-r-0'
                onClick={() => widget.setToFixed(Math.floor(Math.random() * 100000000))}
                icon='mdiAutorenew'
                square
            />
        </Frame>
    )
})
