import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { formatNum } from '../../csuite/utils/formatNum'
import { formatSize } from '../../csuite/utils/formatSize'
import { isOdd } from '../../csuite/utils/isOdd'
import { sum } from '../../csuite/utils/sum'
import { getDBStats } from '../getDBStats'

export const DBStatsUI = observer(function DBStats(p: {}) {
    const stats = getDBStats(cushy.db)

    const byCount = Object.entries(stats)
        .map(([k, v]) => ({ name: k, size: v.size, count: v.count }))
        .sort((a, b) => b.count - a.count)

    const bySize = Object.entries(stats)
        .map(([k, v]) => ({ name: k, size: v.size, count: v.count }))
        .sort((a, b) => b.size - a.size)

    const maxSize: number = bySize[0]?.size ?? 1
    const maxCount: number = byCount[0]?.count ?? 1
    return (
        <Frame>
            <div>total tables: {byCount.length} </div>
            <div>total size: {formatSize(sum(byCount.map((i) => i.size)))}</div>
            <div>total rows: {formatNum(sum(byCount.map((i) => i.count)))}</div>

            <Frame row tw='gap-2 wrap justify-center'>
                {[
                    { name: 'sorted by count', data: byCount },
                    { name: 'sorted by size', data: bySize },
                ].map(({ name, data }) => (
                    <Frame>
                        <h2 tw='mx-auto text-center'>{name}</h2>
                        <table tw='[&_td]:px-2 [&_td]:mx-2 [&_th]:px-2 border-separate border-spacing-x-2'>
                            <thead>
                                <tr>
                                    <th tw='text-right '>size</th>
                                    <th tw='text-right '>count</th>
                                    <th tw='text-left'>table name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(({ name, size, count }, ix, arr) => (
                                    <Frame
                                        as='tr'
                                        key={name}
                                        base={{
                                            contrast: isOdd(ix) ? 0.1 : 0.2,
                                            hue: (360 * ix) / arr.length,
                                        }}
                                    >
                                        <Frame as='td' tw='text-right font-mono relative'>
                                            <Frame
                                                tw='absolute top-0 bottom-0 left-0 z-0'
                                                style={{ width: `${(100 * size) / maxSize}%` }}
                                                base={{ chromaBlend: 3, contrast: 0.2 }}
                                            />
                                            <div tw='relative z-10'>{formatSize(size)}</div>
                                        </Frame>
                                        <Frame as='td' tw='text-right font-mono relative'>
                                            <Frame
                                                tw='absolute top-0 bottom-0 left-0 z-0'
                                                style={{ width: `${(100 * count) / maxCount}%` }}
                                                base={{ chromaBlend: 3, contrast: 0.2 }}
                                            ></Frame>
                                            <div tw='relative z-10'>{formatNum(count)}</div>
                                        </Frame>
                                        <Frame as='td'>{name}</Frame>
                                    </Frame>
                                ))}
                            </tbody>
                            {/* <pre>{JSON.stringify(stats, null, 2)}</pre> */}
                        </table>
                    </Frame>
                ))}
            </Frame>
        </Frame>
    )
})
