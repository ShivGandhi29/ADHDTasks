#!/usr/bin/env bash
# Build Android APK and optionally install on connected device(s).
# Usage:
#   ./scripts/build-and-install-android.sh           # build debug, install on all devices
#   ./scripts/build-and-install-android.sh --release # build release APK, then install
#   ./scripts/build-and-install-android.sh --build-only  # build only, print APK path (download it from there)
#   ./scripts/build-and-install-android.sh --device SERIAL  # install only on device with given serial
#
# Run from repo root (ADHDTasks/) or from ADHDTasks/ADHDTasks/.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Project root = directory containing android/ and package.json
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_DIR="$PROJECT_ROOT/android"
BUILD_ONLY=false
VARIANT="debug"
DEVICE_SERIAL=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --build-only)
      BUILD_ONLY=true
      shift
      ;;
    --release)
      VARIANT="release"
      shift
      ;;
    --device)
      DEVICE_SERIAL="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--release] [--build-only] [--device SERIAL]"
      echo "  --release     Build release APK (default: debug)"
      echo "  --build-only  Build APK and print path only; do not install"
      echo "  --device ID   Install only on device with this adb serial"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

if [[ ! -d "$ANDROID_DIR" ]]; then
  echo "Error: android/ not found at $ANDROID_DIR" >&2
  exit 1
fi

GRADLE_TASK="assembleDebug"
[[ "$VARIANT" == "release" ]] && GRADLE_TASK="assembleRelease"
echo "Building Android $VARIANT APK..."
(cd "$ANDROID_DIR" && ./gradlew "$GRADLE_TASK" --no-daemon)

APK_DIR="$ANDROID_DIR/app/build/outputs/apk/$VARIANT"
APK_NAME="app-$VARIANT.apk"
APK_PATH="$APK_DIR/$APK_NAME"

if [[ ! -f "$APK_PATH" ]]; then
  echo "Error: APK not found at $APK_PATH" >&2
  exit 1
fi

echo ""
echo "APK built successfully:"
echo "  $APK_PATH"
echo ""

# When build-only, build release for smaller size and copy to dist/
if [[ "$BUILD_ONLY" == true ]]; then
  # If we built debug, offer to use release for sharing (smaller)
  if [[ "$VARIANT" == "debug" ]]; then
    echo "Building release APK for sharing (smaller file size)..."
    (cd "$ANDROID_DIR" && ./gradlew assembleRelease --no-daemon)
    APK_PATH="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
    if [[ ! -f "$APK_PATH" ]]; then
      echo "Release build failed, using debug APK." >&2
      APK_PATH="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
    fi
  fi
  DIST_DIR="$PROJECT_ROOT/dist"
  mkdir -p "$DIST_DIR"
  APP_NAME="Focusd"
  VERSION="1.0.0"
  if [[ -f "$PROJECT_ROOT/app.json" ]]; then
    VERSION=$(node -p "try { require('$PROJECT_ROOT/app.json').expo.version } catch(e) { '1.0.0' }" 2>/dev/null || echo "1.0.0")
  fi
  SHARE_NAME="${APP_NAME}-${VERSION}-android.apk"
  SHARE_PATH="$DIST_DIR/$SHARE_NAME"
  cp "$APK_PATH" "$SHARE_PATH"
  echo "Shareable APK (send this file to friends):"
  echo "  $SHARE_PATH"
  echo ""
  echo "Install on Android: open the APK and tap Install. If nothing happens:"
  echo "  Settings → Apps → (Chrome/Files/your browser) → Install unknown apps → Allow."
  echo ""
  exit 0
fi

# Install on device(s)
if command -v adb >/dev/null 2>&1; then
  if [[ -n "$DEVICE_SERIAL" ]]; then
    echo "Installing on device $DEVICE_SERIAL..."
    adb -s "$DEVICE_SERIAL" install -r "$APK_PATH"
    echo "Done."
  else
    DEVICES=$(adb devices -l | grep -w "device" | awk '{print $1}')
    if [[ -z "$DEVICES" ]]; then
      echo "No devices connected. Connect a device with USB debugging enabled or use: adb install -r $APK_PATH"
      exit 1
    fi
    for dev in $DEVICES; do
      echo "Installing on device $dev..."
      adb -s "$dev" install -r "$APK_PATH"
    done
    echo "Done."
  fi
else
  echo "adb not found. Install the Android SDK platform-tools, then run:"
  echo "  adb install -r $APK_PATH"
  exit 1
fi
