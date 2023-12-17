import { toast, ToastPosition } from 'react-toastify'

const position: ToastPosition = 'bottom-left'
export const toastInfo = (msg: string) => toast(msg, { type: 'info', position })
export const toastError = (msg: string) => toast(msg, { type: 'error', position })
