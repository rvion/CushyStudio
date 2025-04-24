import type { ToastContent, ToastOptions, ToastPosition } from 'react-toastify'

import { toast } from 'react-toastify'

import { Trigger } from '../trigger/Trigger'

const position: ToastPosition = 'bottom-right'
export const toastSuccess = (content: ToastContent<unknown>, opts?: ToastOptions): Trigger => {
   toast(content, { type: 'success', position, ...opts })
   return Trigger.UNMATCHED
}
export const toastInfo = (content: ToastContent<unknown>, opts?: ToastOptions): Trigger => {
   toast(content, { type: 'info', position, ...opts })
   return Trigger.UNMATCHED
}
export const toastError = (content: ToastContent<unknown>, opts?: ToastOptions): Trigger => {
   toast(content, { type: 'error', position, ...opts })
   return Trigger.UNMATCHED
}

// Function to show toast with an image
export const toastImage = (imageSrc: string | Buffer, message: string): void => {
   const src = typeof imageSrc === 'string' ? imageSrc : imageSrc.toString('base64')
   console.log(src)
   const CustomToast = (): React.JSX.Element => (
      <div tw='flex aspect-square flex-col'>
         <img
            tw='rounded bg-black object-contain'
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
