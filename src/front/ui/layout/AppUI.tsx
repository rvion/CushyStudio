import { observer } from 'mobx-react-lite'
import { AppBarUI } from './AppBarUI'
import { useSt } from 'src/front/FrontStateCtx'
import { ProjectUI } from './ProjectUI'

export const CushyUI = observer(function CushyUI_() {
    const st = useSt()
    return (
        <div className='col grow h100'>
            <AppBarUI />
            <div className='flex flex-grow relative'>
                {/* <MainNavBarUI /> */}
                <ProjectUI />
            </div>
        </div>
    )
})
