import { Input } from '@fluentui/react-components'
import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components/unstable'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useWorkspace } from '../ui/WorkspaceContext'

export const NodeBrowserUI = observer(function NodeBrowserUI_(p: {}) {
    const workspace = useWorkspace()
    return (
        <div>
            <Input contentBefore={<I.Search24Regular />} />
            <Tree
                size='small'
                aria-label='Tree'
                defaultOpenItems={['projects', 'demos']}
                ref={(e) => {
                    if (e) e.focus()
                }}
            >
                <AssetTreeUI></AssetTreeUI>
            </Tree>
        </div>
    )
})

const AssetTreeUI = observer(function AssetTreeUI_() {
    const client = useWorkspace()

    const onKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        console.log(ev.key)
        if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault()
            ev.stopPropagation()
            // owner
            const target1 = ev.currentTarget
            if (!(target1 instanceof HTMLDivElement)) return console.log('❌ not a valid target')
            // id
            const target = target1.getElementsByClassName('fui-TreeItemLayout')[0]
            if (!(target instanceof HTMLDivElement)) return console.log('❌ not a valid target')
            const key = target.id
            console.log('🟢', key, target)
            const prev = client.assets.get(key) ?? true
            client.assets.set(key, !prev)
        }
    }

    return (
        <div>
            <Tree
                size='small'
                onChange={() => console.log('change')}
                onClick={() => console.log('click')}
                onOpenChange={(a, b) => {
                    console.log(a, b.type, b)
                }}
            >
                {[...client.schema.knownEnums.values()].map((foo) => {
                    const name = foo.enumNameInComfy
                    const key = `${name}`.replace('enum_', '')
                    const opened = client.assets.get(key) ?? true
                    return (
                        <TreeItem key={key} onKeyDown={onKeyDown}>
                            <TreeItemLayout
                                id={key}
                                iconBefore={opened ? <I.CheckboxChecked20Filled /> : <I.CheckboxUnchecked20Filled />}
                            >
                                {key}
                            </TreeItemLayout>
                            <Tree size='small'>
                                {foo.values.map((value) => {
                                    const key = `${name}.${value}`
                                    const opened = client.assets.get(key) ?? true
                                    const icon = opened ? <I.CheckboxChecked20Filled /> : <I.CheckboxUnchecked20Filled />
                                    return (
                                        <TreeItem key={key} onKeyDown={onKeyDown}>
                                            <TreeItemLayout id={key} iconBefore={icon}>
                                                {value}
                                            </TreeItemLayout>
                                        </TreeItem>
                                    )
                                })}
                            </Tree>
                        </TreeItem>
                    )
                })}
                {/* <TreeItem actions={<Actions />}>
                    <TreeItemLayout iconBefore={<I.Server24Filled />}>Port: {client.serverPort}</TreeItemLayout>
                </TreeItem> */}
            </Tree>
        </div>
    )
})
