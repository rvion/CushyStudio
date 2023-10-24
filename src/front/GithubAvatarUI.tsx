import { useSt } from './FrontStateCtx'
import { GithubUser, asGithubUserName } from './githubUtils'

export function GithubUserUI(p: {
    //
    username: string
    size?: string
    /** defaults to false */
    showName?: boolean
}) {
    const st = useSt()
    const { username } = p
    const size = p.size ?? '1.5rem'
    const ghuser = GithubUser.get(st, asGithubUserName(username))

    try {
        return (
            <div tw='flex items-center gap-1 italic text-gray-400'>
                <img
                    style={{ borderRadius: '100%', height: size, width: size }}
                    src={ghuser.localAvatarURL}
                    alt={`${username}'s avatar`}
                    width='100'
                />
                {p.showName && <p tw='text-xl'>{username}</p>}
            </div>
        )
    } catch (error) {
        console.error(error)
        return username
    }
}

// Usage:
// <GithubUser username="octocat" />
