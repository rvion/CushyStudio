// ------------------------------------------------------------

export type CustomPanelRef<UID extends string, Props> = {
    uid: UID
    $props: Props
}
export const CustomPanels = new Map<string, React.FC<any>>()
export const registerCustomPanel = <UID extends string, Props>(
    //
    uid: UID,
    Widget: React.FC<Props>,
): CustomPanelRef<UID, Props> => {
    CustomPanels.set(uid, Widget)
    return { uid } as any as CustomPanelRef<UID, Props>
}
