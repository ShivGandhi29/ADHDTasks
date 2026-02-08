# Uploading Focusd to the App Store

## Prerequisites
- [ ] Apple Developer account (paid, $99/year)
- [ ] App created in App Store Connect with bundle ID **com.adhdtasks.app**
- [ ] Signing: Distribution certificate + App Store provisioning profile (Xcode can manage these)

---

## Option A: Archive and upload from Xcode

### 1. Build for Release first (reduces Archive errors)
From the project root in Terminal:
```bash
yarn ios --configuration Release -d "Shiv's iPhone"
```
Use your actual device name. This builds the app and all Pods in Release. Leave the app installed or not—the important part is that the build ran.

### 2. Open the workspace (not the project)
- Open **`ios/ADHDTasks.xcworkspace`** in Xcode (not `ADHDTasks.xcodeproj`).

### 3. Select destination and scheme
- At the top, set the **scheme** to **ADHDTasks**.
- Set the **destination** to **Any iOS Device** (not a simulator).

### 4. Create an archive
- Menu: **Product → Archive**.
- Wait for the archive to finish. If you see "module map file not found" errors, run step 1 again, then try Archive again.

### 5. Distribute the app
- When the archive is done, the **Organizer** window opens.
- Select the new archive and click **Distribute App**.
- Choose **App Store Connect** → **Upload** → Next.
- Leave options as default (e.g. upload symbols, manage version/build) → Next.
- Choose **Automatically manage signing** (or your distribution profile) → Next.
- Click **Upload** and wait.

### 6. In App Store Connect
- Go to [App Store Connect](https://appstoreconnect.apple.com) → your app **Focusd**.
- The new build appears under **TestFlight** (and later under **App Store** when you submit for review).
- Processing can take 5–30 minutes. When the build shows up, add it to a version and submit for review when you’re ready.

---

## Option B: EAS Build (Expo Application Services)

If Archive in Xcode keeps failing, you can build in the cloud and optionally submit:

1. Install EAS CLI: `yarn global add eas-cli`
2. Log in: `eas login`
3. Configure: `eas build:configure` (creates `eas.json`)
4. Build: `eas build --platform ios --profile production`
5. Submit (optional): `eas submit --platform ios --latest` (after the build finishes)

You’ll need to set up Apple credentials (certificate + provisioning profile) in EAS once; the CLI can guide you.

---

## Checklist before submit
- [ ] App name in App Store Connect matches (e.g. **Focusd**).
- [ ] Version **1.0.0** and build number are correct.
- [ ] Screenshots, description, keywords, and privacy policy URL are filled in.
- [ ] You’ve tested the build on a real device (e.g. via TestFlight).
