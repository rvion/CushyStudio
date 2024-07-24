# misc notes about what needs to be done on the reveal

-   🔴 reveal go out of screen in a weird way

    -   what should we do ? => move to center of screen ?

-   🔴 popup should be at the top ? or near mouse
-   reveal props are not all properly updated / hot-reloaded (wrong useMemo)
-   🟢 can we remove the reveal anchro wrapper

    -   I'd love to
        // 3 options
        //
        // - add a div
        // => annoying
        // - clone the child and inject props
        // => will not work if child does not forward custom props
        // - do some magic using regionMonitor
        // => will not work if child does not forward custom props

-   separate into 2 axies (placement and shell)
