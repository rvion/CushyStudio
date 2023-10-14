import React, { useState, useEffect } from 'react'

export function GithubUserUI({ username }: { username: string }) {
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        if (username) {
            fetch(`https://api.github.com/users/${username}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Failed to fetch user data')
                    }
                })
                .then((data) => {
                    setUserData(data)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [username])

    if (!userData) {
        return username
        // return <div>Loading...</div>
    }

    try {
        return (
            <div tw='flex items-center gap-2 italic text-gray-400'>
                by
                <img
                    style={{ borderRadius: '100%', height: '1.5rem', width: '1.5rem' }}
                    src={(userData as any).avatar_url}
                    alt={`${username}'s avatar`}
                    width='100'
                />
                <p tw='text-xl'>{username}</p>
            </div>
        )
    } catch (error) {
        console.error(error)
        return username
    }
}

// Usage:
// <GithubUser username="octocat" />
