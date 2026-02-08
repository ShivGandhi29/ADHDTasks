#!/usr/bin/env node
/**
 * Copies the icon and splash image from app.json into the native iOS and Android
 * projects. Run this when you change app.json icon/splash so that run:ios / run:android
 * use the same assets (native builds don't read app.json at build time).
 *
 * Usage: yarn sync-native-assets
 */
const { cpSync, existsSync, readFileSync } = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const appJsonPath = path.join(root, 'app.json');
const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
const expo = appJson.expo || appJson;

const iconPath = path.join(root, expo.icon?.replace(/^\.\//, '') || '');
const splashPath = expo.plugins?.find?.((p) => Array.isArray(p) && p[0] === 'expo-splash-screen')?.[1]?.image;
const splashImagePath = splashPath ? path.join(root, splashPath.replace(/^\.\//, '')) : iconPath;

if (!existsSync(iconPath)) {
  console.error('Icon not found:', iconPath);
  process.exit(1);
}

// iOS: AppIcon.appiconset (single 1024x1024; actool rejects other sizes)
const iosAppIcon = path.join(root, 'ios/ADHDTasks/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png');
cpSync(iconPath, iosAppIcon, { force: true });
try {
  execSync(`sips -z 1024 1024 "${iosAppIcon}"`, { stdio: 'ignore' });
} catch (_) {
  console.warn('Could not resize iOS app icon to 1024x1024 (sips failed). Ensure the source is 1024x1024.');
}
console.log('iOS app icon:', path.relative(root, iosAppIcon));

// iOS: SplashScreenLogo.imageset
const splashSet = path.join(root, 'ios/ADHDTasks/Images.xcassets/SplashScreenLogo.imageset');
const splashSrc = existsSync(splashImagePath) ? splashImagePath : iconPath;
for (const name of ['image.png', 'image@2x.png', 'image@3x.png']) {
  cpSync(splashSrc, path.join(splashSet, name), { force: true });
}
console.log('iOS splash:', path.relative(root, splashSet));

// Android: launcher foreground (uses android.adaptiveIcon.foregroundImage from app.json)
const androidRes = path.join(root, 'android/app/src/main/res');
const androidForeground = expo.android?.adaptiveIcon?.foregroundImage;
const androidIconPath = androidForeground ? path.join(root, androidForeground.replace(/^\.\//, '')) : iconPath;
if (existsSync(androidIconPath)) {
  const mipmapDirs = ['mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  for (const dir of mipmapDirs) {
    const dirPath = path.join(androidRes, dir);
    if (!existsSync(dirPath)) continue;
    cpSync(androidIconPath, path.join(dirPath, 'ic_launcher_foreground.png'), { force: true });
    cpSync(androidIconPath, path.join(dirPath, 'ic_launcher.png'), { force: true });
    cpSync(androidIconPath, path.join(dirPath, 'ic_launcher_round.png'), { force: true });
  }
  console.log('Android launcher foreground: updated');
}

// Android: splash drawables
const drawableDirs = ['drawable-hdpi', 'drawable-mdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi'];
for (const dir of drawableDirs) {
  const dest = path.join(androidRes, dir, 'splashscreen_logo.png');
  if (existsSync(path.join(androidRes, dir))) {
    cpSync(splashSrc, dest, { force: true });
  }
}
console.log('Android splash: updated');

console.log('\nDone. Native projects now use the icon/splash from app.json. Rebuild with: yarn ios or yarn android');