/** 📝 This needs to be a .tsx file */

import { observer } from 'mobx-react-lite'

export const MyCustomComponent2 = observer(function (p: { text: string }) {
    return (
        <div className='flex flex-col gap-2 p-2'>
            <div>
                <div tw='inline-block animate-spin'>{p.text}</div>
            </div>
        </div>
    )
})
