# Updating Cushy

CushyStudio update itself easily.&#x20;

To update,&#x20;

1. close CushyStudio,&#x20;
2. Run the update script for your platform.&#x20;

## Risks when updating

### Broken migrations ?

On every startup, Cushy will apply new changes to it's database (apply all migrations).\
⏳ Some kind of backup will be implemented soon to ensure you never loose your drafts / prompts.

### App incompatibility ?

CushyKit is designed in a way that makes apps robust to breaking changes.

Your custom apps should never loose their drafts. \
You may have to update your custom apps after an update

But sometimes, a built-in app will be update

## Updating manually

When updating, be sure to run the `update script` so everything is properly updated.

If you're manually updating with a git pull, or checking a branch, you will need to run the `install` script to have
