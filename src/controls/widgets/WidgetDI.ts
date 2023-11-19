import type { WidgetUI } from './WidgetUI'

/**
 * DI stands for dependency injection
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * */
export let WidgetDI = {
    WidgetUI: null as Maybe<typeof WidgetUI>,
}
