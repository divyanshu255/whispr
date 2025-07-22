import 'dotenv/config';

export default {
  expo: {
    name: "Whispr",
    slug: "Whispr",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.jpg", // ✅ Use logo.jpg as app icon
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logo.jpg", // ✅ Use logo.jpg as splash image
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.jpg", // Not ideal (should be transparent PNG ideally), but ok for your case
        backgroundColor: "#ffffff"
      },
      package: "com.yourcompany.whispr", // ✅ Replace with real package ID if publishing
      icon: "./assets/images/logo.jpg"
    },
    web: {
      favicon: "./assets/images/logo.jpg"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo.jpg",
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      eas: {
        projectId: "b09812d1-3689-477f-a1c2-0e28c97834c1"
      }
    }
  }
};
