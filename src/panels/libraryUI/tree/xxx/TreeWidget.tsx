import type { IWidget } from '../../../../controls/IWidget'
import type { ITreeElement, ITreeEntry, TreeEntryAction } from '../TreeEntry'
import type { TreeNode } from '../xxx/TreeNode'

import { makeAutoObservable } from 'mobx'

import { isWidgetGroup, isWidgetString } from '../../../../controls/widgets/WidgetUI.DI'
import { Ikon } from '../../../../icons/iconHelpers'

export class TreeWidget implements ITreeEntry {
    constructor(public widgetWithKey: { widget: IWidget; key: string }) {
        makeAutoObservable(this)
    }

    get widget() {
        return this.widgetWithKey.widget
    }

    /** config label, or parent key */
    get label() {
        if (this.widget.config.label) return this.widget.config.label
        return this.widgetWithKey.key
    }

    get name() {
        return `${this.label}`
    }

    get isFolder() {
        return this.widget.subWidgets.length > 0
    }

    /** packed with a bunch of sane default for now; we'll see if this is ever */
    get icon() {
        const w = this.widget
        if (w.type === 'choices') return <Ikon.mdiCheckboxMultipleMarked />
        if (w.type === 'choice') return <Ikon.mdiCheckboxMarked />
        if (isWidgetGroup(w)) {
            if (Object.keys(w.fields).length === 0) return <Ikon.mdiCircle />
            return <Ikon.mdiFolder />
        }
        if (w.type === 'optional') return <Ikon.mdiCheckboxBlankOutline />
        if (w.type === 'list') return <Ikon.mdiFormatListBulleted />
        if (w.type === 'enum') return <Ikon.mdiFormatListBulletedSquare />
        if (w.type === 'markdown') return <Ikon.mdiFormatListBulletedSquare />

        if (isWidgetString(w)) {
            const it = w.config.inputType
            if (it === 'color') return <Ikon.mdiPalette />
            if (it === 'date') return <Ikon.mdiCalendar />
            if (it === 'datetime-local') return <Ikon.mdiCalendarClock />
            if (it === 'email') return <Ikon.mdiEmailOutline />
            if (it === 'password') return <Ikon.mdiLockOutline />
            if (it === 'tel') return <Ikon.mdiPhoneOutline />
            if (it === 'text') return <Ikon.mdiTextBoxOutline />
            if (it === 'time') return <Ikon.mdiClockOutline />
            if (it === 'url') return <Ikon.mdiWeb />
            return <Ikon.mdiTextBoxOutline />
        }
        if (w.type === 'number') return <Ikon.mdiNumeric />
        if (w.type === 'boolean') return <Ikon.mdiCheckboxBlankOutline />
        //
        return <Ikon.mdiBatteryUnknown tw='text-red-400' />
        // return <span className='material-symbols-outlined'>Draft</span>
    }

    onPrimaryAction = (n: TreeNode) => {
        // if (this.app == null) return
        // if (!n.isOpen) n.open()
        // if (this.app.drafts.length > 0) return
        // this.app.createDraft()
    }

    children = (): ITreeElement<any>[] => {
        return this.widget.subWidgetsWithKeys.map((w) => w.widget.asTreeElement(w.key))
    }

    // extra = () => (
    //     <>
    //         {this.app?.isLoadedInMemory ? <span className='material-symbols-outlined text-green-500'>memory</span> : null}
    //         <TreeApp_BtnFavUI entry={this} />
    //     </>
    // )
    actions: TreeEntryAction[] = [
        // {
        //     name: 'add Draft',
        //     icon: 'add',
        //     mode: 'small',
        //     onClick: (node) => {
        //         if (this.app == null) return
        //         this.app.createDraft()
        //         node.open()
        //     },
        // },
    ]
}
