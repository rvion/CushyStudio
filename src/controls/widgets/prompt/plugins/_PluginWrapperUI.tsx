import { observer } from 'mobx-react-lite'

export const PluginWrapperUI = observer(function PluginWrapperUI_(p: { title: string; children?: React.ReactNode }) {
    return (
        <div tw='bd1 p-1 ml-8'>
            <div tw='italic text-success'>Plugin: {p.title}</div>
            {p.children}
        </div>
    )
})
