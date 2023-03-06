module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: ["!**/*", "*.config.js", ".eslintrc.js", ".prettierrc.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: "./",
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: true,
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": "off",
        "@typescript-eslint/no-undef": "off",
        radix: "error",
        eqeqeq: "error",
        "no-shadow": "off",
        "no-bitwise": "off",
        "prettier/prettier": "off",
        "jsx-quotes": ["warn", "prefer-single"],
        "func-call-spacing": "off", // conflict
        "@typescript-eslint/func-call-spacing": "warn",
        "keyword-spacing": "off", // conflict
        "@typescript-eslint/keyword-spacing": "warn",
        "@typescript-eslint/member-delimiter-style": "warn",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "function",
            format: ["StrictPascalCase", "strictCamelCase"],
          },
          {
            selector: ["variable", "parameter"],
            format: ["PascalCase", "camelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: ["interface", "enum"],
            format: ["StrictPascalCase"],
          },
        ],
        "@typescript-eslint/restrict-plus-operands": [
          "error",
          {
            allowAny: true,
            checkCompoundAssignments: true,
          },
        ],
        semi: "off",
        "@typescript-eslint/semi": "warn",
        "arrow-spacing": ["warn", { before: true, after: true }],
        "block-spacing": ["warn", "always"],
        "key-spacing": "warn",
        "max-len": ["warn", { code: 120 }],
        "no-lonely-if": "warn",
        "no-multiple-empty-lines": ["warn", { max: 2 }],
        "no-trailing-spaces": "warn",
        "no-useless-escape": "warn",
        "no-unneeded-ternary": "warn",
        "no-unused-vars": "off", // conflict
        "no-var": "error",
        "prefer-const": "error",
        quotes: [
          "warn",
          "single",
          { avoidEscape: true, allowTemplateLiterals: true },
        ],
        "import/no-duplicates": ["error"],
        "no-void": "off",
        "@typescript-eslint/no-var-requires": "error",
        "react/no-unstable-nested-components": [
          "error",
          { allowAsProps: true },
        ],
        "import/no-named-as-default-member": ["off"],
        "import/default": ["off"],
        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
        "react/self-closing-comp": ["off"],
      },
    },
  ],
};
