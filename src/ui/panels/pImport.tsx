import { Button, Card, Input, Label, Text } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { DropZoneUI } from '../DropZoneUI'
import { useSt } from '../WorkspaceContext'

export const PImportUI = observer(function PImportUI_(p: {}) {
    const client = useSt()
    return (
        // <Card>
        // <Text size={500}>Import project</Text>
        <DropZoneUI />
        // </Card>
    )
})
