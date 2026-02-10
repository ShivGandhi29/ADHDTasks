#!/bin/bash
# Bump app version and/or build number across iOS, app.json, and package.json.
# Usage:
#   ./scripts/update-version-ios.sh           # bump patch + build (default)
#   ./scripts/update-version-ios.sh --patch   # same
#   ./scripts/update-version-ios.sh --minor   # bump minor, patch=0, build+1
#   ./scripts/update-version-ios.sh --major   # bump major, minor=0, patch=0, build+1
#   ./scripts/update-version-ios.sh --build-only  # only bump build number (version unchanged)
# Run from app root (directory containing package.json, app.json, ios/).

set -e

MODE="${1:---patch}"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$DIR/.." && pwd)"
PBXPROJ="$PROJECT_ROOT/ios/ADHDTasks.xcodeproj/project.pbxproj"
INFO_PLIST="$PROJECT_ROOT/ios/ADHDTasks/Info.plist"
APP_JSON="$PROJECT_ROOT/app.json"
PACKAGE_JSON="$PROJECT_ROOT/package.json"

# Read current version and build from project.pbxproj
CURRENT_VERSION=$(grep "MARKETING_VERSION = " "$PBXPROJ" | head -n 1 | cut -d'=' -f2 | tr -d ';' | tr -d ' ')
CURRENT_BUILD=$(grep "CURRENT_PROJECT_VERSION = " "$PBXPROJ" | head -n 1 | cut -d'=' -f2 | tr -d ';' | tr -d ' ')

# Split version into major.minor.patch
IFS='.' read -r -a version_parts <<< "$CURRENT_VERSION"
MAJOR="${version_parts[0]}"
MINOR="${version_parts[1]:-0}"
PATCH="${version_parts[2]:-0}"

NEW_BUILD=$((CURRENT_BUILD + 1))

case "$MODE" in
  --patch)
    NEW_PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
    ;;
  --minor)
    NEW_MINOR=$((MINOR + 1))
    NEW_VERSION="$MAJOR.$NEW_MINOR.0"
    ;;
  --major)
    NEW_MAJOR=$((MAJOR + 1))
    NEW_VERSION="$NEW_MAJOR.0.0"
    ;;
  --build-only)
    NEW_VERSION="$CURRENT_VERSION"
    ;;
  -h|--help)
    echo "Usage: $0 [--patch|--minor|--major|--build-only]"
    echo "  --patch      Bump patch (e.g. 1.0.0 → 1.0.1) and build (default)"
    echo "  --minor      Bump minor (e.g. 1.0.0 → 1.1.0) and build"
    echo "  --major      Bump major (e.g. 1.0.0 → 2.0.0) and build"
    echo "  --build-only Only bump build number; version string unchanged"
    exit 0
    ;;
  *)
    echo "Unknown option: $MODE" >&2
    echo "Use --patch, --minor, --major, or --build-only" >&2
    exit 1
    ;;
esac

# Update project.pbxproj
sed -i '' "s/MARKETING_VERSION = $CURRENT_VERSION/MARKETING_VERSION = $NEW_VERSION/g" "$PBXPROJ"
sed -i '' "s/CURRENT_PROJECT_VERSION = $CURRENT_BUILD/CURRENT_PROJECT_VERSION = $NEW_BUILD/g" "$PBXPROJ"

# Update Info.plist
if [[ -f "$INFO_PLIST" ]]; then
  /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $NEW_VERSION" "$INFO_PLIST" 2>/dev/null || true
  /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $NEW_BUILD" "$INFO_PLIST" 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Add :CFBundleVersion string $NEW_BUILD" "$INFO_PLIST"
fi

# Update app.json and package.json (skip version string when build-only)
if [[ "$MODE" != "--build-only" ]]; then
  if [[ -f "$APP_JSON" ]]; then
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$APP_JSON"
  fi
  if [[ -f "$PACKAGE_JSON" ]]; then
    sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE_JSON"
  fi
fi

echo "Version updated to $NEW_VERSION (Build $NEW_BUILD)"
