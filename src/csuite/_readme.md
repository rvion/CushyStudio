# CSUITE

`csuite` is a design system + component system.

It is quite opinionated.

It tries to come battery included to build complex apps

It comes with several core non-UI abstractions and.
Main authors: @rvion @birdddev @domi @Globidev

------------

Misc notes about things to document later


- Model
    - a model is a tree of fields

- Fields
    - pieces from which models are built

- Widget
    - what fields render to.

- Form
    - GUI to manipulate a model or part of a model

- Inputs
    - low-level input components

- Menu
    - Menus accept various kind of entries : IWidget | FC<{}> | Command | BoundCommand | BoundMenu

- Activity
    - Activity can be started/stopped.
    - when started, an activity is displayed aove everything else and catch every event
    - allow to implement modal editors

- Context
    - some kind of state that can be retrieved in any children (a bit like react context)

- Region
    - Screen is divided in nested Region
    - Each region can have some associated typed context
    - Regions are active when hovered

- Command
    - Commnds are context-bound insteead of having  NO params,
    - they can only trigger when their their context is active.
    - if you want to execute a comand by binding a custom context, you can, but then you're just using the lambda directly

- Shortcuts
    - Commands are what are bound to shortcuts.

- Frame
    - a visual rectable with colouring / hovering / bordering / tooltip capabilities
    - basic building block for most layout parts.