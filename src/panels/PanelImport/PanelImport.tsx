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
                <Button //
                    look='warning'
                    onClick={() => st.droppedFiles.splice(0)}
                    icon='mdiBackspace'
                    children='Clear Items'
                />
            </PanelHeaderUI>
            <div tw='flex flex-col gap-3 m-3'>
                {st.droppedFiles.map((file, ix) => (
                    <Frame border base key={`${file.name}+${ix}`} tw='p-1'>
                        <Frame line icon='mdiFileImport'>
                            "{file.name}"
                        </Frame>

                        <ul>
                            <Frame as='li' border tw='m-2 p-2'>
                                Import as workflow:
                                <ImportedFileUI key={file.name} file={file} />
                            </Frame>
                            <Frame as='li' border tw='m-2'>
                                Import as image: <ImportAsImageUI file={file} />
                            </Frame>
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
