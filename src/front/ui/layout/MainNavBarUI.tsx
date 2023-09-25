import type { UIAction } from 'src/front/UIAction'
import { observer } from 'mobx-react-lite'
import * as I from '@rsuite/icons'
import { useSt } from '../../FrontStateCtx'
import { Nav } from 'rsuite'

export const MainNavBarUI = observer(function MainNavBarUI_(p: {}) {
    const st = useSt()
    return (
        <Nav
            //
            activeKey={st.action.type}
            onSelect={(k: UIAction['type']) => {
                if (k === 'comfy') return st.setAction({ type: 'comfy' })
                if (k === 'form') return st.setAction({ type: 'form' })
                if (k === 'paint') return st.setAction({ type: 'paint' })
            }}
            className='text-xl'
            appearance='tabs'
            vertical
        >
            {/* FORM */}
            <Nav.Item eventKey='form'>
                <div>1 🛋️</div>
            </Nav.Item>
            {/* PAINT */}
            <Nav.Item eventKey='paint'>
                2 <I.Image />
            </Nav.Item>
            {/* COMFY */}
            <Nav.Item eventKey='comfy'>
                3 <I.Branch />
            </Nav.Item>
            {/* CONFIG */}
            <Nav.Item eventKey='config'>
                4 <I.Gear />
            </Nav.Item>
        </Nav>
    )
})
