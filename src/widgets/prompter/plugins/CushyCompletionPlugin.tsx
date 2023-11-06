import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalTypeaheadMenuPlugin, MenuOption, MenuTextMatch, TriggerFn } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { $getSelection, $isRangeSelection, TextNode } from 'lexical'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { useSt } from '../../../state/stateContext'
import { CompletionCandidate, CompletionState } from './CompletionProviders'

/** menu entry state */
export class CompletionOption<T = any> extends MenuOption {
    title: string
    payload: T
    keywords: Array<string>

    constructor(public _candidate: CompletionCandidate<T>) {
        super(_candidate.title)
        this.title = _candidate.title
        this.payload = _candidate.value
        this.keywords = _candidate.keywords || []
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
                {p.option._candidate.menuLabel}
                {/* {option.emoji}  */}
                {p.option.title}
            </span>
        </li>
    )
}

const MAX_SUGGESTION_COUNT = 10

const PUNCTUATION = [',.']
function FOO(/*trigger: string,*/ { minLength = 1, maxLength = 75 }) {
    return useCallback(
        (text: string): MenuTextMatch | null => {
            const lastWord = text.split(/\s+/).pop()?.trim()
            if (!lastWord) return null
            return {
                leadOffset: text.length - lastWord.length,
                matchingString: lastWord,
                replaceableString: lastWord,
            }
            return null
        },
        [maxLength, minLength /*, trigger*/],
    )
}

export const CushyCompletionPlugin = observer((p: { cs: CompletionState }) => {
    const st = useSt()
    const [editor] = useLexicalComposerContext()
    const [queryString, setQueryString] = useState<string | null>(null)

    const menuOptions = p.cs.completionOptions
    const checkForTriggerMatch: TriggerFn = FOO({ minLength: 0 })
    // const checkForTriggerMatch2: TriggerFn = useBasicTypeaheadTriggerMatch(p.trigger, { minLength: 0 })

    const options: CompletionOption[] = useMemo(() => {
        if (queryString == null) return menuOptions
        if (!queryString.length) return menuOptions
        return menuOptions
            .filter((option: CompletionOption) => {
                const c0 = queryString[0]
                if ([':', '&', '*', '@', '^', '/'].includes(c0)) {
                    if (option._candidate.trigger !== c0) return false
                }
                const lastWordWithoutSymbols = queryString?.replace(/[^a-zA-Z0-9]/g, '')
                const patrn = new RegExp(lastWordWithoutSymbols, 'gi')
                if (patrn.exec(option.title)) return true
                if (option.keywords.some((keyword: string) => patrn.exec(keyword))) return true
                return false
            })
            .slice(0, MAX_SUGGESTION_COUNT)
    }, [menuOptions, queryString])

    const onSelectOption = useCallback(
        (selectedOption: CompletionOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
            editor.update(() => {
                const selection = $getSelection()
                if (!$isRangeSelection(selection) || selectedOption == null) return
                if (nodeToRemove) nodeToRemove.remove()
                const insertionResult = selection.insertNodes([
                    selectedOption._candidate.createNode(selectedOption.payload),
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
                                  {options.map((option: CompletionOption, index) => (
                                      <CompletionUI
                                          key={option.key}
                                          index={index}
                                          isSelected={selectedIndex === index}
                                          option={option}
                                          onMouseEnter={() => setHighlightedIndex(index)}
                                          onClick={() => {
                                              setHighlightedIndex(index)
                                              selectOptionAndCleanUp(option)
                                          }}
                                      />
                                  ))}
                              </ul>
                          </div>,
                          anchorElementRef.current,
                      )
                    : null
            }}
        />
    )
})
