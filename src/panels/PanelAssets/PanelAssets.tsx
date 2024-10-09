import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { Frame } from '../../csuite/frame/Frame'
import { useCSuite } from '../../csuite/ctx/useCSuite'

/** This is going to be rudementary for now, including only Loras atm. */
export const PanelAssets = new Panel({
    name: 'Assets',
    widget: (): React.FC<NO_PROPS> => PanelAssetsUI,
    header: (p: NO_PROPS): PanelHeader => ({ title: 'Assets' }),
    def: (): NO_PROPS => ({}),
    icon: 'mdiBookOpenOutline',
    category: 'tools',
})

export const PanelAssetsUI = observer(function PanelAssetsUI_(p: NO_PROPS) {
    const st = useSt()
    return (
        <>
            <PanelHeaderUI>This is in progress, nothing works</PanelHeaderUI>
            <AssetContent />
        </>
    )
})

const AssetContent = observer(function AssetContent_(p: NO_PROPS) {
    return (
        <Frame //
            tw='flex w-full h-full overflow-auto'
        >
            <AssetPageLora // TODO: (bird_d): Pages need a selectui to change the page viewing, unsure if that's the right approach though instead of just using filters.
            />
        </Frame>
    )
})

/** Lora Assets Page
 * If connected to server, display a list of loras
 * The loras must have a drag handler, allowing us to drag a "Lora" "datatype"
 *  (Like drop and drag from the OS) in to various drop locations that will handle the Lora datatype.
 *
 *  What things should handle a drop
 *  WidgetPrompt: Insert the string of text that would add it to the prompt.
 *  Unified Canvas
 *      - Layers: Insert as a modifier for whichever layer (Generative only?)
 *      - Canvas:
 *          = Insert the Lora's pic?
 *          = Quickly generate an image using the lora and put it in the canvas?
 */
const AssetPageLora = observer(function AssetPageLora_(p: NO_PROPS) {
    const loras = cushy.schema.getLoras()
    const csuite = useCSuite()

    if (!cushy.mainHost.isConnected) {
        return 'Not connected to host, can not display Loras'
    }

    return (
        <Frame //
            tw='flex w-full h-full gap-1 p-1'
            wrap
        >
            {loras.map((loraPath) => {
                /**  I'm lazy, if there's a better way to do this string split.
                 *  We should really be pulling info from the comfy instance itself.
                 *  We need the model hash. Preferably all the metadata,
                 *  but with the hash we can pull info from civit and then store it in the local DB.
                 *
                 */
                const name = loraPath.toString().split('/').pop()?.split('.safetensor').shift()
                return (
                    <Frame //
                        tw='w-32 h-40 overflow-clip select-none'
                        base={{ contrast: 0.033 }}
                        roundness={csuite.inputRoundness}
                        border
                        hover
                    >
                        <Frame //
                            tw='w-32 h-32 flex items-center justify-center'
                            base={{ contrast: 0.033 }}
                        >
                            <span tw='text-5xl'>🥚</span>
                        </Frame>
                        <span tw='line-clamp-1 truncate p-1 text-sm'>{name}</span>
                    </Frame>
                )
            })}
        </Frame>
    )
})
