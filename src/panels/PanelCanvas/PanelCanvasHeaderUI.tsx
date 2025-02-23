import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { ToggleButtonUI } from '../../csuite/checkbox/InputBoolToggleButtonUI'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { InputNumberUI } from '../../csuite/input-number/InputNumberUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { useUnifiedCanvas } from './states/UnifiedCanvasCtx'

export const PanelCanvasHeaderUI = observer(function PanelCanvasHeaderUI_(p: {}) {
   const canvas = useUnifiedCanvas()
   return (
      <PanelHeaderUI tw='grid grid-cols-[1fr_1fr_1fr]'>
         <div tw='flex gap-2'>
            <div // TODO(bird_d): Needs Joinable
               tw='flex'
            >
               {/* <Button
                onClick={() => cushy.activityManager.startFromClass(UCAGenerate, canvas)}
                children='test'
                icon={IKONS.mdiAbTesting}
            /> */}
               <InputNumberUI //
                  text='Brush Size'
                  mode='int'
                  value={canvas.maskToolSize}
                  onValueChange={(next) => (canvas.maskToolSize = next)}
                  min={1}
                  max={1000}
                  suffix='px'
                  step={10}
               />
               <ToggleButtonUI //
                  toggleGroup='canvas'
                  value={canvas.usePenPressure}
                  onValueChange={() => (canvas.usePenPressure = !canvas.usePenPressure)}
                  icon={canvas.usePenPressure ? IKONS.mdiPencil : IKONS.mdiPencilOff}
                  tooltip='(Not implemented) Whether or not pressure affects the radius size of a brush stroke'
               />
            </div>
            <div // TODO(bird_d): Should be a joined container thing
               tw='flex'
            >
               <Button //
                  square
                  icon={IKONS.mdiUndo}
                  tooltip='Undo'
                  disabled={!canvas.canUndo}
                  onClick={() => canvas.undo()}
               />
               <Button
                  square
                  disabled={!canvas.canRedo}
                  icon={IKONS.mdiRedo}
                  tooltip='Redo (Not implemented)'
                  onClick={() => canvas.redo()}
               />
            </div>
         </div>
         <div tw='flex items-center justify-center'>
            <InputNumberUI // TODO: This should be a menu that pops up a form that allows you to choose different snapping methods, possibly.
               mode='int'
               min={2}
               softMin={8}
               step={4}
               onValueChange={(next) => (canvas.snapSize = next)}
               suffix='px'
               value={canvas.snapSize}
               text='Grid Snapping'
            />
            <ToggleButtonUI
               toggleGroup='canvas'
               icon={canvas.snapToGrid ? IKONS.mdiMagnetOn : IKONS.mdiMagnet}
               value={canvas.snapToGrid}
               onValueChange={(v) => {
                  canvas.snapToGrid = !canvas.snapToGrid
               }}
               tooltip='Enable Snapping'
            />
         </div>
         <div tw='flex items-end justify-end'>
            <ToggleButtonUI
               toggleGroup='canvas'
               value={canvas.enableOverlay}
               onValueChange={(_) => (canvas.enableOverlay = !canvas.enableOverlay)}
               icon={canvas.enableOverlay ? IKONS.mdiDrawing : IKONS.mdiDrawingBox}
               tooltip={'(Not Implemented) Show Canvas Overlays'}
            />
            <Dropdown
               title=''
               startIcon={IKONS.mdiChevronDown}
               content={() => (
                  <
                     //
                  >
                     <InputNumberUI mode='int' text='Mask Opacity' onValueChange={() => {}} />
                  </>
               )}
            ></Dropdown>
         </div>
      </PanelHeaderUI>
   )
})
