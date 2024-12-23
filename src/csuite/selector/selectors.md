TODO 2024-11-29:

-   I want to improve it so that ASTStep is either an axis/filter, OR a true `branching` node with multiple sub astStep separated by either '|'. those branching need to be nestable, yet easy to parse, so we need braces around those to help.

    -   complex example: `.foo.bar{.baz.quuz | @str.a.b.c...d | {x.y^z | @number } }
    -   this will enable having multiple different sub-paths in every branches

-   I also want to improve it so that every ASTStep can also call a final reducer that evaluate js code to gather values from the list of selected fields; reducer need to run on the current step field array, not each

    -   this means evaluating selector will now return both and array of gathered nodes in the final step and array of gathered values accumulated along the evaluation
    -   I want this to be as minimal in terms of code, so let's just make it so the parser can accept `=(<code>)` in addition to `?(<code>)` so it's just one extra char to look for
    -   e.g. `>@str=(@.map(v => v.value).join('+'))` to join every node with typre 'str' value into a final string

-   I also want to improve it so there is a new axis that means closest parent matching the associated filter going upwards, using '%' (not ideal, but needs to be one char)

-   I want the code to be slightly simpler, so I don't have to keep track of paren /braces depth in multiple places.
