// 💬 2025-03-16 rvion:
// symbol is
// - NOT exported
// - NOT global:
// - NOT used : only the type is exported
const IconSym = Symbol('icon')

export type IconName = typeof IconSym
