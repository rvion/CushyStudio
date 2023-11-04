import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'
import { ActionTagMethod } from 'src/library/Card'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { observer } from 'mobx-react-lite'
import { IconButton, Input, Popover, Whisper } from 'rsuite'

export type ActionTag = {
    key: string,
    action: ActionTagMethod,
    param: string
}

export type ActionNodeJSON = SerializedLexicalNode & { tag: ActionTag; type: 'action' }
export class ActionNode extends DecoratorNode<ReactNode> {
    constructor(
        public tag: ActionTag,
        key?: NodeKey,
    ) {
        super(key)
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

export function $createActionNode(tag: ActionTag, key?: NodeKey): ActionNode {
    return new ActionNode(tag, key);
}

export function $isActionNode(node: LexicalNode | null | undefined): node is ActionNode {
    return node instanceof ActionNode
}

export const ActionNodeUI = observer(function ActionNodeUI_(p: { node: ActionNode }) {
    const node = p.node
    const [editor] = useLexicalComposerContext()
    const def = node
    return (
        <Whisper
            enterable
            placement='bottom'
            speaker={
                <Popover>
                    <div key={def.name} className='flex items-start'>
                        <div className='shrink-0'>{def.name.replace('.safetensors', '')}</div>
                        <div className='flex-grow'></div>
                        <Input
                            size='xs'
                            type='text'
                            value={def.tag.param}
                            onChange={(v) => (node.tag.param = v)}
                            style={{ width: '4.5rem' }}
                        />
                        <IconButton
                            size='xs'
                            icon={<span className='material-symbols-outlined'>delete_forever</span>}
                            onClick={() => editor.update(() => node.remove())}
                        />
                    </div>
                </Popover>
            }
        >
            <span className='bg-green-800'>
                /{node.tag.key}({node.tag.param})
            </span>
        </Whisper>
    )
})