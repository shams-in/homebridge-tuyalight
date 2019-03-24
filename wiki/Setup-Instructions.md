You will need your iPhone and console access to the server you are using or plan to use for Homebridge. All the following steps are to be performed on the console of your server, unless stated. While it might appear to be just too much, it hardly takes 5 minutes to get done provided you have a functioning Homebridge setup.

> **Make sure you perform the cleanup steps after you are done.**

While the number of steps might scare you, they hardly take 5 minutes if you already have Homebridge working.
1) If you haven't already, install and configure [Homebridge](https://github.com/nfarina/homebridge).
1) Install this plugin using `npm i -g homebridge-tuya-lan`.
1) Add all your devices to the Tuya Smart app to avoid having to repeat the following painful steps.
1) Follow these steps to get the `id` and `key` combinations for the devices:
    1) Execute `npm i -g anyproxy @tuyapi/cli`.
       * `@tuyapi/cli` is a command-line tool built by [Max Isom](https://maxisom.me) to facilitate the extraction of the `id` and `key` combinations.
       * `anyproxy` is a NodeJS based proxy server by the folks at [Alibaba](https://github.com/alibaba/anyproxy).
       * We will remove the proxy server from your machine when we are done.
       
    1) Execute `anyproxy-ca`to generate a CA Root certificate; when prompted to generate one, say `y` for yes.
       * We will remove this later on too.
       
    1) The CA Root certificate you just generated, needs to be trusted.
       * On Linux, do the following:
          ```
          sudo mkdir /usr/share/ca-certificates/extra/
          sudo cp $HOME/.anyproxy/certificates/rootCA.crt /usr/share/ca-certificates/extra/
          sudo dpkg-reconfigure ca-certificates
          ```
          The last command will open up a GUI; hit `yes` on the first prompt. Using the arrows on your keyboard, locate `extra/rootCA.crt`, place an `*` next to it by hitting the space bar, hit the `Tab` key on your keyboard to highlight `OK`, and press the `Enter` key.

          ---
       * On Window, open an elevated command prompt and run the following:
          ```
          certutil -addstore -f "ROOT" "%USERPROFILE%\.anyproxy\certificates\rootCA.crt"
          ```

          ---
       * On macOS:
          ```
          sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain $HOME/.anyproxy/certificates/rootCA.crt
          ```

          ---
          
    1) Execute `tuya-cli list-app`. Within a few seconds, you would be shown (a) a QR code and (b) details of the proxy server.
    1) Scan the barcode with your iPhone. If you don't know how to do that, just say "Hey Siri, scan a QR code!" and point the camera at the barcode.
    1) Your phone will ask you your permission to open Safari; let it.
    1) Safari will alert you that the website is trying to open the settings; allow that too. This will open `Install Profile`.
    1) On the `Install Profile` screen, hit `Install` on the top-right of the screen. If your phone has a passcode, you would be asked to enter it. This will open up a `Warning` screen.
    1) On the `Warning` screen, hit `Install`. A confirmation dialog will pop up; hit `Install` again. Finally hit `Done` to close it all.
       * We will get rid of this later.
    1) On your iPhone, go to `Settings` and open `General` and `About`. Towards the bottom, locate and open `Certificate Trust Settings`.
    1) Enable full trust for `AnyProxy` by flicking its switch. You will be prompted with a warning; just hit `Continue`.
    1) On your iPhone, go to `Settings` and open `Wi-Fi`. Hit the info button, which is a blue `i` in a circle, for the WiFi connection you are using. This will open the configuration for your connection.
    1) On your WiFi connection screen, scroll to the bottom and hit `Configure Proxy`. This will open the proxy configuration screen.
    1) On the proxy configuration screen, tap on `Manual` to reveal additional settings. Use the details from step 4 (above) to fill in the server and port.
        * The text below the QR code should read "Set your HTTP proxy IP to `SERVER` with port `PORT`"; simply enter those values into the fields of the proxy configuration.
        * Leave the `Authentication` switch off.
        * Here on, your phone will not be able to open anything so don't panic.
    1) Open the Tuya Smart app; if it was already open, pull the screen down to refresh. In a few seconds, you would be shown an error dialog about your network connection; that is exactly what we want.
    1) A bunch of `id` and `key` combinations will be shown on the console, below the QR code you scanned earlier.
    1) After storing the `id` and `key` combinations elsewhere, follow the clean up instructions below to get rid of all the things we won't need anymore, and to be able to use your phone again.
1) Update the `config.json` file of your Homebridge setup, by modifying the sample configurations and using the `id` and `key` combinations.

> To find out which `id` belongs to which device, open the Tuya Smart app and check the `Device Information` by tapping the configuration icon of your devices; it is almost always a tiny icon on the top-right.


## Cleanup Instruction
After taking note of your `id` and `key` combinations, you have no need for `anyproxy` or `@tuyapi/cli`. Follow this steps to revert the changes you made above. **Do not miss these!**

1) On your iPhone, go to `Settings` and open `Wi-Fi`. Hit the info button, which is a blue `i` in a circle, for the WiFi connection you are using. Open `Configure Proxy` and select `Off`.
1) On your iPhone, go to `Settings` > `General` > `About` > `Certificate Trust Settings` and switch off full trust for `AnyProxy`.
1) On your iPhone, go to `Settings` > `General` > `Profiles & Device Management` > `AnyProxy` and tap `Remove Profile`. If one is set, you will be asked to enter your passcode. You would also be asked to confirm that you want to remove the profile; hit `Remove`.
1) Remove AnyProcy's CA Root certificate we installed earlier:
   * On Linux, do the following:
      ```
      sudo dpkg-reconfigure ca-certificates
      ```
      This command will open up a GUI; hit `yes` on the first prompt. Using the arrows on your keyboard, locate `extra/rootCA.crt`, remove the `*` next to it by hitting the space bar, hit the `Tab` key on your keyboard to highlight `OK`, and press the `Enter` key. Then execute:
      ```
      sudo rm -rf $HOME/.anyproxy /usr/share/ca-certificates/extra
      ```

      ---
   * On Window, open an elevated command prompt and run the following:
      ```
      certutil -delstore "ROOT" AnyProxy
      rmdir /S /Q "%USERPROFILE%\.anyproxy"
      ```

      ---
   * On macOS:
      ```
      sudo security delete-certificate -c "AnyProxy"
      rm -rf $HOME/.anyproxy
      ```

      ---
1) Run `npm r -g anyproxy @tuyapi/cli` to uninstall those packages.
