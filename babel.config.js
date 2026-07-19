module.exports = function (api) {
  api.cache(true);
  return {
    presets: [[require.resolve("babel-preset-expo"), { jsxImportSource: "nativewind" }]],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
    plugins: [require.resolve("nativewind/babel"), "react-native-reanimated/plugin"],
  };
};