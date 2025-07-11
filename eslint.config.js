module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    "import/resolver": {
      node: {
        paths: ["src/*"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      createClass: "createReactClass",
      pragma: "React",
      fragment: "Fragment",
      version: "detect",
      flowVersion: "0.53",
    },
  },
  plugins: ["prettier", "react", "react-hooks"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 8,
    requireConfigFile: false,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      impliedStrict: true,
    },
  },
  rules: {
    "react/display-name": 0,
    "react-hooks/exhaustive-deps": 0,
    "no-unused-vars": "warn",
    "prettier/prettier": [
      2,
      {
        printWidth: 100,
        singleQuote: true,
        trailingComma: "none",
        tabWidth: 2,
      },
    ],
  },
};
