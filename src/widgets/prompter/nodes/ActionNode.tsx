import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { IconButton, Input, Popover, Whisper } from 'rsuite'
import { ActionTagMethod } from 'src/cards/Card'

export type ActionTag = {
    key: string
    action: ActionTagMethod
}

export type ActionTagInst = {
    tag: ActionTag
    param: string
}

export type ActionNodeJSON = SerializedLexicalNode & { tag: ActionTagInst; type: 'action' }
export class ActionNode extends DecoratorNode<ReactNode> {
    tag: ActionTagInst
    constructor(tag: ActionTagInst, key?: NodeKey) {
        super(key)
        this.tag = observable(tag)
    }

    setParam(v: string): void {
        this.param = v
    }

    static getType(): 'action' {
        return 'action'
    }

    static clone(node: ActionNode): ActionNode {
        return new ActionNode(node.tag, node.__key)
    }

    exportJSON(): ActionNodeJSON {
        return { type: ActionNode.getType(), tag: this.tag, version: 1 }
    }

    importJSON(json: ActionNodeJSON): ActionNode {
        return new ActionNode(json.tag)
    }

    static importJSON(json: ActionNodeJSON): ActionNode {
        return new ActionNode(json.tag)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <ActionNodeUI node={this} /> } // prettier-ignore
}

export function $createActionNode(tag: ActionTagInst, key?: NodeKey): ActionNode {
    return new ActionNode(tag, key)
}

export function $isActionNode(node: LexicalNode | null | undefined): node is ActionNode {
    return node instanceof ActionNode
}

export const ActionNodeUI = observer(function ActionNodeUI_(p: { node: ActionNode }) {
    const node = p.node
    const [editor] = useLexicalComposerContext()
    const def = node.tag
    let set = node.setParam
    console.log(set)
    console.log(node, def)
    return (
        <Whisper
            enterable
            placement='bottom'
            speaker={
                <Popover>
                    <div key={def.tag.key} className='flex items-start'>
                        <div className='shrink-0'>{def.tag.key}(</div>
                        <div className='flex-grow'></div>
                        <Input
                            size='xs'
                            type='text'
                            value={def.param}
                            step={0.1}
                            onChange={(v) => (def.param = v)}
                            style={{ width: '4.5rem' }}
                        />
                        <IconButton
                            size='xs'
                            icon={<span className='material-symbols-outlined'>delete_forever</span>}
                            onClick={() => editor.update(() => node.remove())}
                        />
                        <div className='shrink-0'>)</div>
                    </div>
                </Popover>
            }
        >
            <span className='bg-green-800' style={{ padding: '1px' }}>
                /{def.tag.key}({def.param})
            </span>
        </Whisper>
    )
})
