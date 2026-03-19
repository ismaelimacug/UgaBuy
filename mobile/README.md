# UgaBuy Android Mobile Application

## Overview
Native Android application for UgaBuy e-commerce platform built with React Native.

## Features
- User Authentication (Login/Register)
- Browse Products by Category
- Product Search and Filtering
- Shopping Cart Management
- Secure Checkout with Payment Options
- Order History and Tracking
- User Profile Management
- About, Contact, FAQ Pages

## Tech Stack
- **Framework**: React Native 0.73.2
- **Navigation**: React Navigation 6
- **State Management**: Context API
- **API Client**: Axios
- **Storage**: AsyncStorage
- **Icons**: React Native Vector Icons

## Prerequisites
- Node.js 18+ 
- Java Development Kit (JDK) 11+
- Android Studio
- Android SDK (API 33)

## Installation

### 1. Install Dependencies
```bash
cd /app/mobile
yarn install
```

### 2. Configure Android Environment
Ensure you have:
- Android Studio installed
- Android SDK Platform 33
- Android Build Tools
- Android Emulator or physical device

### 3. Start Metro Bundler
```bash
yarn start
```

### 4. Run on Android
```bash
# In a new terminal
yarn android
```

## Project Structure
```
mobile/
├── src/
│   ├── context/          # Auth & Cart context providers
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # All app screens
│   ├── services/         # API service layer
│   └── utils/            # Helper functions
├── android/              # Android native code
├── App.js                # Root component
└── package.json          # Dependencies
```

## Screens
- **Auth**: Login, Register
- **Shopping**: Home, Products, Product Detail, Cart, Checkout
- **Orders**: Order List, Order Detail
- **Profile**: User Profile, About, Contact, FAQ
- **Legal**: Terms, Privacy, Returns

## API Configuration
The app connects to: `https://techstore-ug.preview.emergentagent.com/api`

To change the API URL, edit: `/app/mobile/src/services/api.js`

## Build for Production

### Generate Release APK
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Generate App Bundle (for Play Store)
```bash
cd android
./gradlew bundleRelease
```

Bundle location: `android/app/build/outputs/bundle/release/app-release.aab`

## Publishing to Google Play Store

### 1. Generate Signing Key
```bash
keytool -genkeypair -v -keystore ugabuy-release-key.keystore -alias ugabuy -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Gradle
Add to `android/gradle.properties`:
```
MYAPP_RELEASE_STORE_FILE=ugabuy-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=ugabuy
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

### 3. Build Signed Bundle
```bash
cd android && ./gradlew bundleRelease
```

### 4. Upload to Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Upload the AAB file
4. Complete store listing (description, screenshots, etc.)
5. Submit for review

## Required Assets for Play Store
- **App Icon**: 512x512px
- **Feature Graphic**: 1024x500px  
- **Screenshots**: At least 2 (phone: 1080x1920px)
- **Privacy Policy URL**
- **App Description** (4000 characters max)

## Testing
```bash
# Run tests
yarn test
```

## Troubleshooting

### Metro bundler issues
```bash
yarn start --reset-cache
```

### Android build errors
```bash
cd android && ./gradlew clean
cd .. && yarn android
```

### Clear app data
```bash
adb uninstall com.ugabuy.app
```

## Environment Variables
None required for production build. API URL is hardcoded in `src/services/api.js`.

## Support
For issues or questions:
- Email: kaluleismaelimac@gmail.com
- Phone: +256 753 645 800

## License
© 2026 UgaBuy. All rights reserved.
