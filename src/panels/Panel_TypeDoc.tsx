import { CUSHY_PORT } from '../state/PORT'

export const Panel_TypeDoc = obs(function Panel_TypeDoc_(p: {}) {
   return (
      <iframe //
         className='size-full'
         src={`http://localhost:${CUSHY_PORT}/library/_doc/index.html`}
         frameBorder='0'
      />
   )
})
