export type UI_model_kohyaDeepShrink = X.XGroup<{
    include: X.XChoices<{
        base: X.XGroup<{}>
        hiRes: X.XGroup<{}>
    }>
    advancedSettings: X.XGroup<{
        downscaleFactor: X.XNumber
        block_number: X.XNumber
        startPercent: X.XNumber
        endPercent: X.XNumber
        downscaleAfterSkip: X.XBool
        downscaleMethod: X.XEnum<Enum_LatentUpscale_upscale_method>
        upscaleMethod: X.XEnum<Enum_LatentUpscale_upscale_method>
    }>
}>

export function ui_model_kohyaDeepShrink(form: X.Builder): UI_model_kohyaDeepShrink {
    return form.fields(
        {
            include: form.choices({
                items: { base: form.fields({}), hiRes: form.fields({}) },
                appearance: 'tab',
                default: { base: false, hiRes: true },
            }),
            advancedSettings: form.fields(
                {
                    downscaleFactor: form.float({
                        default: 2,
                        min: 0.1,
                        max: 9,
                        softMax: 4,
                        step: 0.25,
                        tooltip: 'only applies to shrink on base model. hires will use hires scale factor.',
                    }),
                    block_number: form.int({ default: 3, max: 32, min: 1 }),
                    startPercent: form.float({ default: 0, min: 0, max: 1, step: 0.05 }),
                    endPercent: form.float({ default: 0.35, min: 0, max: 1, step: 0.05 }),
                    downscaleAfterSkip: form.bool({ default: false }),
                    downscaleMethod: form.enum.Enum_PatchModelAddDownscale_downscale_method({
                        default: 'bislerp',
                    }),
                    upscaleMethod: form.enum.Enum_PatchModelAddDownscale_upscale_method({ default: 'bicubic' }),
                },
                {
                    startCollapsed: true,
                    summary: (ui) => {
                        return `scale:${ui.downscaleFactor} end:${ui.endPercent} afterSkip:${ui.downscaleAfterSkip} downMethod:${ui.downscaleMethod}`
                    },
                },
            ),
        },
        {
            startCollapsed: true,
            tooltip:
                'Shrinks and patches the model. Can be used to generate resolutions higher than the model training and helps with hires fix.',
            summary: (ui) => {
                return `${ui.include.base ? '🟢Base (' + ui.advancedSettings.downscaleFactor + ')' : ''}${ui.include.hiRes ? '🟢HiRes ' : ''} end:${ui.advancedSettings.endPercent}`
            },
        },
    )
}
