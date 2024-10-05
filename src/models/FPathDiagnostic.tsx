import type { FPath } from './FPath'

import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../csuite'
import { BadgeUI } from '../csuite/badge/BadgeUI'
import { RevealUI } from '../csuite/reveal/RevealUI'
import { QuickTableUI } from '../csuite/utils/quicktable'

export const FPathDiagnosticUI = observer(function FPathDiagnostic({ fpath }: { fpath: FPath }) {
    if (fpath.existsSync) return null
    return (
        <MessageErrorUI title='File Does not exists'>
            <QuickTableUI
                dense
                rows={fpath.hierarchy.map((parent) => ({
                    exists: parent.existsSync ? '✅' : '❌',
                    path: JSON.stringify(parent.path),
                }))}
            />
        </MessageErrorUI>
    )
})

export const FPathDiagnosticBadgeUI = observer(function FPathDiagnosticBadge({ fpath }: { fpath: FPath }) {
    if (fpath.existsSync) return null
    return (
        <RevealUI content={() => <FPathDiagnosticUI fpath={fpath} />}>
            <BadgeUI hue={0} children={'FILE ERROR'} />
        </RevealUI>
    )
})
