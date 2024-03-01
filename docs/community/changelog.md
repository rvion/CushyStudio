# 😁 Changelog

## 2024-02-28:

#### Docs

- new Changelog page (`docs/community/news/changelog.md`)
- new install page (`docs/getting-started/installation/README.md`)
- new installing models (`docs/getting-started/installation/installing-modules/installing-models.md`)

#### SDK
- New api for optional fields: `form.intOpt(...)` => `form.int(...).optional()`

#### UI:
- New menu entry to re-open welcome panel if you closed it.

#### APPS & Prefabs:
- prefab_model > civitai_ckpt_air: add civitai custom node as requirement
- new sdk example for booleans (`library/sdk-examples/ui-booleans.ts`)

## 2024-02-27 ([PR](https://github.com/rvion/CushyStudio/pull/178))

#### Misc. Changes
- Moves logic to \<InputBoolUI\> so that it's easily re-usable as a checkbox for other widgets
- Adds a deprecation warning for label2 on Widget_BoolUI, it should be replaced with the new text option
- Dragging to make checkbox share a similar state when you drag over them should work with more areas now that more things will use the same underlying widget instead of duplicated code. (Only WidgetBoolUI, Widget_ToggleUI, and SelectUI (search enum, choices) with this PR)

#### InputBoolUI
- `expand` Makes the widget use as much space as possible (horizontally)
- `icon` Uses a material-symbols-outlined icon name (Not sure how to type this correctly so it's just a string, but displaying all the icon names would be cool)
- `display` Sets the way the widget is displayed
- - `check` gives you a normal checkbox, with the text/icon to the right
- - `button` gives you a toggle-able button similar to how form.choices() looks.
- Thing to note is that the display function changes how the undefined state of expand is interpreted, with 'check' using an expand = true by default, and 'button' using an expand = false by default.

#### WidgetChoicesUI
- Use InputBoolUI

#### SelectUI
- Use InputBoolUI
- Clicking on any non-button part of the pop-up no longer closes it.
- Un-focuses the underlying text input when the menu closes.
*Fixes the pop-up opening when you un-focus and re-focus the window when the pop-up is active, also just feels nicer. Probably really only hurt the experience for people who use focus window under mouse, like me. uvu*
- Closes the pop-up when you are a certain distance away from one of the edges.
*Gives people a bit of slack with moving their mouse to/in the pop-up*
- You can now drag to set multiple entries to the same state instead of having to click each one individually.
- Fake the gaps between entries.
*Follows Fitt's law by having no dead areas between the part of the buttons the user can click.*

#### WidgetWithLabelUI
- Make the header collapse/expand panels, buttons should preventDefault/stopPropagation in onMouseDown to prevent themselves from triggering this if they're in the header.
- Holding left mouse and dragging over the headers of panels now quickly expands/collapses them.



## 2024-02-26 ([PR](https://github.com/rvion/CushyStudio/pull/177))
- Prevent new-line when pressing ctrl+enter when used in prompt #177
