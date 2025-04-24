export type ColExprWithoutTheDolDot = Flavor<string, 'ColExprWithoutTheDolDot'>
export type ColExpr = Flavor<string, 'ColExpr'>

export function removeTheDolDot(colExpr: ColExpr): ColExprWithoutTheDolDot {
   return colExpr.replace(/^\$\./, '') as ColExprWithoutTheDolDot
}
