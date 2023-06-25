import { writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { StepL, StepOutput } from 'src/models/Step'
import { ComfyNodeUI } from '../NodeListUI'
import { ImageUI } from '../galleries/ImageUI'

export const StepOutputUI = observer(function StepOutputUI_(p: { step: StepL; output: StepOutput }) {
    const msg = p.output
    const graph = p.step.outputGraph.item

    if (msg.type === 'print')
        return (
            <div>
                <div>🪵 {msg.message}</div>
            </div>
        )
    if (msg.type === 'prompt') {
        const prompt = graph.db.prompts.get(msg.promptID)
        const currNode = prompt?.graph.item.currentExecutingNode
        return (
            <div>
                <div>
                    {/* 💬 {prompt?.id} */}
                    {/* <div>({prompt?.images.items.length} images)</div> */}
                </div>
                {currNode && <ComfyNodeUI node={currNode} />}
                <div className='flex'>
                    {prompt?.images.map((img) => (
                        <ImageUI key={img.id} img={img} />
                    ))}
                </div>
            </div>
        )
    }

    if (msg.type === 'execution_error') {
        // const prompt = graph.db.prompts.get(msg.data.prompt_id)
        // const graph = prompt?.graph.item
        return (
            <div>
                <Button
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

                <pre>{JSON.stringify(msg.data, null, 3)}</pre>
            </div>
        )
    }
    if (msg.type === 'executed') return <div>✅</div>

    return <div className='border'>❌ unhandled message of type `{msg.type}`</div>
})
