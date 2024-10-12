import { observer } from 'mobx-react-lite'

// Could also be used as form.spacer() to give app designers a bit more control?

/** Push things after this to the right as much as possible. If used twice, widgets after the first usage will be centered.
 *
 * Example:
 *
 * ```
 *  <HeaderUI>
 *      <Button>Left!</Button>
 *      <SpacerUI />
 *      <Button>Centered!</Button>
 *      <SpacerUI />
 *      <Button>Right!</Button>
 *  </HeaderUI>
 * ```
 */
export const SpacerUI = observer(function SpacerUI_(p: {}) {
    return <div tw={['ml-auto']} />
})
