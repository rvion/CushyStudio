import { observer } from 'mobx-react-lite'

import { RevealUI } from './RevealUI'

export const RevealTestUI = observer(function RevealTestUI_(p: {}) {
    return (
        <div tw='flex-1 m-24'>
            {/*  */}
            🟢
            <div tw='virtualBorder relative' style={{ height: '800px' }}>
                <RevealUI placement='auto' tw='absolute top-8 left-8'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <RevealUI placement='auto' tw='absolute top-8 right-8'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
            </div>
            <div tw='grid grid-cols-5 gap-2'>
                {/* top ---------------------------------------------- */}
                <div></div>
                <RevealUI placement='topStart'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <RevealUI placement='top'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <RevealUI placement='topEnd'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <div></div>

                {/* ---------------------------------------------- */}
                <RevealUI placement='leftStart'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <div></div>
                <div></div>
                <div></div>
                <RevealUI placement='rightStart'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                {/* ---------------------------------------------- */}
                <RevealUI placement='left'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <div></div>
                <div></div>
                <div></div>
                <RevealUI placement='right'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                {/* ---------------------------------------------- */}
                <RevealUI placement='leftEnd'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <div></div>
                <div></div>
                <div></div>
                <RevealUI placement='rightEnd'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                {/* ---------------------------------------------- */}
                {/* bottom */}
                <div></div>
                <RevealUI placement='bottomStart'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <RevealUI placement='bottom'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <RevealUI placement='bottomEnd'>
                    <div tw='bg-red-300'>ok</div>
                    <div tw='w-96 h-48 bg-blue-500'>ok</div>
                </RevealUI>
                <div></div>
            </div>
            <div style={{ height: '8000px' }}></div>
        </div>
    )
})
