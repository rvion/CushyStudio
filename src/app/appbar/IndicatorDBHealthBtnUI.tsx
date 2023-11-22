import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const IndicatorDBHealthBtnUI = observer(function IndicatorDBHealthBtnUI_(p: {}) {
    const st = useSt()
    const dbHealth = st.db.health
    const color = dbHealth.status === 'bad' ? 'red' : dbHealth.status === 'meh' ? 'yellow' : 'green'
    return (
        <Button
            //
            size='sm'
            appearance='subtle'
            color={color}
            onClick={() => st.db.reset()}
            icon={<span className='text-orange-500 material-symbols-outlined'>sync</span>}
        >
            DB ({dbHealth.sizeTxt})
        </Button>
    )
})
