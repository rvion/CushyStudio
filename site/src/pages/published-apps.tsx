import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import type { Database } from '../../../src/supa/database.types'

import Layout from '@theme/Layout'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { cachePromise } from '../utils/cached'
import { getSupabase } from '../utils/getSupabase'

export default observer(function Hello() {
    const supa = getSupabase()
    const library = useMemo(() => new Foo(supa), [supa])
    // const
    return (
        <Layout title='Hello' description='Hello React Page'>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '20px',
                }}
            >
                <div>
                    <div>Published apps: </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {library.allPublishedApps?.data?.map((x) => (
                            <div
                                //
                                key={x.app_id}
                                style={{ border: '1px solid blue', padding: '1rem' }}
                            >
                                {x.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
})

class Foo {
    constructor(public supa: ReturnType<typeof getSupabase>) {
        makeAutoObservable(this)
    }

    get allPublishedApps(): Maybe<PostgrestSingleResponse<Database['public']['Tables']['published_apps']['Row'][]>> {
        const x = cachePromise('all-published-apps', async () => {
            console.log(`[🔥] fetching all published CushyApps`)
            const x = await this.supa.from('published_apps').select('*')
            return x
        }).current
        return x
    }
}

declare type Maybe<T> = T | null | undefined
