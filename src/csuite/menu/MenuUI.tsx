import type { MenuInstance } from './Menu'

import { observer } from 'mobx-react-lite'
import { createElement } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { isWidget } from '../../controls/$FieldSym'
import { activityManager } from '../activity/ActivityManager'
import { MenuItem } from '../dropdown/MenuItem'
import { IkonOf } from '../icons/iconHelpers'
import { isBoundCommand } from '../introspect/_isBoundCommand'
import { isBoundMenu } from '../introspect/_isBoundMenu'
import { isCommand } from '../introspect/_isCommand'
import { RevealUI } from '../reveal/RevealUI'
import { SimpleMenuAction } from './SimpleMenuAction'
import { SimpleMenuModal } from './SimpleMenuModal'

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
        <div
            className='_MenuUI'
            tabIndex={-1}
            autoFocus
            tw='w-fit'
            onKeyDown={(ev) => {
                const key = ev.key
                for (const entry of p.menu.entriesWithKb) {
                    if (entry.char === key) {
                        if (entry.entry instanceof SimpleMenuAction) entry.entry.opts.onPick()
                        // if (entry.entry instanceof SimpleMenuEntryPopup) entry.entry.onPick()
                        else if (isBoundCommand(entry.entry)) void entry.entry.execute()
                        else if (isCommand(entry.entry)) void entry.entry.execute()
                        p.menu.onStop()
                        ev.stopPropagation()
                        ev.preventDefault()
                        return
                    }
                }
            }}
        >
            {p.menu.entriesWithKb.map(({ entry, char, charIx }, ix) => {
                if (entry instanceof SimpleMenuAction) {
                    return (
                        <MenuItem //
                            tw='_SimpleMenuAction min-w-60'
                            key={ix}
                            shortcut={char}
                            label={entry.opts.label}
                            icon={entry.opts.icon ? <IkonOf name={entry.opts.icon} /> : undefined}
                            onClick={() => {
                                entry.opts.onPick()
                                p.menu.onStop()
                            }}
                        />
                    )
                }
                if (entry instanceof SimpleMenuModal) {
                    return (
                        <MenuItem //
                            tw='_SimpleMenuModal min-w-60'
                            key={ix}
                            shortcut={char}
                            label={entry.p.label}
                            onClick={(event) => {
                                activityManager.startActivity({
                                    event,
                                    uid: 'createPreset❓',
                                    placement: 'auto',
                                    shell: 'popup-lg',
                                    UI: (p) => (
                                        <entry.p.UI //
                                            close={() => p.stop()}
                                            submit={entry.p.submit}
                                            submitLabel={entry.p.submitLabel}
                                        />
                                    ),
                                })
                            }}
                        />
                    )
                }
                if (isBoundCommand(entry) || isCommand(entry)) {
                    const label = entry.label
                    return (
                        <MenuItem //
                            tw='min-w-60'
                            key={ix}
                            shortcut={char}
                            onClick={() => {
                                void entry.execute()
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
                                    <Fragment>
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
                                    </Fragment>
                                }
                            />
                        </RevealUI>
                    )
                } else if (isWidget(entry)) {
                    return entry.renderWithLabel()
                } else {
                    return <Fragment key={ix}>{createElement(entry)}</Fragment>
                }
            })}
        </div>
    )
})
