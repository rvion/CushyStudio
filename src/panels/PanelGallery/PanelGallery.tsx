import type { MediaImageL } from '../../models/MediaImage'

import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'

import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { UI } from '../../csuite/components/UI'
import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { Panel, type PanelHeader, type PanelPreset } from '../../router/Panel'
import { usePanel } from '../../router/usePanel'
import { GalleryConf, useGalleryConf } from './galleryConf'
import { GalleryImageGridUI } from './GalleryImageGridUI'
import { GallerySearchControlsUI } from './GallerySearchControlsUI'

export const PanelGallery = new Panel({
    name: 'Gallery',
    category: 'outputs',
    widget: (): React.FC<PanelGalleryProps> => PanelGalleryUI,
    header: (p: PanelGalleryProps): PanelHeader => ({ title: 'Gallery' }),
    icon: 'mdiViewGallery',
    def: (): PanelGalleryProps => ({}),
    presets: {
        'Gallery 1': (): PanelPreset<PanelGalleryProps> => ({ props: { uid: 1 } }),
        'Gallery 2': (): PanelPreset<PanelGalleryProps> => ({ props: { uid: 2 } }),
        'Gallery 3': (): PanelPreset<PanelGalleryProps> => ({ props: { uid: 3 } }),
    },
})

export type PanelGalleryProps = {
    uid?: number | string
    className?: string
    /** when not specified, it will just open the default image menu */
    onClick?: (img: MediaImageL) => void
}

export const PanelGalleryUI = observer(function PanelGalleryUI_(p: PanelGalleryProps) {
    const conf: GalleryConf = useGalleryConf()
    const panel = usePanel<PanelGalleryProps>()
    return (
        <UI.Panel //
            // className='flex flex-col h-full'
            tw={'!overflow-clip'}
            className={p.className}
            style={{ background: conf.value.galleryBgColor ?? undefined }}
        >
            <UI.Panel.Header>
                <Button //
                    square
                    icon='mdiContentDuplicate'
                    tooltip='Duplicate Panel'
                    onClick={() => panel.clone({ uid: nanoid() })}
                />
                <SpacerUI />
                <GallerySearchControlsUI />
                <SpacerUI />
                <GalleryPreferencesUI />
            </UI.Panel.Header>
            {/* <conf.Render
                global={(ui) => {
                    const field = ui.field
                    ui.apply({ Shell: ui.catalog.Shell.Mobile })
                    if (isFieldGroup(field))
                        return {
                            // Shell: <ui.catalog.group.inline field={field} />,
                            Header: (): JSX.Element => <ui.catalog.group.inline field={field} />,
                            Body: null,
                        }
                }}
            /> */}
            <GalleryImageGridUI onClick={p.onClick} />
        </UI.Panel>
    )
})

export const GalleryPreferencesUI = observer(function GalleryPreferencesUI_(p: {}) {
    const conf = useGalleryConf()
    return (
        <FormAsDropdownConfigUI //
            title='Gallery Options'
            form={conf}
        />
    )
})
