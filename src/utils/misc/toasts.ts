import { toast, ToastPosition } from 'react-toastify'

const position: ToastPosition = 'bottom-right'
export const toastSuccess = (msg: string) => toast(msg, { type: 'success', position })
export const toastInfo = (msg: string) => toast(msg, { type: 'info', position })
export const toastError = (msg: string) => {
    // console.log(`[❌] ${msg}`)
    toast(msg, { type: 'error', position })
}
