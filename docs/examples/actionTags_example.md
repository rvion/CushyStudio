To use action tags you must make a file in your deck called `_actionTags.ts` or `_actionTags.js`

The contents of this file might look something like this

```js
function strong(v) {
    return `(${v})`;
}

actionTags([
    { key: "strong", method: strong }
]);
```

You will then be able to fined an action tag called `[deck name]/strong`.

Keep in mind all action tags methods should take in one argument of type string and also return a string.