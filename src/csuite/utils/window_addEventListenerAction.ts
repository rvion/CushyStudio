import { isAction } from 'mobx'

/**
 *  same as window.addEventListener but THROWs if the listener is not an action
 *
 * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.
 * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.
 * When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.
 * When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.
 * When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.
 * If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.
 * The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.
 *
 * MDN Reference: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
export function window_addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
): void {
    if (!isAction(listener)) throw new Error(`[❌] window_addEventListenerAction must be an action`)
    // 💬 2024-10-07 rvion:
    // | I first tried to use the following code, but it didn't work because
    // | the window.removeEventListener method must be called with the exact same
    // | reference that was passed to window.addEventListener.
    // | so better to just throw an error if the listener is not an action.
    // | and make sure callers do what must be done.
    //
    //=| const finalListener = isAction(listener) //
    //=|     ? listener
    //=|     : action(listener)

    // eslint-disable-next-line no-restricted-properties
    window.addEventListener(type, listener, options)
}
