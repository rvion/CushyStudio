import { toast, ToastPosition } from 'react-toastify'

import { Trigger } from '../trigger/Trigger'

const position: ToastPosition = 'bottom-right'
export const toastSuccess = (msg: string) => {
    toast(msg, { type: 'success', position })
    return Trigger.UNMATCHED
}
export const toastInfo = (msg: string) => {
    toast(msg, { type: 'info', position })
    return Trigger.UNMATCHED
}
export const toastError = (msg: string) => {
    toast(msg, { type: 'error', position })
    return Trigger.UNMATCHED
}

// Function to show toast with an image
export const toastImage = (imageSrc: string | Buffer, message: string) => {
    const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.toString('base64')
    console.log(src)
    const CustomToast = () => (
        <div tw='flex flex-col aspect-square'>
            <img
                tw='object-contain bg-black rounded'
                src={`${src}`}
                alt='Toast Image'
                style={{ width: '256px', height: '256px' }}
            />
            <p>{message}</p>
        </div>
    )

    toast(<CustomToast />, {
        position: 'bottom-right',
        pauseOnFocusLoss: false,
    })
}
