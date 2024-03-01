# Installing Cushy

## Installation Guide

Follow the instructions below to set up CushyStudio on your machine. If you encounter any problems please check out our [wip-pad](../../going-further/wip-pad/ "mention")steps.

### Windows

{% hint style="info" %}
{% code overflow="wrap" %}
```
If you encounter any permission issues, try running the script as an administrator by right-clicking on `_windows-install.bat` and selecting "Run as administrator".
```
{% endcode %}
{% endhint %}

1. **Download the Repository:**
   *   You can download the CushyStudio repository from [GitHub](https://github.com/rvion/CushyStudio) by either:

       * Cloning the repository using Git:&#x20;

       {% code fullWidth="false" %}
       ```batch
       git clone https://github.com/rvion/CushyStudio.git
       ```
       {% endcode %}

       * Or downloading the latest stable release directly from the [releases page](https://github.com/rvion/CushyStudio/releases).


2.  **Run the Install Script:**

    * After downloading the repository, extract the contents of the downloaded `.zip` file to a directory of your choice.
    * Navigate to the extracted directory and locate the `_windows-install.bat` script.
    * Double-click on `_windows-install.bat` to run the installation script.
    * This script will automatically install Cushy, as well as any required dependencies.


3. Start Cushy:
   * Start Cushy with the `_windows-start.bat`

***

### Mac and Linux

1. **Download the Repository:**
   *   You can download the CushyStudio repository from [GitHub](https://github.com/rvion/CushyStudio) by either:

       * Cloning the repository using Git:&#x20;

       {% code fullWidth="false" %}
       ```batch
       git clone https://github.com/rvion/CushyStudio.git
       ```
       {% endcode %}

       * Or downloading the latest stable release directly from the [releases page](https://github.com/rvion/CushyStudio/releases).


2.  **Run the Install Script:**

    ```bash
    cd CushyStudio
    ./_mac-linux-install.sh
    ```

    * This script will automatically install Cushy, as well as any required dependencies.


3.  **Start Cushy**

    ```bash
    ./_mac-linux-start.sh
    ```
