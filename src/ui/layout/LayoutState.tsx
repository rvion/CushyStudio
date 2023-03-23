import type { CushyImage } from '../../core/CushyImage'

import { Image } from '@fluentui/react-components'
import { makeObservable, observable } from 'mobx'
import DockLayout, { PanelData } from 'rc-dock'
import { TutorialUI } from '../../core/TutorialUI'
import { defaultLayout } from './LayoutDefault'
import { ComfyClient } from '../../core/CushyClient'

export class CushyLayoutState {
    layout = defaultLayout()

    galleryFocus: CushyImage | null = null
    gallerySize = 100
    dockLayout: DockLayout | null = null
    getRef = (r: DockLayout | null) => (this.dockLayout = r)

    constructor(public client: ComfyClient) {
        // this.spawnPopups()
        makeObservable(this, {
            galleryFocus: observable,
            gallerySize: observable,
        })
    }

    // spawnPopups = () => {
    //     // setTimeout(() => {
    //     //     this.addPopup()
    //     // }, 5_000)
    // }

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

    addHelpPopup = () => {
        if (this.dockLayout == null) return
        console.log('🟢 addPopup')
        const uid = Math.random().toString(36).substr(2, 9)
        const newTab = {
            x: Math.random() * 1000,
            y: Math.random() * 1000,
            w: 200,
            h: 200,
            tabs: [
                {
                    minWidth: 180,
                    minHeight: 200,
                    id: 'ide-' + uid,
                    title: 'test',
                    content: <TutorialUI />,
                },
            ],
        }
        this.dockLayout.dockMove(newTab, null, 'float')
    }
}
