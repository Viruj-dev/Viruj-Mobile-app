const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const mobileRoot = path.join(projectRoot, "apps/mobile");
const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders || []), mobileRoot];
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    "react-native-safe-area-context": path.join(
      projectRoot,
      "node_modules/react-native-safe-area-context"
    ),
  },
};

module.exports = withNativeWind(config, { input: "./apps/mobile/global.css" });
