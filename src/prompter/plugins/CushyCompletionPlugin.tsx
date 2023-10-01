import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { $getSelection, $isRangeSelection, LexicalNode, TextNode } from 'lexical'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { useSt } from '../../front/FrontStateCtx'

/** menu entry state */
class CompletionOption<T> extends MenuOption {
    title: string
    payload: T
    keywords: Array<string>

    constructor(
        //
        title: string,
        payload: T,
        options: { keywords?: Array<string> },
    ) {
        super(title)
        this.title = title
        this.payload = payload
        this.keywords = options.keywords || []
    }
}

/** menu entry appearance */
function CompletionUI<T>(p: {
    index: number
    isSelected: boolean
    onClick: () => void
    onMouseEnter: () => void
    option: CompletionOption<T>
}) {
    let className = 'item'
    if (p.isSelected) className += ' selected'

    return (
        <li
            key={p.option.key}
            tabIndex={-1}
            className={className}
            ref={p.option.setRefElement}
            role='option'
            aria-selected={p.isSelected}
            id={'typeahead-item-' + p.index}
            onMouseEnter={p.onMouseEnter}
            onClick={p.onClick}
        >
            <span className='text'>
                {/* {option.emoji}  */}
                {p.option.title}
            </span>
        </li>
    )
}

const MAX_EMOJI_SUGGESTION_COUNT = 10

// export const  ShortcutPlugn =() =>  {
//     const st = useSt()
//     const [editor] = useLexicalComposerContext()
//     editor._listeners.
//     const [queryString, setQueryString] = useState<string | null>(null)
// }

export const CushyCompletionPlugin = <T extends any>(p: {
    //
    trigger: string
    getValues: () => Array<T>
    // icon: ReactNode
    describeValue: (value: T) => {
        // titleUI: ReactNode
        title: string
        keywords: string[]
    }
    createNode: (value: T) => LexicalNode
}) => {
    const st = useSt()
    const [editor] = useLexicalComposerContext()
    const [queryString, setQueryString] = useState<string | null>(null)
    const [rawCandidates, setRawCandidates] = useState<T[]>([])
    useEffect(() => setRawCandidates(p.getValues()), [])

    const menuOptions: CompletionOption<T>[] = useMemo(
        () =>
            rawCandidates != null //
                ? rawCandidates.map((x) => {
                      const desc = p.describeValue(x)
                      return new CompletionOption(desc.title, x, { keywords: desc.keywords })
                  })
                : [],
        [rawCandidates],
    )
    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(p.trigger /*':'*/, { minLength: 0 })
    const options: CompletionOption<T>[] = useMemo(() => {
        return menuOptions
            .filter((option: CompletionOption<T>) => {
                return queryString != null
                    ? new RegExp(queryString, 'gi').exec(option.title) || option.keywords != null
                        ? option.keywords.some((keyword: string) => new RegExp(queryString, 'gi').exec(keyword))
                        : false
                    : menuOptions
            })
            .slice(0, MAX_EMOJI_SUGGESTION_COUNT)
    }, [menuOptions, queryString])

    const onSelectOption = useCallback(
        (selectedOption: CompletionOption<T>, nodeToRemove: TextNode | null, closeMenu: () => void) => {
            editor.update(() => {
                const selection = $getSelection()
                if (!$isRangeSelection(selection) || selectedOption == null) return
                if (nodeToRemove) nodeToRemove.remove()
                const insertionResult = selection.insertNodes([
                    p.createNode(selectedOption.payload),
                    //
                    // $createColoredNode('coucou' + selectedOption.emoji, 'blue'),
                    // $createEmbeddingNode('coucou'),
                    // $createCustomParagraphNode(),
                    // $createTextNode(selectedOption.emoji),
                ])
                console.log(insertionResult)

                closeMenu()
            })
        },
        [editor],
    )

    return (
        <LexicalTypeaheadMenuPlugin
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForTriggerMatch}
            options={options}
            menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
                if (anchorElementRef.current == null || options.length === 0) {
                    return null
                }

                return anchorElementRef.current && options.length
                    ? ReactDOM.createPortal(
                          <div className='typeahead-popover emoji-menu '>
                              <ul style={{ paddingInlineStart: 0 }}>
                                  {options.map((option: CompletionOption<T>, index) => (
                                      //   <div >
                                      <CompletionUI
                                          key={option.key}
                                          index={index}
                                          isSelected={selectedIndex === index}
                                          onClick={() => {
                                              setHighlightedIndex(index)
                                              selectOptionAndCleanUp(option)
                                          }}
                                          onMouseEnter={() => {
                                              setHighlightedIndex(index)
                                          }}
                                          option={option}
                                      />
                                      //   </div>
                                  ))}
                              </ul>
                          </div>,
                          anchorElementRef.current,
                      )
                    : null
            }}
        />
    )
}
