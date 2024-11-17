import type { CushyAppL } from '../../models/CushyApp'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { CreateAppPopupUI } from '../../panels/PanelWelcome/CreateAppBtnUI'
import { useSt } from '../../state/stateContext'

// Could give this an option be collapsible in the future?
/** Re-usable container to keep a consistent style around groups of buttons */
const FavBarContainer = observer(function FavBarContainer_(p: { children?: ReactNode }) {
   return (
      <div // Favorite app container
         tw={[
            //
            'flex w-full flex-col rounded',
            'items-center  justify-center gap-1 p-1 text-center',
         ]}
      >
         {p.children}
      </div>
   )
})

export const FavBarUI = observer(function FavBarUI_(p: {
   //
   direction?: 'row' | 'column'
}) {
   const st = useSt()
   const conf = st.preferences.interface.value.favBar
   // 💬 2024-09-29 rvion:
   // | temporarilly always display the favbar
   // |
   // |> if (!conf.visible) return null

   const size = conf.size
   const appIcons = conf.appIcons
   const sizeStr = size + 'px'
   const tempSize = `${size}px`

   const ree = ['1', '2', '3', '4', '5', '6', '1', '2', '3', '4', '5', '6', '1', '2', '3', '4', '5', '6']
   return (
      <>
         <Frame //
            base={cushy.theme.value.appbar ?? { contrast: -0.077 }}
            tw='flex overflow-auto px-1'
            // style={{ width: `${size + 20}px` }}
         >
            <Frame //
               base={{ contrast: -0.1 }}
               tw='flex flex-1 flex-grow flex-col overflow-auto p-1 '
               roundness={'5px'}
            >
               {/* <PanelHeaderUI>{conf.renderAsConfigBtn()}</PanelHeaderUI> */}
               <Button
                  //
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center'
                  tooltip='SD1.5'
                  base={{ hue: 0, chromaBlend: 2, contrast: 0.3 }}
                  style={{ width: tempSize, height: tempSize }}
                  onClick={() =>
                     cushy.db.cushy_app.get('library/built-in/SD15/cushySD15.ts:0')?.openLastOrCreateDraft()
                  }
               >
                  <span tw='truncate'>SD1.5</span>
               </Button>
               <Button
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center'
                  tooltip='SDXL'
                  base={{ hue: 90, chromaBlend: 2, contrast: 0.3 }}
                  style={{ width: tempSize, height: tempSize }}
                  onClick={() =>
                     cushy.db.cushy_app.get('library/built-in/SDXL/cushySDXL.tsx:0')?.openLastOrCreateDraft()
                  }
               >
                  <span tw='truncate'>SDXL</span>
               </Button>
               {/* <AppIllustrationUI //
                        // className={'!rounded-none'}
                        size={tempSize}
                        app={cushy.db.cushy_app.get('library/built-in/SDXL/cushySDXL.tsx:1')}
                    /> */}
               <Button
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center'
                  tooltip='NoobAI'
                  base={{ hue: 90, chromaBlend: 2, contrast: 0.3 }}
                  style={{
                     width: tempSize,
                     height: tempSize,
                     background: `url(${cushy.db.cushy_app.get('library/built-in/SDXL/cushySDXL.tsx:1')?.illustrationPathWithFileProtocol})`,
                     backgroundSize: 'cover',
                     textShadow: '0 1px 10px black',
                     fontWeight: 'bold',
                     color: 'white',
                     fontSize: '1rem',
                  }}
                  onClick={() =>
                     cushy.db.cushy_app.get('library/built-in/SDXL/cushySDXL.tsx:1')?.openLastOrCreateDraft()
                  }
               >
                  <span tw='truncate'>NoobAI</span>
               </Button>
               <Button
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center'
                  tooltip='SD3'
                  base={{ hue: 180, chromaBlend: 2, contrast: 0.3 }}
                  style={{ width: tempSize, height: tempSize }}
                  onClick={() =>
                     cushy.db.cushy_app.get('library/built-in/SD3/cushySD3.ts:0')?.openLastOrCreateDraft()
                  }
               >
                  <span tw='truncate'>SD3</span>
               </Button>
               <Button
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center truncate'
                  tooltip='Cascade'
                  base={{ hue: 210, chromaBlend: 2, contrast: 0.3 }}
                  style={{ width: tempSize, height: tempSize }}
                  onClick={() => cushy.db.cushy_app.get('library/built-in/Cascade/cushyCascade.ts:0')?.openLastOrCreateDraft()} // prettier-ignore
               >
                  <span tw='truncate'>Cascade</span>
               </Button>
               <Button
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center'
                  tooltip='FLUX'
                  base={{ hue: 270, chromaBlend: 2, contrast: 0.3 }}
                  style={{ width: tempSize, height: tempSize }}
                  onClick={() =>
                     cushy.db.cushy_app.get('library/built-in/Flux/cushyFlux.ts:0')?.openLastOrCreateDraft()
                  }
               >
                  <span tw='truncate'>FLUX</span>
               </Button>
               <Button
                  tooltip='Slay the Spire Card Generator'
                  tw='my-0.5 flex flex-shrink-0 items-center justify-center self-center'
                  base={{ hue: 270, chromaBlend: 2, contrast: 0.3 }}
                  style={{ width: tempSize, height: tempSize }}
                  onClick={() =>
                     cushy.db.cushy_app
                        .get('library/built-in/sts/slay-the-spire.ts:0')
                        ?.openLastOrCreateDraft()
                  }
               >
                  <span tw='truncate'>StS</span>
               </Button>
               <RevealUI
                  tw='my-0.5 self-center hover:brightness-125'
                  placement='screen-top'
                  UNSAFE_cloned={true}
                  shell='popup-lg'
                  content={(x) => <CreateAppPopupUI closeFn={() => x.reveal.close()} />}
               >
                  <Button
                     square
                     style={{ width: tempSize, height: tempSize, fontSize: sizeStr }}
                     tw='flex-shrink-0 content-center items-center'
                     icon='mdiPlus'
                     iconSize={tempSize}
                  />
               </RevealUI>
               {/* Lot of divs, but it makes it so the scrolling container is rounded on the inside. */}

               {/* ------------------------------------------------------------------------ */}
               {st.favoriteApps.length > 0 && (
                  <>
                     {st.favoriteApps.map((app) => (
                        <Frame
                           border={20}
                           tooltip={app.name}
                           roundness={cushy.theme.value.inputRoundness}
                           key={app.id}
                           style={{ width: tempSize, height: tempSize }}
                           tw='flex overflow-clip object-contain'
                        >
                           <RevealUI
                              // showDelay={0}
                              trigger='click'
                              placement='right'
                              content={() => <AppDraftsQuickListUI app={app} />}
                              shell='popover'
                           >
                              <AppIllustrationUI //
                                 className={'!rounded-none'}
                                 app={app}
                              />
                           </RevealUI>
                        </Frame>
                     ))}
                  </>
               )}
               {/* ------------------------------------------------------------------------ */}
            </Frame>
         </Frame>
      </>
   )
})

