import type { STATE } from './state'
import type { Session, User } from '@supabase/supabase-js'
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient'
import type { LiveTable } from 'src/db/LiveTable'
import type { AuthL } from 'src/models/Auth'

import { makeAutoObservable, runInAction } from 'mobx'

import { logger } from './logfile'
import { asAuthID, Auth_C, AuthT } from 'src/db/TYPES.gen'

export class AuthState {
    cleanup: Maybe<() => void> = null
    constructor(public st: STATE) {
        this.auth = this.st.supabase.auth
        makeAutoObservable(this)
        void this.tryToRestoreAuthFromDB()
        const x = this.auth.onAuthStateChange((event, session) => {
            logger.info(`[🔑 AUTH] 🟢 received ${event}`)
            // logger.info(`[🔑 AUTH] 🚂🚂🚂: ${event}`, session)
            if (session != null) this.storeSessionInfoInDB(session)
        })
        this.cleanup = x.data.subscription.unsubscribe
    }

    /** parsed jwt */
    user: Maybe<User> = null

    session: Maybe<Session> = null

    auth: SupabaseAuthClient

    get authTable(): LiveTable<AuthT, Auth_C, AuthL> {
        return this.st.db.auths
    }

    get isConnected() {
        return this.user != null
    }

    get email() {
        return this.user?.email
    }

    get avatar() {
        return this.user?.identities?.[0]?.identity_data?.avatar_url
    }

    get username(): string {
        return (
            this.user?.identities?.[0]?.identity_data?.user_name ?? //
            this.user?.email ??
            this.user?.id ??
            'anonymous'
        )
    }

    logout = async () => {
        logger.info(`[🔑 AUTH] logging out...`)
        await this.auth.signOut()
        this.user = null
        this.session = null
        this.authTable.delete(asAuthID('current'))
    }

    tryToRestoreAuthFromDB = async () => {
        logger.info(`[🔑 AUTH] restoring session from DB...`)
        const prevAuth = this.st.db.auths.get(asAuthID('current'))
        if (prevAuth == null) return
        await this.authFrom({
            access_token: prevAuth.data.access_token!,
            refresh_token: prevAuth.data.refresh_token!,
        })
    }

    get cushyPort(): number {
        const mode = process.env['CUSHY_RUN_MODE']
        if (mode == null) throw new Error('CUSHY_RUN_MODE is not defined')
        const allowedModes = ['dev', 'dist']
        if (!allowedModes.includes(mode)) {
            console.error(`CUSHY_RUN_MODE is not allowed: ${mode}`)
            process.exit(1)
        }
        const PORT = mode === 'dist' ? 8688 : 8788
        return PORT
    }

    __testCB = () => {
        this.st.layout.FOCUS_OR_CREATE('IFrame', {
            url: `http://localhost:${this.cushyPort}/public/auth/cb_test.html`,
            name: 'test 1',
        })
        this.st.layout.FOCUS_OR_CREATE('IFrame', { url: `http://localhost:${this.cushyPort}/auth/cb_test.html`, name: 'test 2' })
    }
    startLoginFlowWithGithub = async () => {
        logger.info(`[🔑 AUTH] starting login flow...`)
        let { data, error } = await this.st.supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                skipBrowserRedirect: true,
                redirectTo: `http://localhost:${this.cushyPort}/auth/cb.html`,
                queryParams: {
                    prompt: 'login',
                    // prompt: 'select_account', for google
                },
            },
        })
        if (data.url == null) {
            logger.error(`[🔑 AUTH] ❌ invalid auth url; aborting`)
            return null
        }
        // this.layout.FOCUS_OR_CREATE('IFrame', { url: data.url })
        const win = window.open(
            data.url,
            '_blank',
            ['nodeIntegration=no'].join(','),
            // 'top=500',
            // 'left=200',
            // 'frame=false',
        )

        // subscribe to window page (location) change
        win?.addEventListener('message', async (event) => {
            logger.info(`[🔑 AUTH] 🟢 callback received from sub-window...`)
            // 1. extract href
            console.log(`[👙]`, event)
            const data = event.data as { pageHref: string }
            const pageref = data.pageHref
            console.log(`[👙]`, data.pageHref)

            // 2. parse callback to extract tokens
            const queryParams = new URL(pageref.replace('#', '?')).searchParams
            const payload = {
                expires_at: queryParams.get('expires_at'),
                expires_in: queryParams.get('expires_in'),
                provider_token: queryParams.get('provider_token'),
                refresh_token: queryParams.get('refresh_token'),
                token_type: queryParams.get('token_type'),
                access_token: queryParams.get('access_token'),
            }

            // 3. ensure access_token & refresh_token are there
            console.log(`[👙] event:`, payload)
            if (payload.access_token == null) throw new Error(`[🔑 AUTH] ❌ failure: payload.access_token is null`)
            if (payload.refresh_token == null) throw new Error(`[🔑 AUTH] ❌ failure: payload.refresh_token is null`)

            // 4. auth
            await this.authFrom({
                access_token: payload.access_token!,
                refresh_token: payload.refresh_token!,
            })
        })
    }

    authFrom = async (p: {
        //
        access_token: string
        refresh_token: string
    }) => {
        logger.info(`[🔑 AUTH] setting session to`, p)
        // manually login with the given payload
        const auth = await this.auth.setSession({
            access_token: p.access_token!,
            refresh_token: p.refresh_token!,
        })

        logger.info(`[🔑 AUTH] auth result:` /* auth */)
        if (auth.error) {
            logger.error(`[🔑 AUTH] ❌ failure: ${auth.error}`)
            console.error(`[🔑 AUTH] ❌ failure`, auth.error)
            return
        }

        const user: Maybe<User> = auth.data.user
        const session: Maybe<Session> = auth.data.session

        if (user == null) throw new Error(`[🔑 AUTH] ❌ failure: user is null`)
        if (session == null) throw new Error(`[🔑 AUTH] ❌ failure: session is null`)

        // console.log(`[🔑 AUTH] 🟢 success.`) //, session)

        // ⏸️ const prev = deepCopyNaive(this.st.db.auths.get(asAuthID('current'))?.data)

        runInAction(() => {
            this.storeSessionInfoInDB(session)
            this.user = auth.data.user
            this.session = auth.data.session
        })
    }

    storeSessionInfoInDB = (session: Session) => {
        const payload: Omit<AuthT, 'createdAt' | 'updatedAt'> = {
            id: asAuthID('current'),
        }
        if (session.access_token) payload.access_token = session.access_token
        if (session.expires_at) payload.expires_at = session.expires_at
        if (session.expires_in) payload.expires_in = session.expires_in
        if (session.provider_refresh_token) payload.provider_refresh_token = session.provider_refresh_token
        if (session.provider_token) payload.provider_token = session.provider_token
        if (session.refresh_token) payload.refresh_token = session.refresh_token
        if (session.token_type) payload.token_type = session.token_type
        this.authTable.upsert(payload)
        // logger.info(`[🔑 AUTH] ✅ auth saved to DB` /* payload */)
    }
}
