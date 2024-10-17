// TODO: switch to component
export function formatMenuLabel(
    //
    charIx: number | undefined,
    label: string,
): React.ReactNode {
    if (charIx == null) return label
    return (
        <div>
            <span>{label.slice(0, charIx)}</span>
            <span tw='underline text-red'>{label[charIx]}</span>
            <span>{label.slice(charIx + 1)}</span>
        </div>
    )
}
