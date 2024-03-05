import { defineWagon } from '../engine/WagonType'
import { locoTenants } from '../prefabs/_prefab_locoUtil1'
import { run_selectData, ui_selectData } from '../prefabs/_prefab_source'

export const wagon1 = defineWagon({
    uid: 'A5mzglXkoY',
    title: 'Mon premier wagon',
    ui: (ui) => {
        return {
            tenant: ui.selectOne({ choices: locoTenants }),
            title: ui.text({}),
            name: ui.string(),
            data: ui_selectData(ui),
            style: ui.selectOneV2(['bar', 'line']),
        }
    },
    run: (ui) => {
        const data = run_selectData(ui.data)

        return {
            title: { text: ui.title, left: 'left' },
            // legend: { data: ui.legend, orient: 'vertical', top: 'center' },
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', '2012', '2013', '2014', '2015'],
                source: [
                    { product: 'Matcha Latte', '2012': 41.1, '2013': 30.4, '2014': 65.1, '2015': 53.3 },
                    { product: 'Milk Tea', '2012': 86.5, '2013': 92.1, '2014': 85.7, '2015': 83.1 },
                    { product: 'Cheese Cocoa', '2012': 24.1, '2013': 67.2, '2014': 79.5, '2015': 86 },
                ],
                // source: [
                //     ['product', '2012', '2013', '2014', '2015'],
                //     ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                //     ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                //     ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4],
                // ],
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [
                // These series will show in the first coordinate, each series map a row in dataset.
                { type: 'bar', seriesLayoutBy: 'column' },
                { type: 'bar', seriesLayoutBy: 'column' },
                { type: 'bar', seriesLayoutBy: 'column' },
                { type: 'bar', seriesLayoutBy: 'column' },
                // { type: 'pie' },

                //
                // { type: 'bar', seriesLayoutBy: 'column' },
                // { type: 'bar', seriesLayoutBy: 'column' },
                // { type: 'bar', seriesLayoutBy: 'column' },
                // { type: 'bar', seriesLayoutBy: 'column' },
                // { type: 'bar', seriesLayoutBy: 'column' },
                // These series will show in the second coordinate, each series map a column in dataset.
                // { type: 'bar', seriesLayoutBy: 'row' /* xAxisIndex: 1, yAxisIndex: 1 */ },
                // { type: 'bar' /* xAxisIndex: 1, yAxisIndex: 1 */ },
                // { type: 'bar' /* xAxisIndex: 1, yAxisIndex: 1 */ },
                // { type: 'bar' /* xAxisIndex: 1, yAxisIndex: 1 */ },
            ],
        }
    },
})
// ;(window as any).CushyObservableCache.wagon1 = wagon1
