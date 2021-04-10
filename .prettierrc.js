// prettier.config.js or .prettierrc.js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  overrides: [
    {
      files: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx"],
      options: {
        semi: true,
        singleQuote: true,
        trailingComma: "es5",
      },
    },
  ],
};
