import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Button } from 'rsuite'
import { CreateDeckModalState, CreateDeckModalUI } from './CreateDeckModalUI'

export const CreateDeckBtnUI = observer(function CreateDeckBtnUI_(p: {}) {
    const uist = useMemo(() => new CreateDeckModalState(), [])
    return (
        <div>
            <Button
                onClick={uist.handleOpen}
                appearance='primary'
                color='green'
                startIcon={<span className='material-symbols-outlined'>add</span>}
            >
                Create App
            </Button>
            <CreateDeckModalUI uist={uist} />
        </div>
    )
})
