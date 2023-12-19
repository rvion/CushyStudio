import { observer } from 'mobx-react-lite'
import { ImportedFileUI } from 'src/importers/FilesBeeingImported'
import { TargetBox } from 'src/importers/TargetBox'
import { useSt } from '../state/stateContext'

export const Panel_Import = observer(function Panel_Import_(p: {}) {
    const st = useSt()

    return (
        <div tw='w-full h-full'>
            <div tw='flex flex-col gap-3 m-3'>
                {st.droppedFiles.map((file) => (
                    <ImportedFileUI key={file.name} file={file} />
                ))}
            </div>
            <div tw='relative w-96 h-96 virtualBorder'>
                <TargetBox />
            </div>
        </div>
    )
})
