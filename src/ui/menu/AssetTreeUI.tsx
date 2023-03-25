import { Tree, TreeItem, TreeItemLayout } from '@fluentui/react-components/unstable'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useSt } from '../stContext'
import { Actions, HasProblem, IsOK } from './ProjectTreeUI'

export const AssetTreeUI = observer(function AssetTreeUI_() {
    const client = useSt()

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
        <TreeItem actions={<Actions />}>
            <TreeItemLayout iconBefore={<I.Server24Filled />} aside={client.wsStatus === 'on' ? IsOK : HasProblem}>
                Assets
            </TreeItemLayout>
            {/* <Multiselect /> */}
            <Tree
                size='small'
                onChange={() => console.log('change')}
                onClick={() => console.log('click')}
                // onKeyDown={onKeyDown}
                onOpenChange={(a, b) => {
                    console.log(a, b.type, b)
                    // if (b.type==='')
                    // console.log('OKOK')
                }}
            >
                {[...client.schema.knownEnums.values()].map((foo) => {
                    const name = foo.name
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
        </TreeItem>
    )
})
