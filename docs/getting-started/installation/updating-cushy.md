# Updating Cushy

CushyStudio updates itself effortlessly. To update:

1. **Close CushyStudio:** Ensure CushyStudio is closed before proceeding with the update.
2. **Run the Update Script for Your Platform:**
   * For Mac and Linux, execute: `_mac-linux-update.sh`.
   * For Windows, run: `_windows-update.bat`.

#### Risks When Updating

When updating, consider the following risks:

* **Broken Migrations:** On every startup, CushyStudio applies new changes to its database, including all migrations. A backup feature will be implemented soon to ensure you never lose your drafts or prompts.
* **App Incompatibility:** CushyKit is designed to be robust to breaking changes. Your custom apps should never lose their drafts. However, after an update, you may need to update your custom apps. Sometimes, a built-in app will also be updated.

#### Updating Manually

When updating manually (e.g., with a git pull or checking out a branch), follow these steps:

* Run the update script to ensure everything is properly updated.
* If you're updating manually with a git pull or checking out a branch, you will need to run the install script to install all dependencies correctly.
