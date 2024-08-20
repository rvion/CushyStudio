import { sql } from 'kysely'
import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { UI } from '../../csuite/components/UI'
import { Frame } from '../../csuite/frame/Frame'
import { SQLITE_false, SQLITE_true } from '../../csuite/types/SQLITE_boolean'
import { QuickTableUI } from '../../csuite/utils/quicktable'
import { MediaImageL } from '../../models/MediaImage'
import { Panel, type PanelHeader } from '../../router/Panel'
import { usePanel } from '../../router/usePanel'
import { ImageSimpleUI } from '../../widgets/galleries/ImageSimpleUI'
import { useGalleryConf } from '../PanelGallery/galleryConf'

export const PanelSafetyRatings = new Panel({
    name: 'SafetyRatings',
    category: 'outputs',
    widget: (): React.FC<PanelSafetyRatingsProps> => PanelSafetyRatingsUI,
    header: (p: PanelSafetyRatingsProps): PanelHeader => ({ title: 'SafetyRatings' }),
    icon: 'mdiShieldSunOutline',
    def: (): PanelSafetyRatingsProps => ({}),
})

export type PanelSafetyRatingsProps = {
    uid?: number
    className?: string
    /** when not specified, it will just open the default image menu */
    onClick?: (img: MediaImageL) => void
}

export const PanelSafetyRatingsUI = observer(function PanelSafetyRatings(p: PanelSafetyRatingsProps) {
    const conf = useGalleryConf()
    const xxx = usePanel().usePersistentModel('uist', (ui) =>
        ui.fields({
            delay: ui.int({ default: 100 }),
            amout: ui.int({ default: 10 }),
            image: ui.image().optional(),
            preview: ui.int({ min: 1, default: 100 }),
            previewSize: ui.int({ min: 20, softMax: 100, default: 20 }),
        }),
    )
    return (
        <UI.Panel className={p.className}>
            <UI.Panel.Header>
                SafetyRatings
                {/* <SafetyRatingsPreferencesUI /> */}
                {/* <SpacerUI /> */}
            </UI.Panel.Header>

            {xxx.renderAsForm()}

            <Frame line>
                <Button //
                    size='lg'
                    look='error'
                    onClick={() => MediaImageL.deleteAllMissingOnDisk()}
                    children='delete Image Missing On Disk'
                />
                <Button
                    size='lg'
                    look='success'
                    children={`compute ${xxx.value.amout} more`}
                    onClick={() =>
                        MediaImageL.cacheMissingSafetyRatings({
                            amount: xxx.value.amout,
                            delay: xxx.value.delay,
                            onProcess: (image) => (xxx.value.image = image),
                        })
                    }
                />
            </Frame>
            <QuickTableUI
                tw='m-2 bd'
                rows={cushy.db.media_image
                    .selectRaw2((r) =>
                        r
                            .where('safetyRating', 'is not', null)
                            .select((t) => [
                                sql<string>`json_extract(safetyRating, '$.prediction.className')`.as('category'),
                                t.fn.countAll().as('total'),
                                // fn.agg<string[]>('array_agg', ['pet.name']).as('pet_names'),
                                // t.fn.agg<string[]>('group_concat', ['id']).as('ids2'),
                                t.fn.agg<string>('json_group_array', ['id']).as('ids'),
                            ])
                            .groupBy('category')
                            .limit(10),
                    )
                    .map((r) => {
                        // console.log(`[🔴🟢] r.ids`, JSON.parse(r.ids))
                        // return r
                        return {
                            ...r,
                            ids: (
                                <div tw='flex flex-row flex-wrap'>
                                    {JSON.parse(r.ids)
                                        .map((imgID: string): MediaImageL => cushy.db.media_image.get(imgID)!)
                                        .sort((a: MediaImageL, b: MediaImageL) => b.data.updatedAt - a.data.updatedAt)
                                        .slice(0, xxx.value.preview)
                                        .map((img: MediaImageL) => (
                                            <ImageSimpleUI size={xxx.value.previewSize} key={img.id} img={img!} />
                                        ))}
                                </div>
                            ),
                        }
                    })}
            />

            <QuickTableUI
                key={xxx.Image.value?.id}
                tw='m-2 bd'
                rows={cushy.db.media_image.selectRaw2((r) =>
                    r
                        .select((t) => [
                            t
                                .case() //
                                .when('safetyRating', 'is', null)
                                .then(SQLITE_false)
                                .else(SQLITE_true)
                                .end()
                                .as('isComputed'),
                            t.fn.countAll().as('total'),
                        ])
                        .groupBy('isComputed')
                        .limit(1000),
                )}
            />
        </UI.Panel>
    )
})
