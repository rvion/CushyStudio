import { writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { GraphL } from 'src/models/Graph'

export const ButonDownloadFilesUI = observer(function ButonDownloadFilesUI_(p: { graph: GraphL }) {
    const { graph } = p
    return (
        <div>
            <Button
                appearance='link'
                size='xs'
                onClick={async () => {
                    const jsonWorkflow = await graph?.json_workflow()
                    console.log('>>>🟢', { jsonWorkflow })
                    const path = graph.getTargetWorkflowFilePath()
                    console.log('>>>🟢', { path })
                    // open file
                    window.require('electron').shell.openExternal(`file://${path}/..`)
                    writeFileSync(path, JSON.stringify(jsonWorkflow, null, 3))
                }}
            >
                download files
            </Button>
        </div>
    )
})
