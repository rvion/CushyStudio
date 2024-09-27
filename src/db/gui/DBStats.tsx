import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { formatNum } from '../../csuite/utils/formatNum'
import { formatSize } from '../../csuite/utils/formatSize'
import { isOdd } from '../../csuite/utils/isOdd'
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
            <h1>Stats</h1>

            <h2>Misc</h2>
            <div>{byCount.length} tables</div>

            {[
                //
                { name: 'by count', data: byCount },
                { name: 'by size', data: bySize },
            ].map(({ name, data }) => (
                <Frame tw='mx-auto'>
                    <h2>{name}</h2>
                    <table tw='[&_td]:px-2 [&_td]:mx-2 [&_th]:px-2'>
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
                                            tw='absolute top-0 bottom-0 left-0'
                                            style={{ width: `${(100 * size) / maxSize}%` }}
                                            base={{ chromaBlend: 3, contrast: 0.2 }}
                                        ></Frame>
                                        {formatSize(size)}
                                    </Frame>
                                    <Frame as='td' tw='text-right font-mono relative'>
                                        <Frame
                                            tw='absolute top-0 bottom-0 left-0'
                                            style={{ width: `${(100 * count) / maxCount}%` }}
                                            base={{ chromaBlend: 3, contrast: 0.2 }}
                                        ></Frame>
                                        {formatNum(count)}
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
    )
})
