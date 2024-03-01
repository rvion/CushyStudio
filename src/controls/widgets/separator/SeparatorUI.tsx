import { observer } from 'mobx-react-lite'

// Could also be used as form.separator() to give app designers a bit more control?

/** Push things after this to the right as much as possible. If used twice, widgets after the first usage will be centered.
 *
 * Example:
 *
 * ```
 *  <HeaderUI>
 *      <div tw='btn btn-sm'>Left!</div>
 *      <SeparatorUI />
 *      <div tw='btn btn-sm'>Centered!</div>
 *      <SeparatorUI />
 *      <div tw='btn btn-sm'>Right!</div>
 *  </HeaderUI>
 * ```
 */
export const SeparatorUI = observer(function SeparatorUI_(p: {}) {
    return <div tw={['ml-auto']} />
})
