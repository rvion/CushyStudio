import { observer } from 'mobx-react-lite'
import { Fragment } from 'react/jsx-runtime'

import { isWidget } from '../controls/IWidget'
import { MenuItem } from '../rsuite/Dropdown'
import { RevealUI } from '../rsuite/reveal/RevealUI'
import { BoundCommand } from './Command'
import { BoundMenu, type MenuInstance } from './Menu'

export const MenuUI = observer(function MenuUI_(p: { menu: MenuInstance<any> }) {
    return (
        <div>
            <ul tw='dropdown menu bg-neutral'>
                {p.menu.entriesWithKb.map(({ entry: Entry, char, charIx }, ix) => {
                    if (Entry instanceof BoundCommand) {
                        const label = Entry.label
                        return (
                            <MenuItem //
                                shortcut={char}
                                onClick={() => {
                                    Entry.command.call(Entry.props)
                                    p.menu.onStop()
                                }}
                                label={
                                    charIx != null ? (
                                        <div>
                                            <span>{label.slice(0, charIx)}</span>
                                            <span tw='underline text-red'>{label[charIx]}</span>
                                            <span>{label.slice(charIx + 1)}</span>
                                        </div>
                                    ) : (
                                        label
                                    )
                                }
                            />
                        )
                    } else if (Entry instanceof BoundMenu) {
                        const label = Entry.title
                        return (
                            <RevealUI trigger='hover' placement='rightStart' content={() => <MenuUI menu={Entry.init()} />}>
                                <MenuItem //
                                    shortcut={char}
                                    onClick={() => Entry.open()}
                                    label={
                                        <>
                                            {charIx != null ? (
                                                <div>
                                                    <span>{label.slice(0, charIx)}</span>
                                                    <span tw='underline text-red'>{label[charIx]}</span>
                                                    <span>{label.slice(charIx + 1)}</span>
                                                </div>
                                            ) : (
                                                label
                                            )}
                                            <span className='material-symbols-outlined'>keyboard_arrow_right</span>
                                        </>
                                    }
                                />
                            </RevealUI>
                        )
                    } else if (isWidget(Entry)) return Entry.ui()
                    else return <Fragment key={ix}>{<Entry />}</Fragment>
                })}
            </ul>
        </div>
    )
})
