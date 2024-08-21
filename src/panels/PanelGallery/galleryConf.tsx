import type { FieldGroup } from '../../csuite/fields/group/FieldGroup'
import type { MediaImageL } from '../../models/MediaImage'

import { usePanel } from '../../router/usePanel'

export type GalleryConf = FieldGroup<{
    defaultSort: X.XSelectOne_<'updatedAt' | 'createdAt'>
    gallerySize: X.XNumber
    galleryMaxImages: X.XNumber
    galleryBgColor: X.XOptional<X.XString>
    galleryHoverOpacity: X.XNumber
    showPreviewInFullScreen: X.XBool
    onlyShowBlurryThumbnails: X.XBool
    filterPath: X.XString
    filterTag: X.XString
    filterStar: X.XBool
    filterAppName: X.XOptional<X.XSelectOne<{ id: CushyAppID; label: string }, CushyAppID>>
}> & {
    readonly imageToDisplay: MediaImageL[]
}

export function useGalleryConf(): GalleryConf {
    return usePanel().usePersistentModel('gallery-conf', (ui) => {
        // const y = ui.selectOneString(['createdAt', 'updatedAt'] as const, { default: 'createdAt' })
        return ui
            .fields({
                defaultSort: ui.selectOneString(['createdAt', 'updatedAt'] as const, { default: 'createdAt' }),
                gallerySize: ui.int({ label: 'Preview Size', default: 48, min: 24, step: 8, softMax: 512, max: 1024, tooltip: 'Size of the preview images in px', unit: 'px' }), // prettier-ignore
                galleryMaxImages: ui.int({ label: 'Number of items', min: 10, softMax: 300, default: 50, tooltip: 'Maximum number of images to display', }), // prettier-ignore
                galleryBgColor: ui.colorV2({ label: 'background' }).optional(),
                galleryHoverOpacity: ui.number({ label: 'hover opacity', min: 0, max: 1, step: 0.01 }),
                showPreviewInFullScreen: ui.boolean({ label: 'full-screen', tooltip: 'Show the preview in full screen' }),
                onlyShowBlurryThumbnails: ui.boolean({ label: 'Blur Thumbnails' }),
                filterPath: ui.string({ innerIcon: 'mdiFilter', placeHolder: 'filter' }), //.optional(), // emptyAsNullWhenOptional: true
                filterTag: ui.string({ innerIcon: 'mdiTagSearch', placeHolder: 'tags', autoResize: true }), //.optional(), // emptyAsNullWhenOptional: true
                filterStar: ui.boolean({ icon: 'mdiStar', default: false, tooltip: 'Only show favorites' }), //.optional(), // emptyAsNullWhenOptional: true
                filterAppName: ui.app().optional(),
            })
            .extend((self) => ({
                get imageToDisplay(): MediaImageL[] {
                    const conf = self.value
                    const out = cushy.db.media_image.select(
                        (query) => {
                            let x =
                                conf.defaultSort === 'createdAt'
                                    ? query.orderBy('media_image.createdAt', 'desc')
                                    : query.orderBy('media_image.updatedAt', 'desc')

                            x = x.limit(conf.galleryMaxImages ?? 20).select('media_image.id')
                            if (conf.filterPath) x = x.where('media_image.path', 'like', '%' + conf.filterPath + '%')
                            if (conf.filterTag) x = x.where('media_image.tags', 'like', '%' + conf.filterTag + '%')
                            if (conf.filterStar) x = x.where('media_image.star', '=', conf.filterStar ? 1 : 0)
                            if (conf.filterAppName) {
                                x = x
                                    .innerJoin('step', 'media_image.stepID', 'step.id')
                                    .innerJoin('cushy_app', 'cushy_app.id', 'step.appID')
                                    .where('cushy_app.id', 'in', [conf.filterAppName.id])
                            }
                            // ⏸️ let exclude = 'noise'
                            // ⏸️ if (exclude) {
                            // ⏸️     x = x.where('media_image.tags', 'not like', '%' + exclude + '%')
                            // ⏸️ }
                            return x
                        },
                        ['media_image.id'],
                    )
                    // console.log(`[🔴🤠] imageToDisplay AAA`, out.length)
                    // console.log(`[🤠] BBB`)
                    return out
                },
            }))
    })
}
