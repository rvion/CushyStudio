Screen is divided in nested Region
Each region can have some associated typed context
Commnds have NO params, only some automatic context that can be retrieved from a CommandContext.
Ff you want to execute a comand by binding a custom context, you can, but then you're just using the lambda directly
Commands are what are bound to shortcuts.
Commands are expected to try find the right stuff from the nested stack of region and state
Menus accept various kind of entries : IWidget | FC<{}> | Command | BoundCommand | BoundMenu

regions are active when hovered