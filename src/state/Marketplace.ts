import type { STATE } from './state'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { Database } from 'src/supa/database.types'

import { makeAutoObservable } from 'mobx'

import { Debounced } from 'src/utils/misc/Debounced'
import { Kwery } from 'src/utils/misc/Kwery'

type SupaPublishedApp = Database['public']['Tables']['published_apps']['Row']
// type SupaUser = Database['auth']['Tables']['users']['Row']

export class Marketplace {
    constructor(public st: STATE) {
        makeAutoObservable(this)
    }

    query = new Debounced('', 300)
    selectedApp: Maybe<SupaPublishedApp> = null

    getUserInfoViaAuth = (user_id: string) => {}

    getUserInfoViaDB = (user_id: string) => 0
    // Kwery.get('getUserInfo', { user_id }, async () => {
    //     const x: PostgrestSingleResponse<SupaUser[]> = await this.st.supabase
    //         .schema('auth') //
    //         .from('users')
    //         .select('*')
    //         .eq('id', user_id)
    //     return x.data?.[0]
    // })

    publishedApps = () =>
        Kwery.get(
            'fetchAllPublishedApps',
            { q: this.query.debouncedValue },
            async (): Promise<PostgrestSingleResponse<SupaPublishedApp[]>> => {
                const x = await this.st.supabase //
                    .from('published_apps')
                    .select('*')
                    .filter('name', 'ilike', `%${this.query.debouncedValue}%`)
                    .limit(10)
                // this._allPublishedApps = x
                return x
            },
        )
}
