import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'

export const CushyStudioLinkUI = observer(function CushyStudioLinkUI_(p: {}) {
    return (
        <Button
            tw='self-start flex-shrink-0'
            appearance='subtle'
            size='sm'
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio')
            }}
        >
            {/* <span className='material-symbols-outlined text-yellow-600'>star</span> */}
            rvion/CushyStudio
            <img src={assets.GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
        </Button>
    )
})