export const AppDraftsQuickListUI = observer(function AppDraftsQuickListUI_(p: { app: CushyAppL }) {
   const app = p.app

   const [filterText, setFilterText] = useState<string>('')

   const filteredApps =
      filterText === ''
         ? app.drafts
         : app.drafts.filter((draft) => {
              return draft.name.toLowerCase().indexOf(filterText) != -1
           })
   return (
      <>
         <Frame tw='flex w-full flex-1 flex-grow' line>
            <Button
               tw={[app.isFavorite ? '!text-yellow-500' : null, '!peer-hover:text-red-500']}
               onClick={() => app.setFavorite(!app.isFavorite)}
               icon='mdiStar'
               square
            />
            <span tw='flex-grow truncate text-center'>{app.name}</span>
            <Button //
               onClick={() => app.createDraft()}
               icon='mdiPlus'
               square
            />
         </Frame>
         <Frame tw='flex max-w-md flex-col gap-1'>
            {app.description ? (
               <div //Description
                  tw='flex-1 rounded p-1 text-sm italic'
               >
                  {app.description}
               </div>
            ) : null}
            <div //App Grid Container
               tw='flex-col rounded p-2'
            >
               <Frame line>
                  <InputStringUI
                     tw='csuite-basic-input w-full rounded-r-none'
                     setValue={(val) => {
                        setFilterText(val)
                     }}
                     getValue={() => filterText}
                     placeholder='Filter Drafts'
                  ></InputStringUI>
                  <Button icon='mdiCancel' onClick={(ev) => setFilterText('')}></Button>
               </Frame>
               <Frame //App Grid Container
                  base={{ contrast: -0.1 }}
                  tw='grid h-[20.5rem] grid-cols-3 gap-1 overflow-auto p-1'
               >
                  {filteredApps.map((draft) => (
                     <Button //
                        size='inside'
                        key={draft.id}
                     >
                        <div key={draft.id} onClick={() => draft.openOrFocusTab()}>
                           <div tw='flex justify-center self-center p-1 text-center'>
                              <DraftIllustrationUI size='7.77rem' draft={draft} />
                           </div>
                           <span tw='truncate text-center'>{draft.name}</span>
                        </div>
                     </Button>
                  ))}
               </Frame>
            </div>
         </Frame>
      </>
   )
})
