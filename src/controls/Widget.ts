/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */

import type { Widget_bool } from './widgets/bool/WidgetBool'
import type { Widget_inlineRun } from './widgets/button/WidgetInlineRun'
import type { Widget_choices } from './widgets/choices/WidgetChoices'
import type { Widget_color } from './widgets/color/WidgetColor'
import type { Widget_custom } from './widgets/custom/WidgetCustom'
import type { Widget_enum } from './widgets/enum/WidgetEnum'
import type { Widget_group } from './widgets/group/WidgetGroup'
import type { Widget_image } from './widgets/image/WidgetImage'
import type { Widget_list } from './widgets/list/WidgetList'
import type { Widget_listExt } from './widgets/listExt/WidgetListExt'
import type { Widget_loras } from './widgets/loras/WidgetLora'
import type { Widget_markdown } from './widgets/markdown/WidgetMarkdown'
import type { Widget_matrix } from './widgets/matrix/WidgetMatrix'
import type { Widget_number } from './widgets/number/WidgetNumber'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_orbit } from './widgets/orbit/WidgetOrbit'
import type { Widget_prompt } from './widgets/prompt/WidgetPrompt'
import type { Widget_seed } from './widgets/seed/WidgetSeed'
import type { Widget_selectMany } from './widgets/selectMany/WidgetSelectMany'
import type { Widget_selectOne } from './widgets/selectOne/WidgetSelectOne'
import type { Widget_shared } from './widgets/shared/WidgetShared'
import type { Widget_size } from './widgets/size/WidgetSize'
import type { Widget_string } from './widgets/string/WidgetString'

// Widget is a closed union for added type safety
export type Widget =
    | Widget_shared<any>
    | Widget_optional<any>
    | Widget_color
    | Widget_string
    | Widget_orbit
    | Widget_prompt
    | Widget_seed
    | Widget_number
    | Widget_bool
    | Widget_inlineRun
    | Widget_markdown
    | Widget_custom<any>
    | Widget_size
    | Widget_matrix
    | Widget_loras
    | Widget_image
    | Widget_selectMany<any>
    | Widget_selectOne<any>
    | Widget_list<any>
    | Widget_listExt<any>
    | Widget_group<any>
    | Widget_choices<any>
    | Widget_enum<any>
