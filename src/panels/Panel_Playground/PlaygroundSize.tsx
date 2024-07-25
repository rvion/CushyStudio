import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { CSuiteOverride } from '../../csuite/ctx/CSuiteOverride'
import { Frame } from '../../csuite/frame/Frame'

export const PlaygroundSizeUI = observer(function PlaygroundSizeUI_(p: {}) {
    return (
        <div>
            <Frame tw='my-1' line /* V1 */>
                <Button size='lg'>Coucou</Button>
                <Frame size='lg' children={'hello'} />
                <Button size='lg'>This is cool</Button>
            </Frame>

            <CSuiteOverride config={{ inputHeight: 5 }}>
                <Frame tw='my-1' line /* V1 */>
                    <Button>Coucou</Button>
                    <Frame children={'hello'} />
                    <Button>This is cool</Button>
                </Frame>
            </CSuiteOverride>
        </div>
    )
})
