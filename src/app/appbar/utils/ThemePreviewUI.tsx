import { observer } from 'mobx-react-lite'
import { ThemeName } from 'src/theme/ThemeManager'

export const ThemePreviewUI = observer(function ThemePreviewUI_(p: { theme: ThemeName }) {
    return (
        <div data-theme={p.theme} className='bg-base-100 text-base-content cursor-pointer font-sans p-2'>
            <div className='font-bold'>{p.theme}</div>
            <div className='flex gap-1'>
                <div className='bg-base-200 flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                    <div className='text-primary-content text-sm font-bold'>A</div>
                </div>{' '}
                <div className='bg-base-300 flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                    <div className='text-primary-content text-sm font-bold'>A</div>
                </div>{' '}
                <div className='bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                    <div className='text-primary-content text-sm font-bold'>A</div>
                </div>{' '}
                <div className='bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                    <div className='text-secondary-content text-sm font-bold'>A</div>
                </div>{' '}
                <div className='bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                    <div className='text-accent-content text-sm font-bold'>A</div>
                </div>{' '}
                <div className='bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6'>
                    <div className='text-neutral-content text-sm font-bold'>A</div>
                </div>
            </div>
        </div>
    )
})
