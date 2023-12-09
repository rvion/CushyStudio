import { UserResponse } from '@supabase/supabase-js'
import { STATE } from './state'
import { makeAutoObservable } from 'mobx'

export class AuthState {
    //
    userResponse: Maybe<UserResponse> = null

    constructor(public st: STATE) {
        //
        // this.updateCurrentUser()
        makeAutoObservable(this)
    }

    get isConnected() {
        return this.userResponse?.data.user != null
    }

    get email() {
        return this.userResponse?.data.user?.email
    }

    get avatar() {
        return this.userResponse?.data.user?.identities?.[0]?.identity_data?.avatar_url
    }

    get username() {
        // console.log(
        //     `[👙] this.userResponse?.data.user?.identities?.[0]?.identity_data`,
        //     JSON.stringify(this.userResponse?.data.user?.identities?.[0]?.identity_data, null, 4),
        // )
        return (
            this.userResponse?.data.user?.identities?.[0]?.identity_data?.user_name ??
            this.userResponse?.data.user?.email ??
            this.userResponse?.data.user?.id
        )
    }

    updateCurrentUser = async () => {
        const res = await this.st.supabase.auth.getUser()
        this.userResponse = res
    }
}
