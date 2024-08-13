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


-----------


```
<!-- CLICK ON THE SELECT IN THE POPUP -->
[🟢] 🌑 1 🎩 9: anchor.onMouseDown ❓
[❌] 🌑 0 🎩 8: anchor.onMouseDown ❓
[❔] 🌑 1 🎩 9: anchor.onFocus (mouseDown: true) (⏳: 8592)
[❔] 🌑 1 🔶 revealUI - onFocus
[❔] 🌑 0 🎩 8: anchor.onFocus (mouseDown: true) (⏳: 8592)
[❔] 🌑 1 🎩 9: anchor.onMouseUp
[❔] 🌑 0 🎩 8: anchor.onMouseUp
[❔] 🌑 1 🎩 9: onLeftClickAnchor (visible: 🔴)
[❔] 🌑 1 🚨 open
[❔] 🌑 1 🎩 9: onBlurAnchor
[❔] 🌑 1 🔶 revealUI - onBlur
[❔] 🌑 0 🎩 8: onBlurAnchor
[❔] 🌑 1 🎩 9: anchor.onFocus (mouseDown: false) (⏳: 10)
[❔] 🌑 1 🔶 revealUI - onFocus
[❔] 🌑 0 🎩 8: anchor.onFocus (mouseDown: false) (⏳: 8679)
[❔] 🌑 0 🚨 open
[❔] 🌑 1 🚨 close (reason=cascade)
[❔] 🌑 1 🔶 revealUI - onHidden (focus anchor)
[❔] 🌑 1 🔶 SelectSate clean
```