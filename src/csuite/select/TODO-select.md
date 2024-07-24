TODO:

- [🟢] 2024-07-24: fix select many (behave like a single select)
- [🟢] 2024-07-24: pressing a letter to open the select do not properly insert the letter in the input
- [🔶 domi: LGTM?] 2024-07-24: pressing esc doesn't properly put focus back to the select => 
- [ ] 2024-07-25: selecting a value reset the popup position => makes it super-hard to select values down the list. 
        => domi: both virtualized and non-virtualized lists are affected.
        => domi: if SelectPopupUI is placed in anchor instead of reveal, no more issue.
        => domi: prob due to revealSt.contentFn = ... being re-set on every render. 
           => btw do we expect RevealUI to be re-render when some random nested props of content change ? (via content + children)
- [ ] 2024-07-24: built-in nullability (no more boolean before the value)
- [ ] hovering the select anchor is applying hover effect on the popup, it should not
- [ ] adding enough items to cause the select to wrap is not properly updating the associated reveal position => it should go down a bit
- [ ] single select: picking an item shouldn't close the popup => the MOUSE UP should. otherwise, drag & slide is broken
- [🟢] put back the old select anchor code (using grid layout to avoid icons to be stretched)