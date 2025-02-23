import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { Frame, type FrameProps } from '../csuite/frame/Frame'
import { InputStringUI } from '../csuite/input-string/InputStringUI'
import { RevealUI } from '../csuite/reveal/RevealUI'
import { perspectiveHelper } from '../router/perspectives/_PerspectiveBuilder'

export const PerspectivePickerUI = observer(function PerspectivePicker(p: FrameProps) {
   const perspectives = cushy.db.perspective.all
   return (
      <Frame tw='flex gap-1' {...p}>
         <Frame tw='flex gap-0.5' row>
            {perspectives.map((p) => (
               <RevealUI
                  key={p.id}
                  trigger={'rightClick'}
                  content={() => (
                     <>
                        <MenuItem
                           onClick={() =>
                              cushy.startActivity({
                                 backdrop: true,
                                 stopOnBackdropClick: true,
                                 UI: () => (
                                    <InputStringUI //
                                       getValue={() => p.data.name ?? '<untitled>'}
                                       setValue={(v) => p.update({ name: v })}
                                    />
                                 ),
                              })
                           }
                           icon={IKONS.mdiTagEdit}
                           label='Rename'
                        />
                        <MenuItem onClick={() => p.saveSnapshot()} icon={IKONS.mdiZipDisk} label='save' />
                        <MenuItem
                           onClick={() => p.resetToSnapshot()}
                           icon={IKONS.mdiLockReset}
                           label='Reset To Last Save'
                        />
                        <MenuItem
                           onClick={() => p.resetToDefault()}
                           icon={IKONS.mdiRestore}
                           label='Reset To Default'
                        />
                        <MenuItem onClick={() => p.duplicate()} icon={IKONS.mdiClipboard} label='Duplicate' />
                        <MenuItem onClick={() => p.delete()} icon={IKONS.mdiTrashCan} label='Delete' />
                     </>
                  )}
               >
                  <Button //
                     tw={[p.isActive ? '!rounded-b-none' : '!h-7 !min-h-0']}
                     base={{ contrast: p.isActive ? -0.1 : -0.0333 }}
                     hover={!p.isActive}
                     dropShadow={undefined}
                     borderless
                     look={p.isActive ? 'primary' : 'ghost'}
                     children={p.data.name ?? '<untitled>'}
                     onClick={() => p.open()}
                  />
               </RevealUI>
            ))}
         </Frame>
         <Button //
            icon={IKONS.mdiPlus}
            subtle
            borderless
            onClick={() =>
               cushy.db.perspective.getOrCreateWith(
                  `p${Date.now()}`,
                  cushy.layout.makeNewPerspective_default1,
               )
            }
         />
      </Frame>
   )
})

const PerspectiveTabUI = observer(function _PerspectiveTabUI(p: FrameProps) {
   return <></>
})
