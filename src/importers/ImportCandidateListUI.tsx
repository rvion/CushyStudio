import { Button, Card, CardFooter, CardHeader, Image } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { useWorkspace } from '../ui/WorkspaceContext'
import { ImportCandidate } from './ImportCandidate'

export const ImportCandidateListUI = observer(function ImportCandidateListUI_(p: {}) {
    const workspace = useWorkspace()
    return (
        <div className='col gap'>
            {workspace.importQueue.map((candidate) => (
                <ImportCandidateUI candidate={candidate} key={candidate.name} />
            ))}
        </div>
    )
})

export const ImportCandidateUI = observer(function ImportCandidateUI_(p: { candidate: ImportCandidate }) {
    const workspace = useWorkspace()
    const candidate = p.candidate
    const file = candidate.file
    // const isPng = file.name.endsWith('.png')
    // const { value } = usePromise<TextChunks>(isPng ? getPngMetadata(file) : null)
    // const meta = isPng ? getPngMetadata(file) : null
    return (
        <Card key={file.name} appearance='filled-alternative'>
            <CardHeader image={previewPath(candidate)} header='imported file' description={file.name} />
            {/* <Title3>{f.name}</Title3> */}
            {/* <CardPreview>{value ? <div>{Object.keys(value).join(', ')}</div> : null}</CardPreview> */}
            <CardFooter>
                <div className='row wrap gap1'>
                    <Button //
                        appearance='outline'
                        onClick={() => candidate.importAsAsset()}
                        disabled={!candidate.canBeImportedAsWorspaceAsset}
                    >
                        Import as Asset
                    </Button>
                    <Button //
                        appearance='outline'
                        onClick={() => candidate.importAsScript()}
                        disabled={!candidate.canBeImportedAsComfyUIJSON}
                    >
                        Import as Flow and Convert to Cushy Script
                    </Button>
                    <Button //
                        appearance='outline'
                        onClick={() => alert('not implemented')}
                        disabled={!candidate.canBeImportedAsComfyUIJSON}
                    >
                        Import as basic Flow
                    </Button>
                    <Button //
                        appearance='outline'
                        onClick={() => alert('not implemented')}
                        disabled={!candidate.canBeImportedAsCushyScript}
                    >
                        Import as Cushy Script
                    </Button>
                    <Button //
                        onClick={() => {
                            workspace.removeCandidate(candidate)
                        }}
                        disabled={candidate.canBeImportedAsComfyUIJSON}
                    >
                        Cancel
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
})

export const previewPath = (candidate: ImportCandidate) => {
    // TODO: includes more supporte web image formats
    if (candidate.isImg) {
        return (
            <Image //
                src={URL.createObjectURL(candidate.file)}
                width={40}
                height={40}
            />
        )
    }
    return null
}
