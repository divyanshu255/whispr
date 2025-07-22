# 🤖 Whispr – AI Math & Physics Chat App with Gemini

Whispr is a smart chat app built with **React Native + Expo**, powered by **Google Gemini API**, and tailored for helping users with **math and physics** problems. It supports **LaTeX formula rendering** via MathJax inside a WebView, displaying textbook-style answers inside a sleek chat UI.

---

## 📱 Features

- 🤖 Google Gemini 1.5 Pro AI integration
- 📐 Beautiful LaTeX rendering with MathJax
- 💬 Chat interface with user/bot avatars
- 🌙 Dark mode support (auto-detects)
- 📲 APK-ready with proper build config
- ✅ Built using Expo + React Native

---

## 📂 Project Structure

whispr/
├── assets/
│ └── images/logo.jpg # Used as icon & splash
├── components/
│ └── LatexRenderer.tsx # MathJax WebView renderer
├── screens/
│ └── ChatScreen.tsx # Chat UI with Gemini
├── app.config.ts # Expo config + .env support
├── eas.json # EAS build config
├── .env # API key
└── README.md

yaml
Copy
Edit

---

## 🔑 Environment Setup

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
This is injected into app.config.ts using:

ts
Copy
Edit
import 'dotenv/config';
🧠 How Math Rendering Works
Gemini responses may include LaTeX like $$E=mc^2$$. These are parsed by:

ts
Copy
Edit
const parts = text.split(/(\$\$[^$]+\$\$)/g);
Then displayed using a WebView running MathJax:

html
Copy
Edit
<div class="math">\\[ E = mc^2 \\]</div>
✅ Output looks clean, centered, and big — like textbook math!

💬 ChatScreen.tsx Highlights
Parses both plain text and LaTeX blocks

Avatars: 🧑 (user), 🤖 (Gemini), ⚠️ (error)

Smooth scroll to latest message

Gemini is typing indicator (ActivityIndicator)

✏️ LatexRenderer.tsx
tsx
Copy
Edit
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
      <WebView source={{ html }} scrollEnabled={false} style={{ flex: 1, backgroundColor: 'transparent' }} />
    </View>
  );
};

export default LatexRenderer;
⚙️ Build for Android (APK)
To build an APK instead of AAB:

eas.json
json
Copy
Edit
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
Command
bash
Copy
Edit
eas build -p android --profile production
🔧 app.config.ts (Updated for logo.jpg)
ts
Copy
Edit
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
👨‍💻 Recruiter Summary
I built an intelligent math & physics chat app using Google Gemini, React Native, and WebView-based LaTeX rendering. Users can chat with Gemini and receive real textbook-style answers, with formulas rendered cleanly. The UI is responsive, supports dark mode, and is deployable to Android as an APK.

📸 Screenshots
Add here (optional)
Chat with Gemini, Formula Render, Splash screen, etc.

📜 License
MIT – Free to use, share, and modify.
