import '../logger/LoggerFront' // inject a global logger
import ReactDOM from 'react-dom/client'

import './webview.css'
import 'rsuite/dist/rsuite.min.css'
import { Button, CustomProvider } from 'rsuite'
import { LiveDB } from '../db/LiveDB'
import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

class State {
    db = new LiveDB({})
}
const Main = observer(() => {
    const st = useMemo(() => new State(), [])
    return (
        <CustomProvider theme='dark'>
            <Button
                onClick={() => {
                    st.db.images.create({
                        id: `a-${nanoid()}`,
                        star: Math.floor(Math.random() * 3),
                        comfyURL: `https://fakeimg.pl/350x200/?text=${nanoid()}`,
                    })
                }}
            >
                add
            </Button>
            <Button onClick={() => st.db.store.images.clear()}>clean</Button>
            {/* <pre>{JSON.stringify(st.db.store, null, 4)}</pre> */}
            {st.db.store.images.map((k, v) => (
                <div key={k}>
                    <Button onClick={() => v.delete()}>X</Button>
                    <Button>({v.test1})</Button>
                    <Button>({v.test2()})</Button>
                    {JSON.stringify({ k, v })}
                </div>
            ))}
        </CustomProvider>
    )
})

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<Main />)
