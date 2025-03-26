/** 📝 This needs to be a .tsx file */

export const MyCustomComponent2 = obs(function (p: { text: string }) {
   return (
      <div className='flex flex-col gap-2 p-2'>
         <div>
            <div tw='inline-block animate-spin'>{p.text}</div>
         </div>
      </div>
   )
})
