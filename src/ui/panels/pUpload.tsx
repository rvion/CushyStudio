import { Card, Image } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { useSt } from '../stContext'

export const PUploadUI = observer(function PUploadUI_(p: {}) {
    const x = useSt()
    return (
        <Card>
            <button
                onClick={async () => {
                    // console.log('a')
                    // await x.save1()
                    // console.log('b')
                    // await x.saveImg()
                    // console.log('c')
                    // await x.uploadImgFromDisk()
                    console.log('d')
                    await x.uploadURL()
                    console.log('e')
                }}
            >
                ❌ TEST UPLOAD ❌
            </button>
            {/* {x.lastUpload && <Image src={x.lastUpload} width={100} height={100} />} */}
        </Card>
    )
})
