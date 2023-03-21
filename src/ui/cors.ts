import { fetch } from '@tauri-apps/api/http'

export const testCors = async () => {
    console.log('AA')
    try {
        const response = await fetch('http://192.168.1.20:8188/object_info', {
            method: 'GET',
            timeout: 30,
        })

        console.log('BB', response)
    } catch (error) {
        console.log('CC', error)
    }
}
