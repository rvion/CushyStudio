# Contributing on the UI

## UI Technologies

CushyStudio UI is done with [React](https://react.dev/), [Mobx](https://mobx.js.org/README.html), [DaisyUI](https://daisyui.com/), [Tailwind](https://tailwindcss.com/) and a lot of custom-made components.

Code is pretty clean and fairly standard, but understanding Mobx is required, since the whole application is relying on mobx a lot.

## Hot reloading components

During dev, you must start CushyStudio with the `_windows-start-dev.bat` or the `_mac-linux-start-dev.sh` so Cushy Studio can hot reload your changes.

Components you change in the codebase will be instancly updated in your UI.&#x20;

## Tailwind autocompletion

If  you're unfamiliar with tailwind, make sure you have the`"bradlc.vscode-tailwindcss` vscode extension installed so you have autocompletion for both tailwind classes, and daisyui classes.

<figure><img src="https://cushy.fra1.cdn.digitaloceanspaces.com/rvion-screenshots/2024-02-18_19-27-14%20(1).jpg" alt=""><figcaption></figcaption></figure>

## The specila \`tw\` property

most styling can be done though the magical `tw` property that is injected in all components and helps writing conditional classes, or tailwind classes more easilly. (check the `src/utils/custom-jsx/jsx-runtime.js`  module to look at the implementation)

more generally, please take a look at [setting-up-vscode.md](setting-up-vscode.md "mention")to ensure you have everything properly hooked up
