// import type { STATE } from './state'
// import type { MsgGroup } from './CSCriticalError'
// import type { MessageFromExtensionToWebview } from 'src/types/MessageFromExtensionToWebview'

// import { renderMsgUI } from './ui/flow/flowRenderer1'

// export class MessageGroupper {
//     constructor(
//         //
//         public frontState: STATE,
//         public getItems: () => MessageFromExtensionToWebview[],
//     ) {}

//     get received() {
//         return this.getItems()
//     }

//     get itemsToShow() {
//         // return this.received
//         const max = 200
//         const len = this.received.length
//         const start = this.frontState.showAllMessageReceived ? 0 : Math.max(0, len - max)
//         const items = this.received.slice(start)
//         // const ordered = this.frontState.flowDirection === 'up' ? items.reverse() : items
//         return items
//     }

//     // group sequential items with similar types together
//     get msgGroups(): MsgGroup[] {
//         const ordered = this.itemsToShow

//         const grouped: MsgGroup[] = []
//         let currentGroup: MsgGroup | null = null
//         let currentType: string | null = null
//         for (const item of ordered) {
//             let x = renderMsgUI(this.frontState, item)
//             if (x == null) continue
//             let groupType = x.group ?? item.type
//             // if (currentGroup == null) currentGroup = newMsgGroup(groupType, x.wrap)
//             if (groupType !== currentType) {
//                 if (currentGroup?.messages.length) grouped.push(currentGroup)
//                 currentGroup = newMsgGroup(groupType, x.wrap)
//                 currentType = groupType
//             }
//             currentGroup!.messages.push(item)
//             currentGroup!.uis.push(x.ui)
//         }
//         if (currentGroup?.messages.length) grouped.push(currentGroup)
//         return grouped
//     }
// }

// const newMsgGroup = (groupType: string, wrap?: boolean): MsgGroup => ({
//     groupType,
//     messages: [],
//     uis: [],
//     wrap: wrap ?? false,
// })
