import type { MenuInstance } from './Menu'

import { observer } from 'mobx-react-lite'
import { createElement } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { isWidget } from '../controls/IWidget'
import { MenuItem } from '../rsuite/Dropdown'
import { RevealUI } from '../rsuite/reveal/RevealUI'
import { isBoundCommand } from './introspect/_isBoundCommand'
import { isBoundMenu } from './introspect/_isBoundMenu'
import { isCommand } from './introspect/_isCommand'

export const MenuRootUI = observer(function MenuRootUI_(p: { menu: MenuInstance<any> }) {
    return (
        <RevealUI className='dropdown' placement='bottomStart' content={() => <p.menu.UI />}>
            <label tabIndex={0} tw={[`flex-nowrap btn btn-ghost btn-sm py-0 px-1.5`]}>
                {/* <span tw='hidden lg:inline-block'>{p.startIcon}</span> */}
                {p.menu.menu.title}
            </label>
        </RevealUI>
    )
})

export const MenuUI = observer(function MenuUI_(p: { menu: MenuInstance<any> }) {
    return (
        <div tw='w-fit'>
            <ul tw='dropdown menu bg-neutral'>
                {p.menu.entriesWithKb.map(({ entry, char, charIx }, ix) => {
                    if (isBoundCommand(entry) || isCommand(entry)) {
                        const label = entry.label
                        return (
                            <MenuItem //
                                tw='min-w-60'
                                key={ix}
                                shortcut={char}
                                onClick={() => {
                                    entry.execute()
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
