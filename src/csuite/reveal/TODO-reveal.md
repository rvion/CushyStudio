# misc notes about what needs to be done on the reveal

- [ ] menus are broken
- [ ] reveal go out of screen in a weird way
    -   what should we do ? => move to center of screen ?

- [🟢] popup should be at the top ? or near mouse

- [ ] reveal props are not all properly updated / hot-reloaded (wrong useMemo)

- [🟢] can we remove the reveal anchro wrapper
    - not always,
    - [🟢] we can for Frame and other component that are safe to clone/extend, like `Frame`,
    - [ ] we can for primitives like `div` or `span`

- [🟢] separate into 2 axies (placement and shell)
