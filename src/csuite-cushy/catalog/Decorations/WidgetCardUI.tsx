import { Frame } from '../../../csuite/frame/Frame'

export type WidgetCardProps = {
    hue?: number
    children: any
}

export const WidgetCardUI = (p: WidgetCardProps): JSX.Element => (
    <Frame //
        // style={{ transform: 'rotate(0deg)' }}
        border
        base={{
            contrast: 0.03,
            hue: p.hue ?? 0,
            chroma: 0.03,
        }}
        tw='mb-2'
        // tw='py-2 ml-1 my-1'
    >
        {p.children}
    </Frame>
)
