import { observer } from 'mobx-react-lite'

import { FormUI } from '../../csuite/form/FormUI'

/** This will allow devs to view re-usable forms once the form registering system is implemented */
export const PlaygroundRegisteredForms = observer(function PlaygroundRequirements_(p: {}) {
   return (
      <div tw='h-full p-1'>
         <div tw='border-primary/30 rounded  border p-1'>
            <div tw='w-full items-center text-center'>
               <p>Currently Unused</p>
            </div>
            <div tw='bg-neutral-content my-1 w-full rounded' style={{ height: '1px', minHeight: '1px' }} />
            {/* TODO: Should get a registered form by id and display it. */}
            <FormUI field={cushy.favbar} />
         </div>
      </div>
   )
})
