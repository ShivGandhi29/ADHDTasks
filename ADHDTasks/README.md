# Focusd
Your ADHD to-do list. One task at a time.



### Android build & install

| Command | Description |
|--------|-------------|
| `yarn android:build` | Build the Android APK and install it on all connected USB devices. |
| `yarn android:build-only` | Build a **release** APK (smaller size), copy to **`dist/Focusd-<version>-android.apk`**. Use this file to share the app. |

**If tapping the APK does nothing on their phone:** Android is blocking the install. They need to allow “Install unknown apps” for the app that opens the file (e.g. Chrome or Files): **Settings → Apps → [that app] → Install unknown apps → Allow**.

**File size:** The build is configured for phone CPUs only (arm64 + armv7), and the shareable APK is a release build (minified), so the APK in `dist/` should be much smaller than a debug build. To build for the emulator too, set in `android/gradle.properties`: `reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64`.

**Script options** (when running the script directly):

```bash
./scripts/build-and-install-android.sh [options]
```

| Option | Description |
|--------|-------------|
| (none) | Build debug APK and install on all connected devices. |
| `--build-only` | Build only; copy APK to `dist/` and print the path. Same as `yarn android:build-only`. |
| `--release` | Build release APK instead of debug, then install. |
| `--device SERIAL` | Install only on the device with this `adb` serial (use `adb devices` to list). |
| `-h`, `--help` | Show usage. |

**Requirements for install:** Android SDK and `adb` (platform-tools). Enable USB debugging on the device.

### Other scripts

| Command | Description |
|--------|-------------|
| `yarn reset-project` | Move starter code to **app-example** and create a blank **app** directory. |
| `yarn sync-icon` | Sync app icon assets. |
| `yarn sync-native-assets` | Sync native assets. |
| `yarn make-app-icon-opaque` | Make the app icon opaque. |


