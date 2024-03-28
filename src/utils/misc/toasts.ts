import { useMemo } from 'react'
import { toast, ToastPosition } from 'react-toastify'

const position: ToastPosition = 'bottom-right'
export const toastSuccess = (msg: string) => void toast(msg, { type: 'success', position })
export const toastInfo = (msg: string) => void toast(msg, { type: 'info', position })
export const toastError = (msg: string) => void toast(msg, { type: 'error', position })

useMemo
