---
description: How do I fix my broken install ?
---

# 🔥 Troubleshooting



* some of the config is stored on the DB. you can wipe the DB safely
  * manually by deleting the `./src/db/cushy-1.db` file&#x20;
  * using the debug menu to do the same



* you can try those scripts:
  * \_windows-cleanup.bat
    * it will: deleting node\_modules folder...
    * deleting the local node install in the  `.cushy` folder
  * \_windows-reset-db.bat



*   some of the config is stored on the CONFIG.json at the root

    * you can delete the config but you'll lose
    * notably the current layout. so if your current layout has a broken tab that crashes cushy, this tab will be reloaded every time; you may want to remove the part about the layout

    <figure><img src="../../.gitbook/assets/image (1) (1) (1).png" alt=""><figcaption></figcaption></figure>
