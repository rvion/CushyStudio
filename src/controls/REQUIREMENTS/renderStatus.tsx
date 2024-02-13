import { PluginInstallStatus } from './PluginInstallStatus'

export const renderStatus = (status: PluginInstallStatus, optional: boolean) => {
    if (status === 'installed') return <span tw='text-green-500'>Installed</span>
    if (status === 'not-installed') {
        if (optional) return <span tw='text-yellow-500'>optional</span>
        return <span tw='text-red-500'>Required</span>
    }
    if (status === 'update-available') return <span tw='text-yellow-500'>Update Available</span>
    if (status === 'unknown') return <span tw='text-gray-500'>Unknown</span>
    if (status === 'error') return <span tw='text-red-500'>❌ Error (a)</span>
    return <span tw='text-red-500'>❌ Error (b)</span>
}
