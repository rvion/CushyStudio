// We know what we are doing in this file: we are defining a wrapper for echarts
// therefore it's fine to use `echarts-do-not-import-directly` as it's a warning
// meant for downstream modules
import type * as T from 'echarts-do-not-import-directly'

import * as Charts from 'echarts-do-not-import-directly/charts'
import * as Comps from 'echarts-do-not-import-directly/components'
import * as echarts from 'echarts-do-not-import-directly/core'
import * as Renderers from 'echarts-do-not-import-directly/renderers'

// 🤓 echarts does not associate extensions with their option types
// In this file, to gain additional type safety and DX (autocomplete, etc.),
// we make a tiny helper to keep them in sync

// 😿 echarts does not expose the type of the argument to `use`...
//               👇 This is `EChartsExtensionInstaller | EChartsExtension`
type EchartsExt = Parameters<(typeof echarts)['use']>[0] extends infer Ext | (infer _)[] ? Ext : never

// Dummy type to associate an extension with its option type
type TaggedExt<Opt> = { $opt: Opt; ext: EchartsExt }
const ext = <Opt = never>(ext: EchartsExt): TaggedExt<Opt> => ({ $opt: 0 as Opt, ext })

// Below we define the extensions we want to use and associate them with their options
// 📝 Adding more will likely increase our bundle size
// 📝 except for renderers, make sure to specify the corresponding option type
const LOCO_CHARTS_EXTS = [
    // Renderers
    ext(Renderers.CanvasRenderer),
    // ext(Renderers.SVGRenderer),

    // Charts
    ext<T.BarSeriesOption>(Charts.BarChart),
    ext<T.LineSeriesOption>(Charts.LineChart),
    // ext<T.BoxplotSeriesOption>(Charts.BoxplotChart),
    // ext<T.CandlestickSeriesOption>(Charts.CandlestickChart),
    // ext<T.CustomSeriesOption>(Charts.CustomChart),
    // ext<T.EffectScatterSeriesOption>(Charts.EffectScatterChart),
    // ext<T.FunnelSeriesOption>(Charts.FunnelChart),
    // ext<T.GaugeSeriesOption>(Charts.GaugeChart),
    // ext<T.GraphSeriesOption>(Charts.GraphChart),
    // ext<T.HeatmapSeriesOption>(Charts.HeatmapChart),
    // ext<T.LinesSeriesOption>(Charts.LinesChart),
    // ext<T.MapSeriesOption>(Charts.MapChart),
    // ext<T.ParallelSeriesOption>(Charts.ParallelChart),
    //  ext<T.PictorialBarSeriesOption>(Charts.PictorialBarChart),
    //  ext<T.PieSeriesOption>(Charts.PieChart),
    // ext<T.RadarSeriesOption>(Charts.RadarChart),
    //  ext<T.SankeySeriesOption>(Charts.SankeyChart),
    ext<T.ScatterSeriesOption>(Charts.ScatterChart),
    // ext<T.SunburstSeriesOption>(Charts.SunburstChart),
    // ext<T.ThemeRiverSeriesOption>(Charts.ThemeRiverChart),
    // ext<T.TreeSeriesOption>(Charts.TreeChart),
    // ext<T.TreemapSeriesOption>(Charts.TreemapChart),

    // Components
    ext<T.TitleComponentOption>(Comps.TitleComponent),
    ext<T.TooltipComponentOption>(Comps.TooltipComponent),
    ext<T.GridComponentOption>(Comps.GridComponent),
    ext<T.DatasetComponentOption>(Comps.DatasetComponent),
    ext<T.LegendComponentOption>(Comps.LegendComponent),
    ext<T.DataZoomComponentOption>(Comps.DataZoomComponent),
    // ext<T.AriaComponentOption>(Comps.AriaComponent),
    // ext<T.AxisPointerComponentOption>(Comps.AxisPointerComponent),
    // ext<T.BrushComponentOption>(Comps.BrushComponent),
    // ext<T.CalendarComponentOption>(Comps.CalendarComponent),
    // ext<T.InsideDataZoomComponentOption>(Comps.DataZoomInsideComponent),
    // ext<T.SliderDataZoomComponentOption>(Comps.DataZoomSliderComponent),
    // ext<T.GeoComponentOption>(Comps.GeoComponent),
    // ext<T.GraphicComponentOption>(Comps.GraphicComponent),
    // ext<T.GridComponentOption /* ? */>(Comps.GridSimpleComponent),
    // ext<T.PlainLegendComponentOption>(Comps.LegendPlainComponent),
    // ext<T.ScrollableLegendComponentOption>(Comps.LegendScrollComponent),
    // ext<T.MarkAreaComponentOption>(Comps.MarkAreaComponent),
    // ext<T.MarkLineComponentOption>(Comps.MarkLineComponent),
    // ext<T.MarkPointComponentOption>(Comps.MarkPointComponent),
    // ext<T.ParallelComponentOption>(Comps.ParallelComponent),
    // ext<T.PolarComponentOption>(Comps.PolarComponent),
    // ext<T.RadarComponentOption>(Comps.RadarComponent),
    // ext<T.SingleAxisComponentOption>(Comps.SingleAxisComponent),
    // ext<T.TimelineComponentOption>(Comps.TimelineComponent),
    // ext<T.ToolboxComponentOption>(Comps.ToolboxComponent),
    // ext<never /* ? */>(Comps.TransformComponent),
    // ext<T.VisualMapComponentOption>(Comps.VisualMapComponent),
    // ext<T.ContinousVisualMapComponentOption>(Comps.VisualMapContinuousComponent),
    // ext<T.PiecewiseVisualMapComponentOption>(Comps.VisualMapPiecewiseComponent),
]

echarts.use(LOCO_CHARTS_EXTS.map((t) => t.ext))

// We're supposed to use locoEcharts instead of echarts in our codebase
export const locoCharts = echarts

type ExtOptions = typeof LOCO_CHARTS_EXTS extends TaggedExt<infer Opts>[] ? Opts : never
export type LocoChartsOpts = T.ComposeOption<ExtOptions>
