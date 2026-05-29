const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);
const workspaceRoot = path.resolve(__dirname, "../..");

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    "react-native-safe-area-context": path.join(
      workspaceRoot,
      "node_modules/react-native-safe-area-context"
    ),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
