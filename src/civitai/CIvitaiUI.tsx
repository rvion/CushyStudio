import { Button, Card, Image, Input, Text } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Civitai } from './CivitaiAPI'
import { useWorkspace } from '../ui/WorkspaceContext'
import * as I from '@fluentui/react-icons'
export const CivitaiUI = observer(function CivitaiUI_() {
    const c = useMemo(() => new Civitai(), [])
    const x = useWorkspace()
    return (
        <Card>
            <Text size={300}>Civitai</Text>

            <div className='row gap'>
                <Input
                    contentBefore={<I.Search24Filled />}
                    placeholder='rechercher'
                    value={c.query}
                    onChange={(e) => (c.query = e.target.value)}
                ></Input>
                <Button
                    icon={<I.Search24Filled />}
                    onClick={async () => {
                        const res = await c.search({ query: c.query, page: '1' })
                        console.log(res)
                    }}
                ></Button>
            </div>
            {c.results && (
                <div
                    style={{
                        height: '40rem',
                        // display: 'flex',
                        overflow: 'auto',
                    }}
                >
                    {c.results.items.map((i) => {
                        const v0 = i.modelVersions[0]
                        const v0Imgs = v0.images
                        const img0 = v0Imgs[0]
                        return (
                            <Card>
                                {/* <CardHeader>{i.name}</CardHeader> */}
                                <div>{i.name}</div>
                                {/* <div>{i.id}</div> */}
                                <div>{i.modelVersions.length} version</div>
                                {/* <CardPreview> */}
                                <Image key={img0.url} height={100} width={100} src={img0.url} />
                                {/* </CardPreview> */}
                            </Card>
                        )
                    })}
                </div>
            )}
        </Card>
    )
})

// const x = <Card>
//     <CardHeader>{i.name}</CardHeader>
//     <CardPreview>
//     {/* {i.modelVersions[0].images.map(i => <Image width={200} fit='contain' src={i.url}/>)} */}
//     </CardPreview >
//     </Card>
// </Card>
