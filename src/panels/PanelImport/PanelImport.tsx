import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { Frame } from '../../csuite/frame/Frame'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { ImportAsImageUI, ImportedFileUI } from '../../importers/FilesBeeingImported'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'

export const PanelImport = new Panel({
    name: 'Import',
    category: 'tools',
    widget: (): React.FC<NO_PROPS> => PanelImportUI,
    header: (p): PanelHeader => ({ title: 'Import', icon: 'mdiImport' }),
    def: (): NO_PROPS => ({}),
    icon: 'mdiImport',
})

export const PanelImportUI = observer(function PanelImportUI_(p: {}) {
    const st = useSt()

    return (
        <div tw='w-full h-full'>
            <PanelHeaderUI>
                <SpacerUI />
                {/* Putting clear items button on the right because actions that remove things should be separated in some way from other things to prevent mis-clicks. */}
                <Button
                    tw='h-input btn btn-sm btn-warning'
                    onClick={() => {
                        st.droppedFiles.splice(0)
                    }}
                >
                    <span className='material-symbols-outlined'>backspace</span>
                    Clear Items
                </Button>
            </PanelHeaderUI>
            <div tw='flex flex-col gap-3 m-3'>
                {st.droppedFiles.map((file, ix) => (
                    <Frame border base key={`${file.name}+${ix}`} tw='p-1'>
                        <div>Imported file</div>
                        <div>"{file.name}"</div>
                        <ul>
                            <li>
                                as workflow:
                                <ImportedFileUI key={file.name} file={file} />
                            </li>
                            <li>
                                as image: <ImportAsImageUI file={file} />
                            </li>
                        </ul>
                    </Frame>
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
            {/* <div tw='relative w-96 h-96'>
                <TargetBox />
            </div> */}
        </div>
    )
})
