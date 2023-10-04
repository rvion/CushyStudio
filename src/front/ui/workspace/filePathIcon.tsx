export const getIconForFilePath = (filePath: string) => {
    if (filePath.endsWith('.ts')) return <span className='text-blue-600 material-symbols-outlined'>code</span>
    if (filePath.endsWith('.png')) return <span className='text-red-600 material-symbols-outlined'>image</span>
    if (filePath.endsWith('.json')) return <span className='text-yellow-600 material-symbols-outlined'>all_out</span>
    if (filePath.endsWith('.txt')) return <span className='text-yellow-600 material-symbols-outlined'>text_fields</span>
    return <span className='text-gray-500'>❓</span>
}
