import type { CSImage } from '../../core/CSImage'

import { Image } from '@fluentui/react-components'
import { makeObservable, observable } from 'mobx'
import DockLayout, { PanelData, TabData } from 'rc-dock'
import { Workspace } from '../../core/Workspace'
import { TutorialUI } from '../../help/TutorialUI'
import { TypescriptBuffer } from '../code/TypescriptBuffer'
import { TypescriptEditorUI } from '../ComfyCodeEditorUI'
import { defaultLayout } from './LayoutDefault'

export class CushyLayoutState {
    layout = defaultLayout()

    galleryFocus: CSImage | null = null
    gallerySize = 100
    dockLayout: DockLayout | null = null
    getRef = (r: DockLayout | null) => (this.dockLayout = r)

    constructor(public client: Workspace) {
        // this.spawnPopups()
        makeObservable(this, {
            galleryFocus: observable,
            gallerySize: observable,
        })
    }

    openEditorTab = (buff: TypescriptBuffer) => {
        // 1. ensure no tab exist for this file buffer
        if (this.dockLayout == null) return
        const uid = buff.name
        const prev = this.dockLayout.find(uid)
        if (prev != null) {
            console.log('🟢 found existing tab')
            return
        }

        // 2. get dock where this tab should be added
        const group = this.dockLayout.getGroup('CENTRAL')
        if (group == null) return console.log('❌ no central group')

        // 3. build the tab
        const newTab: TabData = {
            closable: true,
            minWidth: 180,
            minHeight: 200,
            id: uid, //'ide-' + uid,
            title: buff.name,
            content: <TypescriptEditorUI buffer={buff} />,
        }

        // 4. focus it
        this.dockLayout.dockMove(newTab, 'CENTRAL', 'active')
    }

    addImagePopup = (url: string) => {
        if (this.dockLayout == null) return
        console.log('🟢 show image in popup')
        const uid = Math.random().toString(36).substr(2, 9)
        const newTab: PanelData = {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            w: 800,
            h: 800,
            tabs: [
                {
                    closable: true,
                    minWidth: 180,
                    minHeight: 200,
                    id: 'ide-' + uid,
                    title: 'test',
                    content: <Image fit='contain' height={'100%'} alt='prompt output' src={url} key={url} />,
                },
            ],
        }
        this.dockLayout.dockMove(newTab, null, 'float')
    }

    /** WIP */
    addHelpPopup = () => {
        if (this.dockLayout == null) return
        console.log('🟢 addPopup')
        const uid = Math.random().toString(36).substr(2, 9)
        const newTab = {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            w: 200,
            h: 200,
            tabs: [{ minWidth: 180, minHeight: 200, id: 'ide-' + uid, title: 'test', content: <TutorialUI /> }],
        }
        this.dockLayout.dockMove(newTab, null, 'float')
    }
}
