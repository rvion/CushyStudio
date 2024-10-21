import { observer } from 'mobx-react-lite'

/**
 * this container is used to wrap the list of values in their dense inline form.
 * it is used inline
 */
export const SelectValueContainerUI = observer(function SelectValueContainerUI_(p: {
    //
    wrap?: Maybe<boolean | 'no-wrap-no-overflow-hidden'>
    children?: React.ReactNode
}) {
    return (
        <div
            tw={[
                'lh-input-2 flex flex-grow items-center gap-0.5 ',
                p.wrap === 'no-wrap-no-overflow-hidden' //
                    ? ''
                    : p.wrap === true
                      ? 'flex-wrap'
                      : 'line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap',
            ]}
        >
            {p.children}
        </div>
    )
})
