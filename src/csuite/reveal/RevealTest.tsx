import { observer } from 'mobx-react-lite'

import { RevealUI } from './RevealUI'

export const RevealTestUI = observer(function RevealTestUI_(p: {}) {
    return (
        <div tw='flex-1 m-24'>
            {/*  */}
            🟢
            <div tw='relative' style={{ height: '800px' }}>
                <RevealUI placement='auto' tw='absolute top-8 left-8' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <RevealUI placement='auto' tw='absolute top-8 right-8' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
            </div>
            <div tw='grid grid-cols-5 gap-2'>
                {/* top ---------------------------------------------- */}
                <div></div>
                <RevealUI placement='topStart' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <RevealUI placement='top' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <RevealUI placement='topEnd' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <div></div>

                {/* ---------------------------------------------- */}
                <RevealUI placement='leftStart' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <div></div>
                <div></div>
                <div></div>
                <RevealUI placement='rightStart' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                {/* ---------------------------------------------- */}
                <RevealUI placement='left' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <div></div>
                <div></div>
                <div></div>
                <RevealUI placement='right' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                {/* ---------------------------------------------- */}
                <RevealUI placement='leftEnd' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <div></div>
                <div></div>
                <div></div>
                <RevealUI placement='rightEnd' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                {/* ---------------------------------------------- */}
                {/* bottom */}
                <div></div>
                <RevealUI placement='bottomStart' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <RevealUI placement='bottom' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <RevealUI placement='bottomEnd' content={() => <div tw='w-96 h-48 bg-blue-500'>ok</div>}>
                    <div tw='bg-red-300'>ok</div>
                </RevealUI>
                <div></div>
            </div>
            <div style={{ height: '8000px' }}></div>
        </div>
    )
})
