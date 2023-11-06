import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from 'rsuite'
import { useSt } from 'src/widgets/FrontStateCtx'
import { GithubUserUI } from 'src/cards/GithubAvatarUI'
import { ErrorBoundaryFallback } from 'src/widgets/ui/utils/ErrorBoundary'
import { Deck } from './Deck'
import { ActionPackStatusUI } from './DeckStatusUI'
import { ActionPackStarsUI } from './DeckStarsUI'

export const MarketplaceUI = observer(function MarketplaceUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            <div tw='p-2'>
                <Button onClick={() => {}} appearance='ghost' color='green' tw='w-full self-start'>
                    Create action
                </Button>
            </div>
            {st.library.decks.map((actionPack) => (
                <ErrorBoundary key={actionPack.github} FallbackComponent={ErrorBoundaryFallback}>
                    <ActionPackUI key={actionPack.github} actionPack={actionPack} />
                </ErrorBoundary>
            ))}
        </div>
    )
})

export const ActionPackUI = observer(function ActionPackUI_(p: { actionPack: Deck }) {
    const pack = p.actionPack
    return (
        <div tw='cursor-pointer hover:bg-gray-700 p-2' key={pack.name} style={{ borderBottom: '1px solid #515151' }}>
            <div tw='flex  gap-2'>
                <div tw='flex-grow'>
                    <div tw='text-lg font-bold'>{pack.name}</div>
                    <GithubUserUI size='1.5rem' username={pack.githubUserName} showName />
                    <div tw='text-gray-400'>{pack.description}</div>
                </div>
                {pack.BUILT_IN ? null : <ActionPackStarsUI pack={pack} />}
            </div>
            <ActionPackStatusUI pack={pack} />
            {pack.installK.logs.length > 0 && (
                <div>
                    <pre>{JSON.stringify(pack.installK.logs)}</pre>
                </div>
            )}
        </div>
    )
})
