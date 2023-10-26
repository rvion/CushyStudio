import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { IconButton, Input, Popover, Whisper } from 'rsuite'
import { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'

export type LoraNodeJSON = SerializedLexicalNode & {
    loraDef: SimplifiedLoraDef
    type: 'lora'
}
export class LoraNode extends DecoratorNode<ReactNode> {
    loraDef: SimplifiedLoraDef
    constructor(loraDef: SimplifiedLoraDef, key?: NodeKey) {
        super(key)
        this.loraDef = observable(loraDef)
    }

    static getType(): 'lora' {
        return 'lora'
    }

    static clone(node: LoraNode): LoraNode {
        return new LoraNode(node.loraDef, node.__key)
    }

    exportJSON(): LoraNodeJSON {
        return {
            type: LoraNode.getType(),
            loraDef: toJS(this.loraDef),
            version: 1,
        }
    }

    importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.loraDef)
    }

    static importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.loraDef)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode {
        return <LoraNodeUI node={this} />
    }
}

export function $createLoraNode(loraDef: SimplifiedLoraDef): LoraNode {
    return new LoraNode(loraDef)
}

export function $isLoraNode(node: LexicalNode | null | undefined): node is LoraNode {
    return node instanceof LoraNode
}

export const LoraNodeUI = observer(function LoraNodeUI_(p: { node: LoraNode }) {
    const node = p.node
    const [editor] = useLexicalComposerContext()
    const def = node.loraDef
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
                            type='number'
                            value={def.strength_model}
                            step={0.1}
                            onChange={(v) => (def.strength_model = typeof v === 'number' ? v : parseFloat(v))}
                            style={{ width: '4.5rem' }}
                        />
                        <Input
                            size='xs'
                            type='number'
                            value={def.strength_clip}
                            step={0.1}
                            onChange={(v) => (def.strength_clip = typeof v === 'number' ? v : parseFloat(v))}
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
            <span className='bg-blue-800 mr-1'>
                {def.name}:{def.strength_model}:{def.strength_clip}
            </span>
        </Whisper>
    )
})
