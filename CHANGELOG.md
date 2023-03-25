2023-03-25

-   faster startup
-   initial config folder / config file / configurable workspace definition

2023-03-24

-   new graph visualization

2023-03-23

-   new Gallery mode with large focus, docked by default
-   update Cushy to be compatible with latest Comfy (fix images)
-   improve core models

2023-03-22

-   POC gallery pane showing all images of all steps of all runs of all projects
-   POC open / save dialog to (not yet implemented) open and save projects
-   minor layout improvements
-   POC built-in wildcards
-   new `randomSeed()` basic implem
-   some code cleanup
-   failed attempts to improve the release pipeline (help needed)

2023-03-21

-   🔥 CIVITAI: POC civitai integration
-   🔥 CI/CD: switch to tauri: https://tauri.app/
-   🔥 CI/CD: remove electron

2023-03-20

-   🔥 CI/CD: add electron release pipeline (win-only for now; mac and linux almost working)
-   ✨ NEW: new image viewer
-   💄 style: smaller node list by default (only show currently executing node)
-   🧹 CLEAN: esling setup + fix all linting errors
-   🔥 ELECTRON integration

2023-03-19

-   ⏫ UPGRADE: improve a few icons
-   ⏫ UPGRADE: allow to re-open a script by clicking on the menu project title
-   ⏫ UPGRADE: questions not lock once answered
-   🎉 first RELEASE ! not perfectly functional, but it's a start !
-   🔥 RENAME: rename `StableIDE` => `CushyStudio`
-   ✨ NEW: add progress report
-   💄 style: add title and github corner
-   💄 style: add fancy reveal animations in the control pane
-   ✨ NEW: update Control API to support for default values
-   ⏫ UPGRADE: unify ControlUis appearances (cards)
-   ⏫ UPGRADE: reverse control pane order
-   ⏫ UPGRADE: move control pane to the left
-   ✨ NEW: add various UIDs to most instances to allow for stable refs

2023-03-18

-   ✨ NEW: add `askString` and `askBoolean` interractions
-   🔥 MAJOR: new interraction system
-   ✨ NEW UI: makes nodes foldable in execution dashboards
-   ✨ NEW UI: add warning toast on empty prompt
-   ✨ NEW UI: word wrap button in toolbar
-   ✨ NEW core: new `ScriptExecution` context
-   ✨ NEW placeholder documentaion website at https://rvion.github.io/CushyStudio/
-   ❤️‍🩹 FIX too many small things to details them here #prealpha

2023-03-17

-   ✨ NEW UI: new Toolbar

2023-03-15

-   ✨ NEW UI: switch UI toolkit to fluentUI 9

2023-03-14

-   ✨ NEW UI: setup material icons https://fonts.google.com/icons

2023-03-13

-   ✨ NEW misc: persist server `IP` and `PORT` in local storage
-   ✨ NEW monaco: activate word-wrap by default
-   ✨ NEW logs: fancy logs with 🐰 bunny ears
-   ❤️‍🩹 FIX monaco: wait for monaco background workers to be ready before starting the IDE
-   ❤️‍🩹 FIX previews: fix previews not showing up because of SID not beeing properly forwrarded
