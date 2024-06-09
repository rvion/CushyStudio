import type { CushyAppL } from '../../models/CushyApp'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'

export const PublishAppBtnUI = observer(function PublishAppBtnUI_(p: { app: CushyAppL }) {
    const app = p.app
    const st = app.st

    return (
        <Button
            disabled={!app.canBePublishedByUser}
            square
            tooltip='Publish app to the Cushy App Store'
            onClick={async () => {
                // ensure is connected
                if (!st.auth.isConnected) {
                    const confirm = window.confirm('You need to log in to publish apps. Do you want to log in now?')
                    if (!confirm) return
                    await st.auth.startLoginFlowWithGithub()
                    return
                }

                // double intent verification
                const confirm = window.confirm('Are you sure you want to publish this app?')
                if (!confirm) return

                // publish
                await app.publish()
            }}
            loading={app.isPublishing}
            icon={'mdiPublish'}
        />
    )
})
