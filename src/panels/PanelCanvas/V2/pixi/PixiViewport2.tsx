import type { Application } from 'pixi.js'

import { applyDefaultProps, PixiComponent, useApp } from '@pixi/react'
import { Viewport } from 'pixi-viewport'
import { forwardRef, type Ref } from 'react'
import { object } from 'zod'

// ------------------------------------------------------------------------------
// final props
export interface ViewportProps {
    // size
    width: number
    height: number

    //constraints
    minScale?: number
    maxScale?: number
    maxHeight?: number
    maxWidth?: number
    minHeight?: number
    minWidth?: number
    //
    children?: React.ReactNode
}
// 2. make a HOC warpper that handle retrieving the app on it's own
export const ViewportPixi = forwardRef((props: ViewportProps, ref: Ref<Viewport>) => (
    <PixiViewportComponent //
        ref={ref}
        app={useApp()} // <--- reason why we need that wrapper
        {...props}
    />
))
ViewportPixi.displayName = 'ViewportPixi'

// ------------------------------------------------------------------------------
// 1. create a base component that simply wrap everything
interface PixiComponentViewportProps extends ViewportProps {
    app: Application
}
const PixiViewportComponent = PixiComponent<PixiComponentViewportProps, Viewport>('Viewport', {
    create: (props) => {
        console.log(`[🤠] `, Object.keys(props))
        // instantiate something and return it.
        // for instance:
        const viewport = new Viewport({
            screenWidth: props.width,
            screenHeight: props.height,
            worldWidth: props.width * 2,
            worldHeight: props.height * 2,
            ticker: props.app.ticker,
            events: props.app.renderer.events, // .plugins.interaction,
            // interaction: props.app.renderer.plugins.interaction,
        })
            .drag({ mouseButtons: 'right' })
            // .pinch()
            .wheel()
            // .decelerate()
            .clampZoom({
                minScale: props.minScale,
                maxScale: props.maxScale,
                maxHeight: props.maxHeight,
                maxWidth: props.maxWidth,
                minHeight: props.minHeight,
                minWidth: props.minWidth,
            })

        return viewport
    },
    didMount: (instance, parent) => {
        // apply custom logic on mount
        console.log('viewport mounted')
    },
    willUnmount: (instance, parent) => {
        console.log('viewport will unmount')

        // clean up before removal
    },
    applyProps: (instance, oldProps, newProps) => {
        console.log('viewport updating props')
        // const { count, ...oldP } = oldProps
        // const { count, ...newP } = newProps

        // apply rest props to PIXI.Text
        applyDefaultProps(instance, oldProps, newProps)

        // set new count
        // instance.text = count.toString()
    },
    // config: {
    //     // destroy instance on unmount?
    //     // default true
    //     destroy: true,

    //     /// destroy its children on unmount?
    //     // default true
    //     destroyChildren: true,
    // },
})
