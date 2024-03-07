import { observer } from 'mobx-react-lite'

// Could also be used as form.spacer() to give app designers a bit more control?

/** Push things after this to the right as much as possible. If used twice, widgets after the first usage will be centered.
 *
 * Example:
 *
 * ```
 *  <HeaderUI>
 *      <div tw='btn btn-sm'>Left!</div>
 *      <SpacerUI />
 *      <div tw='btn btn-sm'>Centered!</div>
 *      <SpacerUI />
 *      <div tw='btn btn-sm'>Right!</div>
 *  </HeaderUI>
 * ```
 */
export const SpacerUI = observer(function SpacerUI_(p: {}) {
    return <div tw={['ml-auto']} />
})
