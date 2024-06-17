import { toast, ToastPosition } from 'react-toastify'

const position: ToastPosition = 'bottom-right'
export const toastSuccess = (msg: string) => void toast(msg, { type: 'success', position })
export const toastInfo = (msg: string) => void toast(msg, { type: 'info', position })
export const toastError = (msg: string) => void toast(msg, { type: 'error', position })

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
