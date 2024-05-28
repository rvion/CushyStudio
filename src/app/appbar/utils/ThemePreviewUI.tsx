import { observer } from 'mobx-react-lite'

import { ThemeName } from '../../../theme/ThemeManager'

export const ThemePreviewUI = observer(function ThemePreviewUI_(p: { theme: ThemeName }) {
    return (
        <div data-theme={p.theme} className=' rounded flex gap-1 text-base-content cursor-pointer font-sans p-1'>
            <div className='font-bold'>{p.theme}</div>
            <div tw='flex-grow'></div>
            <div className='flex [height:1rem] w-2 items-center justify-center rounded '></div>
            <div className='flex [height:1rem] w-2 items-center justify-center rounded '></div>
            <div className='bg-primary flex [height:1rem] w-2 items-center justify-center rounded '></div>
            <div className='bg-secondary flex [height:1rem] w-2 items-center justify-center rounded '></div>
            <div className='bg-accent flex [height:1rem] w-2 items-center justify-center rounded '></div>
            <div className='bg-neutral flex [height:1rem] w-2 items-center justify-center rounded '></div>
        </div>
    )
})
