import type { MenuInstance } from './Menu'

import { observer } from 'mobx-react-lite'
import { createElement } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { isWidget } from '../controls/IWidget'
import { MenuItem } from '../rsuite/Dropdown'
import { RevealUI } from '../rsuite/reveal/RevealUI'
import { isBoundCommand } from './_isBoundCommand'
import { isBoundMenu } from './_isBoundMenu'

export const MenuUI = observer(function MenuUI_(p: { menu: MenuInstance<any> }) {
    return (
        <div tw='w-fit'>
            <ul tw='dropdown menu bg-neutral'>
                {p.menu.entriesWithKb.map(({ entry, char, charIx }, ix) => {
                    if (isBoundCommand(entry)) {
                        const label = entry.label
                        return (
                            <MenuItem //
                                tw='min-w-60'
                                key={ix}
                                shortcut={char}
                                onClick={() => {
                                    entry.command.call(entry.props)
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
                    } else if (isBoundMenu(entry)) {
                        const label = entry.title
                        return (
                            <RevealUI //
                                trigger='hover'
                                tw='min-w-60'
                                placement='rightStart'
                                content={() => <MenuUI menu={entry.init(p.menu.allocatedKeys)} />}
                            >
                                <MenuItem //
                                    key={ix}
                                    shortcut={char}
                                    // onClick={() => entry.open()}
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
                    } else if (isWidget(entry)) {
                        return entry.ui()
                    } else {
                        return <Fragment key={ix}>{createElement(entry)}</Fragment>
                    }
                })}
            </ul>
        </div>
    )
})
