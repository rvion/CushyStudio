import { observer } from 'mobx-react-lite'

import { CushyAppL } from 'src/models/CushyApp'

export const PublishAppBtnUI = observer(function PublishAppBtnUI_(p: { app: CushyAppL }) {
    const app = p.app
    const st = app.st
    if (!app.canBePublishedByUser) return null
    return (
        <div
            tw='btn btn-accent btn-xs'
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
        >
            {app.isPublishing ? <div tw='loading' /> : <span className='material-symbols-outlined'>publish</span>}
            Publish
        </div>
    )
})
