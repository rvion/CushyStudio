import type { STATE } from 'src/state/state'

import { nanoid } from 'nanoid'
import { useEffect } from 'react'

import { extractExtensionFromContentType } from './extractExtensionFromContentType'

export const useGlobalDropHook = (st: STATE) => {
    useEffect(() => {
        const fn = async (ev: DragEvent) => {
            console.log(`[🫳] DROP: ev`, ev)
            if (ev.dataTransfer == null) return null
            if (ev.target instanceof HTMLElement) {
                let at: Maybe<HTMLElement> = ev.target
                while ((at = at.parentElement) != null) {
                    if (at.classList.contains('_WidgetSelectImageUI')) return null
                    if (at.classList.contains('DROP_IMAGE_HANDLER')) return null
                }
            }

            // 0. DEBUG ---------------------------------------------------------------------------
            // Accessing the types property
            const types = ev.dataTransfer.types

            // List all the keys (types)
            console.log('[🫳] DROP:  | Available types on drop:', types)
            const store: {
                files?: FileList
                'text/uri-list'?: string
                'text/html'?: string
                'application/json'?: string
                url?: string
                image?: string
            } & Record<string, string> = {}
            // for (const type of types) {
            //     // Get the data for each type
            //     const data = ev.dataTransfer.getData(type)
            //     store[type] = data
            //     // const data2 = ev.dataTransfer.getData(type)
            //     console.log(`[🫳] DROP:  | Data for type '${type}':`, data.length, data)
            //     // console.log(`[🫳] DROP:  | Data for type '${type}':`, data2)
            // }
            store['files'] = ev.dataTransfer.files
            store['text/uri-list'] = ev.dataTransfer.getData('text/uri-list')
            store['url'] = ev.dataTransfer.getData('url')
            store['text/html'] = ev.dataTransfer.getData('text/html')
            store['image'] = ev.dataTransfer.getData('image')
            store['application/json'] = ev.dataTransfer.getData('application/json')

            console.log(`[🫳] DROP:`, store)

            const files: File[] = []

            // TRY to get image from html -------------------------------------------------------
            const html = store['text/html']
            console.log(`[🫳] DROP: B. (text/html)`, html)
            const url2 = extractImgFromHTML(html)
            if (url2) files.push(await downloadURLToFile(url2))
            else {
                // TRY to get image from url --------------------------------------------------------
                const url1 = store['url']
                console.log(`[🫳] DROP: A. (url)`, url1)
                if (url1) files.push(await downloadURLToFile(url1))
            }

            // 3. TRY to get image from file ------------------------------------------------------
            const file3 = store['files'][0]
            if (file3) files.push(file3)

            ev.preventDefault()
            // ------------------------------------------------------------------------------------
            st.droppedFiles.push(...files)
            st.layout.FOCUS_OR_CREATE('Import', {})
        }

        document.body.ondrop = fn
        return () => {
            document.body.ondrop = null
        }
    })
}

const downloadURLToFile = async (url: string): Promise<File> => {
    const response = await fetch(url)
    const fileType = response.headers.get('content-type')

    const data = await response.blob()
    const fileName = nanoid() + extractExtensionFromContentType(fileType ?? data.type)
    const file1 = new File([data], fileName /*url*/, { type: data.type })
    console.log(`[🫳] DROP:    | downloadURLToFile:`, fileName, fileType, data.type)
    return file1
}

const extractImgFromHTML = (html: Maybe<string>) => {
    if (html == null) return null
    const url = html.match(/<img.*?src="(.*?)"/)
    console.log(`[🫳] DROP:    | extractImgFromHTML:`, url)
    return url?.[1] ?? null
}
