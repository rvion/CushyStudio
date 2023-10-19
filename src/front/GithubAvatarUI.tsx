import React, { useState, useEffect } from 'react'

export function GithubUserUI(p: {
    //
    username: string
    size?: string
    /** defaults to false */
    showName?: boolean
}) {
    const [userData, setUserData] = useState(null)
    const { username } = p
    const size = p.size ?? '1.5rem'
    useEffect(() => {
        if (username) {
            fetch(`https://api.github.com/users/${username}`)
                .then((response) => {
                    if (response.ok) return response.json()
                    else throw new Error('Failed to fetch user data')
                })
                .then((data) => setUserData(data))
                .catch((error) => console.error(error))
        }
    }, [username])

    if (!userData) return username

    try {
        return (
            <div tw='flex items-center gap-2 italic text-gray-400'>
                <img
                    style={{ borderRadius: '100%', height: size, width: size }}
                    src={(userData as any).avatar_url}
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
