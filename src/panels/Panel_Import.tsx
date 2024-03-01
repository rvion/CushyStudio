import { observer } from 'mobx-react-lite'

import { useSt } from '../state/stateContext'
import { ImportAsImageUI, ImportedFileUI } from 'src/importers/FilesBeeingImported'
import { TargetBox } from 'src/importers/TargetBox'

export const Panel_Import = observer(function Panel_Import_(p: {}) {
    const st = useSt()

    return (
        <div tw='w-full h-full'>
            <div tw='flex flex-col gap-3 m-3'>
                <div
                    onClick={() => {
                        st.droppedFiles.splice(0)
                    }}
                    tw='btn btn-sm  btn-warning'
                >
                    clear
                </div>
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
            <div tw='relative w-96 h-96 virtualBorder'>
                <TargetBox />
            </div>
        </div>
    )
})
