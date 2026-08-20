module.exports = {
  expo: {
    name: "Aperture Player",
    slug: "aperture-player",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0E0E10",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.apertureplayer.app",
    },
    android: {
      package: "com.apertureplayer.app",
      adaptiveIcon: {
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundColor: "#0E0E10",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [],
  },
};
