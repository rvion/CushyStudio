export type TabPositionConfig = 'start' | 'center' | 'end'

export const getJustifyContent = (tabPosition: Maybe<TabPositionConfig>) => {
    if (tabPosition === 'start') return 'flex-start'
    if (tabPosition === 'center') return 'center'
    if (tabPosition === 'end') return 'flex-end'
    // default:
    return 'flex-start'
}

// widget.config.tabPosition === 'start' //
//     ? 'flex-start'
//     : widget.config.tabPosition === 'center'
//       ? 'center'
//       : widget.config.tabPosition === 'end'
//         ? 'flex-end'
//         : 'flex-start',
