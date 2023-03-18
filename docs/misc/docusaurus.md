```ms
➜  intuition git:(master) ✗ yarn global add create-docusaurus
➜  intuition git:(master) ✗ create-docusaurus
✔ What should we name this site? … website
✔ Select a template below... › classic (recommended)
✔ This template is available in TypeScript. Do you want to use the TS variant? … yes
[INFO] Creating new Docusaurus project...
[INFO] Installing dependencies with yarn...
yarn install v1.22.17
info No lockfile found.
[1/5] Validating package.json...
[2/5] Resolving packages...
warning @docusaurus/core > @svgr/webpack > @svgr/plugin-svgo > svgo > stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility
warning @docusaurus/core > @docusaurus/mdx-loader > @mdx-js/mdx > remark-parse > trim@0.0.1: Use String.prototype.trim() instead
[3/5] Fetching packages...
[4/5] Linking dependencies...
warning "@docusaurus/core > react-loadable-ssr-addon-v5-slorber@1.0.1" has unmet peer dependency "react-loadable@*".
warning "@docusaurus/preset-classic > @docusaurus/theme-search-algolia > @docsearch/react > @algolia/autocomplete-preset-algolia@1.7.4" has unmet peer dependency "@algolia/client-search@>= 4.9.1 < 6".
[5/5] Building fresh packages...
success Saved lockfile.
Done in 41.71s.
[SUCCESS] Created website.
[INFO] Inside that directory, you can run several commands:

  `yarn start`
    Starts the development server.

  `yarn build`
    Bundles your website into static files for production.

  `yarn serve`
    Serves the built website locally.

  `yarn deploy`
    Publishes the website to GitHub pages.

We recommend that you begin by typing:

  `cd website`
  `yarn start`

Happy building awesome websites!
```
