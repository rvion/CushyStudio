import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../csuite/messages/MessageErrorUI'

// ------------------------------------------------------------
export type CustomPanelRef<UID extends string, Props> = {
    uid: UID
    $props: Props
}

// ------------------------------------------------------------
const CustomPanels = new Map<string, React.FC<any>>()
export const registerCustomPanel = <UID extends string, Props>(
    //
    uid: UID,
    Widget: React.FC<Props>,
) => {
    CustomPanels.set(uid, Widget)
    return { uid } as any as CustomPanelRef<UID, Props>
}

// ------------------------------------------------------------
export const Panel_Custom = observer(function Panel_Temporary_(p: {
    //
    uid: string
    props: any
}) {
    const Widget = CustomPanels.get(p.uid)
    if (Widget == null) return <MessageErrorUI>no widget for uid #{p.uid}</MessageErrorUI>

    return <Widget {...p.props} />
})
