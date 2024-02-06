import { observer } from 'mobx-react-lite'

export const PluginWrapperUI = observer(function PluginWrapperUI_(p: { title: string; children?: React.ReactNode }) {
    return (
        <div tw='bg-base-300 p-1 ml-8'>
            <div tw='italic opacity-50 text-sm'>Plugin: {p.title}</div>
            {p.children}
        </div>
    )
})
