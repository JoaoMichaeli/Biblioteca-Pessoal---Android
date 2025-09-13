module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
      ],
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@services": "./src/services",
            "@store": "./src/store",
            "@styles": "./src/styles",
            "@types": "./src/types",
            "@utils": "./src/utils",
            "@constants": "./src/constants",
            "@hooks": "./src/hooks",
            "@queries": "./src/queries",
            "@design-system": "./src/design-system",
            "@lib": "./src/lib",
            "@storage": "./src/storage",
            "@api": "./src/api",
          }
        }
      ],
    ],
  }
};


