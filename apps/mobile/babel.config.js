module.exports = function (api) {
  api.cache(true);
  return {
    ignore: [/node_modules/],
    presets: [
      [require.resolve("babel-preset-expo"), { jsxImportSource: "nativewind" }],
      require.resolve("nativewind/babel"),
    ],
    plugins: [
      require.resolve("react-native-reanimated/plugin"),
    ],
  };
};
