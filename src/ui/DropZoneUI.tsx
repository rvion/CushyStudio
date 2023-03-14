import { observer } from 'mobx-react-lite'
import { useSt } from './stContext'

export const DropZoneUI = observer(function DropZoneUI_(p: {}) {
    const client = useSt()
    return (
        <div
            className='drop-zone'
            // style={{ border: '1px solid #625858', padding: '1rem', margin: '1rem' }}
            onDragOver={(event) => {
                event.stopPropagation()
                event.preventDefault()
            }}
            onDrop={async (event) => {
                event.preventDefault()
                event.stopPropagation()
                const file: File = event.dataTransfer.files[0]
                await client.handleFile(file)
            }}
        >
            drop files here
        </div>
    )
})
