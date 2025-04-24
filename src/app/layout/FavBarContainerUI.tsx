// Could give this an option be collapsible in the future?
/** Re-usable container to keep a consistent style around groups of buttons */
export const FavBarContainerUI = obs(function FavBarContainerUI_(p: React.HTMLProps<HTMLDivElement>) {
   return (
      <div // Favorite app container
         tw={[
            //
            'flex w-full flex-col rounded',
            'items-center  justify-center gap-1 p-1 text-center',
         ]}
         {...p}
      />
   )
})
