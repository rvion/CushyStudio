import { observer } from 'mobx-react-lite'

import { useSt } from '../state/stateContext'
import { ImportAsImageUI, ImportedFileUI } from 'src/importers/FilesBeeingImported'
import { TargetBox } from 'src/importers/TargetBox'
import { SeparatorUI } from 'src/controls/widgets/separator/SeparatorUI'
import { PanelHeaderUI } from './PanelHeader'

export const Panel_Import = observer(function Panel_Import_(p: {}) {
    const st = useSt()

    return (
        <div tw='w-full h-full'>
            <PanelHeaderUI>
                <SeparatorUI />
                {/* Putting clear items button on the right because actions that remove things should be separated in some way from other things to prevent mis-clicks. */}
                <div
                    onClick={() => {
                        st.droppedFiles.splice(0)
                    }}
                    tw='WIDGET-FIELD btn btn-sm  btn-warning'
                >
                    <span className='material-symbols-outlined'>backspace</span>
                    Clear Items
                </div>
            </PanelHeaderUI>
            <div tw='flex flex-col gap-3 m-3'>
                {st.droppedFiles.map((file, ix) => (
                    <div key={file.name} tw='card card-bordered p-2 bg-base-200'>
                        <div tw='card-title'>Imported file</div>
                        <div tw='italic text-sm'>"{file.name}"</div>
                        <ul>
                            <li tw='virtualBorder'>
                                as workflow:
                                <ImportedFileUI key={file.name} file={file} />
                            </li>
                            <li>
                                as image: <ImportAsImageUI file={file} />
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
            {st.droppedFiles.length == 0 ? (
                <div tw='flex items-center w-full h-auto p-10 justify-center text-center'>
                    <div tw='flex-1 flex-grow opacity-50 w-full h-full select-none'>
                        Drag a file or an image from a web browser on to CushyStudio to import it.
                    </div>
                </div>
            ) : (
                <></>
            )}
            {/* <div tw='relative w-96 h-96 virtualBorder'>
                <TargetBox />
            </div> */}
        </div>
    )
})
