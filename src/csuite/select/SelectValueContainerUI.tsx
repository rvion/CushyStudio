import { observer } from 'mobx-react-lite'

/**
 * this container is used to wrap the list of values in their dense inline form.
 * it is used inline
 */
export const SelectValueContainerUI = observer(function SelectValueContainerUI_(p: {
    //
    wrap?: Maybe<boolean>
    children?: React.ReactNode
}) {
    return (
        <div
            tw={[
                'flex gap-0.5 flex-grow items-center lh-input-2 ',
                p.wrap //
                    ? 'flex-wrap'
                    : 'overflow-hidden line-clamp-1 text-ellipsis whitespace-nowrap',
            ]}
        >
            {p.children}
        </div>
    )
})
