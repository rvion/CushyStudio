import { observer } from 'mobx-react-lite'
import { useSt } from './ComfyIDEState'
import { LabelUI } from './LabelUI'
import { MainActionsUI } from './MainActionsUI'

export const ProjectInfosUI = observer(function ProjectInfosUI_(p: {}) {
    const st = useSt()
    const project = st.project
    return (
        <div className='col gap'>
            <div className='row gap items-baseline'>
                <MainActionsUI />
            </div>
            <LabelUI title='Name'>
                <input type='text' value={project.name} />
            </LabelUI>
            <LabelUI title='Prompts'>
                <div className='row wrap gap'>
                    {st.project.prompts.map((v, ix) => (
                        <button
                            //
                            onClick={() => (st.focus = ix)}
                            className={st.focus === ix ? 'active' : undefined}
                        >
                            {ix + 1}
                        </button>
                    ))}
                </div>
            </LabelUI>
        </div>
    )
})
