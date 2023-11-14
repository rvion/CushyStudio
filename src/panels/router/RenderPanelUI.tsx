import { observer } from 'mobx-react-lite'
import { Message } from 'rsuite'
import { Panel_DeckList } from 'src/panels/Panel_DeckList'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { Panel_Draft } from '../Panel_Draft'
import { Panel_FileTree } from '../Panel_FileTree'
import { Panel_Civitai } from '../Panel_Civitai'
import { Panel_ComfyNodeExplorer } from '../Panel_ComfyNodeExplorer'
import { Panel_ComfyUI } from '../Panel_ComfyUI'
import { Panel_Config } from '../Panel_Config'
import { Panel_CurrentDraft } from '../Panel_CurrentDraft'
import { Panel_Gallery } from '../Panel_Gallery'
import { Panel_LastGraph } from '../Panel_LastGraph'
import { Panel_MachineManager } from '../Panel_MachineManager'
import { Panel_Marketplace } from '../Panel_Marketplace'
import { Panel_Minipaint } from '../Panel_Minipaint'
import { Panel_Squoosh } from '../Panel_Squoosh'
import { Panel_LastStep, Panel_Steps } from '../Panel_Steps'
import { Panel_ViewImage } from '../Panel_ViewImage'
import { Panel_3dScene } from 'src/panels/Panel_3dScene'
import { Panel_ViewLatent } from 'src/panels/Panel_ViewLatent'
import { Widget, exhaust } from './Layout'
import { Panel_CardPicker3UI } from '../Panel_FullScreenLibrary'

export const RenderPanelUI = observer(function RenderPanelUI_(p: { widget: Widget; widgetProps?: any }) {
    const component = p.widget
    const extra = p.widgetProps

    // prettier-ignore
    try {
        if (component === Widget.Gallery) return <Panel_Gallery />;
        if (component === Widget.Paint) return <Panel_Minipaint {...extra} />; // You can now use imgID to instantiate your paint component properly
        if (component === Widget.Image) return <Panel_ViewImage imageID={extra.imgID}></Panel_ViewImage>; // You can now use imgID to instantiate your paint component properly

        // if (component === Widget.Card)                return <Panel_Card      actionPath={extra.actionPath} />
        if (component === Widget.ComfyUI) return <Panel_ComfyUI litegraphJson={extra.litegraphJson} />;
        if (component === Widget.FileList) return <Panel_DeckList />;
        if (component === Widget.FileList2) return <Panel_FileTree />;
        if (component === Widget.Steps) return <Panel_Steps />;
        if (component === Widget.LastGraph) return <Panel_LastGraph />;
        if (component === Widget.LastImage) return <Panel_ViewImage />;
        if (component === Widget.LastLatent) return <Panel_ViewLatent />;
        if (component === Widget.LastStep) return <Panel_LastStep />;
        if (component === Widget.Civitai) return <Panel_Civitai />;
        if (component === Widget.Squoosh) return <Panel_Squoosh />;
        if (component === Widget.Hosts) return <Panel_MachineManager />;
        if (component === Widget.Marketplace) return <Panel_Marketplace />;
        if (component === Widget.CardPicker3UI) return <Panel_CardPicker3UI  />;
        if (component === Widget.Config) return <Panel_Config />;
        if (component === Widget.Draft) return <Panel_Draft {...extra} />;
        if (component === Widget.CurrentDraft) return <Panel_CurrentDraft />;
        if (component === Widget.ComfyUINodeExplorer) return <Panel_ComfyNodeExplorer />;
        if (component === Widget.Deck) return <div>🔴 todo: action pack page: show readme</div>;
        if (component === Widget.DisplacedImage) return <Panel_3dScene {...extra} />;
    } catch (e) {
        return (
            <pre tw='text-red-500'>
                <div>component "{component}" failed to render:</div>
                error: {stringifyUnknown(e)}
            </pre>
        );
    }

    exhaust(component)
    return (
        <Message type='error' showIcon>
            unknown component
        </Message>
    )
})
