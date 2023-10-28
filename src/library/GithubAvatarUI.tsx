import { useSt } from '../front/FrontStateCtx'
import { GithubUser, GithubUserName, asGithubUserName } from './githubUtils'

export function GithubUserUI(p: {
    //
    username: GithubUserName
    size?: string
    showName?: boolean | 'after'
    className?: string
    textClassName?: string
}) {
    const st = useSt()
    const { username } = p
    const size = p.size ?? '1.5rem'

    const textClassName = p.textClassName ?? 'text-xl'
    const imgURL =
        username === 'CushyStudio' //
            ? '/CushyLogo-512.png'
            : GithubUser.get(st, asGithubUserName(username), false).localAvatarURL
    try {
        return (
            <div className={p.className} tw='flex items-center gap-1 italic text-gray-400'>
                {p.showName === 'after' && <p className={textClassName}>{username}</p>}
                <img
                    style={{ borderRadius: '100%', height: size, width: size }}
                    src={imgURL}
                    alt={`${username}'s avatar`}
                    width='100'
                />
                {p.showName === true && <p className={textClassName}>{username}</p>}
            </div>
        )
    } catch (error) {
        console.error(error)
        return username
    }
}

// Usage:
// <GithubUser username="octocat" />
