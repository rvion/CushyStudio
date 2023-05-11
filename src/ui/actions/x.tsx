import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, Nav } from 'rsuite'
import { useSt } from '../../front/stContext'

export const FooUI = observer(function FooUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            <div className='flex gap-2 items-baseline'>
                Actions:
                {/* {st.pendingAsk} */}
                <Button>script 1</Button>
                <Button>script 2</Button>
                <Button>script 3</Button>
            </div>
            <Nav activeKey={'view'} onSelect={st.setActiveTab}>
                <Nav.Item eventKey='view' icon={<I.ViewsAuthorize />}>
                    Home
                </Nav.Item>
                <Nav.Item eventKey='paint'>Paint</Nav.Item>
                <Nav.Item eventKey='layer'>Layer</Nav.Item>
                <Nav.Item eventKey='SAM'>SAM</Nav.Item>
                {/* <Nav.Item eventKey='about'>About</Nav.Item> */}
            </Nav>
        </div>
    )
})
