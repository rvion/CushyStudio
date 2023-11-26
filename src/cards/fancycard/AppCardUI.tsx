import { observer } from 'mobx-react-lite'

import { Tag } from 'src/rsuite/shims'
import { LibraryFile } from '../CardFile'
import { Package } from '../Pkg'

import { ActionFavoriteBtnUI } from '../CardPicker2UI'
import { GithubUserUI } from '../GithubAvatarUI'
import { AppIllustrationUI } from './AppIllustrationUI'
import { useSt } from 'src/state/stateContext'

export const AppCardUI = observer(function FancyCardUI_(p: {
    //
    deck: Package
    card: LibraryFile
    active?: boolean
}) {
    const card = p.card
    const st = useSt()
    // const importedFrom
    // prettier-ignore
    const color = (() => {
        const tw='px-1 py-0.5 overflow-hidden text-ellipsis block whitespace-nowrap self-stretch'
        const maxWidth = undefined // st.library.imageSize
        if (card.absPath.endsWith('.ts'))   return <span tw={[tw, 'bg-primary text-primary-content']} style={{maxWidth}}>Cushy Action</span>
        if (card.absPath.endsWith('.json')) return <span tw={[tw, 'bg-secondary text-secondary-content']} style={{maxWidth}}>ComfyUI Workflow JSON</span>
        if (card.absPath.endsWith('.png'))  return <span tw={[tw, 'bg-accent text-accent-content']} style={{maxWidth}}>ComfyUI Workflow Image</span>
    })()

    return (
        <div
            onClick={p.card.openLastDraftAsCurrent}
            tw={[
                //
                'flex flex-col',
                'p-0.5 bg-base-300 text-base-content shadow-xl border border-neutral border-opacity-25',
                `card STYLE_A`,
                p.active ? 'active' : 'not-active',
                'cursor-pointer',
            ]}
        >
            <div tw='flex items-start flex-grow' style={{ fontSize: '1rem' }}>
                {st.library.showFavorites ? <ActionFavoriteBtnUI app={card} size={'1.5rem'} /> : null}
                <div
                    //
                    style={{ width: st.library.imageSize, height: '3rem' }}
                    tw='overflow-hidden overflow-ellipsis pt-1 font-bold'
                >
                    {card.displayName}
                </div>
            </div>
            <div tw='flex'>
                <AppIllustrationUI card={card} size={st.library.imageSize} />
                {st.library.showDescription ? (
                    <div tw='flex-grow flex flex-col ml-1 w-44'>
                        <div>
                            {(card.manifest.categories ?? []).map((i, ix) => (
                                <Tag key={ix}>{i}</Tag>
                            ))}
                        </div>
                        <div style={{ height: '5rem' }} tw='m-1 flex-grow text-sm'>
                            {card.description}
                        </div>
                        <GithubUserUI
                            //
                            username={card.deck.githubUserName}
                            showName
                            size='1.2rem'
                        />
                    </div>
                ) : null}
            </div>
            {color}
        </div>
    )
})
