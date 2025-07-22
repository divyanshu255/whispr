# 🤖 Whispr – AI Math & Physics Chat App with Gemini

**Whispr** is a smart chat app built with **React Native + Expo**, powered by **Google Gemini API**, and tailored to help users with **math and physics** problems. It features **LaTeX formula rendering** via MathJax in a WebView, giving users a clean, textbook-style experience.

---

## 📱 Features

* 🤖 Gemini 1.5 Pro AI integration
* 📀 Math formula support using MathJax
* 💬 Chat interface with user/bot/error avatars
* 🌙 Dark mode support (auto-detected)
* 📲 Ready to build APK via EAS
* ✅ Built with Expo SDK 50 and React Native

---

## 📂 Project Structure

```
whispr/
├── assets/
│   └── images/
│       └── logo.jpg            # Used as icon and splash image
├── components/
│   └── LatexRenderer.tsx      # Renders LaTeX using MathJax
├── screens/
│   └── ChatScreen.tsx         # Main chat UI with Gemini integration
├── app.config.ts              # Expo + EAS + .env config
├── eas.json                   # EAS build configuration
├── .env                       # API key (not committed)
└── README.md
```

---

## 🔑 Environment Setup

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The key is injected into `app.config.ts`:

```ts
import 'dotenv/config';
```

---

## 🧠 How LaTeX Rendering Works

Gemini might return LaTeX math expressions like:

```
$$E = mc^2$$
```

These are parsed using:

```ts
const parts = text.split(/(\$\$[^$]+\$\$)/g);
```

Then rendered inside `WebView` using MathJax:

```html
<div class="math">\\[ E = mc^2 \\]</div>
```

This results in formulas being rendered:

* Centered
* Scaled properly
* Styled like textbooks

---

## 💬 ChatScreen.tsx Highlights

* Parses Gemini responses into text + math blocks
* User messages use 🧑, Gemini responses use 🤖
* Gemini typing indicator: `ActivityIndicator`
* Uses `KeyboardAwareScrollView` and `SafeAreaView`
* Smooth scroll-to-bottom on every new message

---

## ✏️ LatexRenderer.tsx Code

```tsx
import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { WebView } from 'react-native-webview';

const LatexRenderer = ({ latex }) => {
  const colorScheme = useColorScheme();

  const html = `
    <!DOCTYPE html><html><head>
    <style>
      body { margin: 0; background: transparent; }
      .math {
        font-size: 22px; color: ${colorScheme === 'dark' ? '#fff' : '#000'};
        display: flex; justify-content: center; padding: 8px;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    </head><body>
      <div class="math">\\[${latex}\\]</div>
    </body></html>
  `;

  return (
    <View style={{ width: '100%', minHeight: 60 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        scrollEnabled={false}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        javaScriptEnabled
      />
    </View>
  );
};

export default LatexRenderer;
```

---

## ⚙️ Build for Android (APK)

### Update `eas.json`

```json
{
  "cli": {
    "version": ">= 16.16.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "autoIncrement": true
    }
  }
}
```

### Run APK build

```bash
eas build -p android --profile production
```

---

## 🔧 app.config.ts

```ts
import 'dotenv/config';

export default {
  expo: {
    name: "Whispr",
    slug: "Whispr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.jpg",
    splash: {
      image: "./assets/images/logo.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    android: {
      package: "com.yourcompany.whispr",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.jpg",
        backgroundColor: "#ffffff"
      },
      buildType: "apk"
    },
    ios: {
      supportsTablet: true
    },
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      eas: {
        projectId: "your-eas-project-id"
      }
    }
  }
};
```

---

## 💼 Recruiter Summary

> I created a cross-platform AI chat app using React Native + Gemini API, focused on helping users solve math and physics problems. It supports LaTeX rendering via MathJax inside a WebView, mimicking textbook-style output. The design is clean, responsive, and works well in both light and dark mode. The app is optimized for Android APK builds using EAS.

---

## 📸 Screenshots

> *(Add your screenshots here)*

* Splash screen with logo
* Chat with formula rendering
* Dark mode preview

---

## 📜 License

MIT — Free to use, modify, and distribute.

---

## 😊 Author

* Name: *Your Name Here*
* GitHub: [yourgithub](https://github.com/yourgithub)
* Email: [your@email.com](mailto:your@email.com)

---
