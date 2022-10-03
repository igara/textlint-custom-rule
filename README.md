# textlint-custom-rule

## install textlint rule

add [vscode-textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint).

package.json

```
    "@igara/textlint-custom-rule": "https://github.com/igara/textlint-custom-rule.git#master",
    "@igara/textlint-rule-writing-guideline": "./node_modules/@igara/textlint-custom-rule/packages/textlint-rule-writing-guideline",
```

.textlintrc.js

```
module.exports = {
  plugins: {
    '@textlint/text': {
      extensions: [
        '.php',
        '.ctp',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.css',
        '.scss',
        '.md',
        '.txt',
        '.csv',
        '.json',
        '.yaml',
        '.yml',
        '.sql',
        // ...etc other settings.
      ],
    },
  },
  rules: {
    '@igara/writing-guideline': {
      severity: 'warning',
    },
    // ...etc other settings.
  },
};

```

.vscode/settings.json

```
  "textlint.languages": [
    "php",
    "html",
    "typescript",
    "typescriptreact",
    "javascript",
    "javascriptreact",
    "css",
    "scss",
    "markdown",
    "plaintext",
    "csv",
    "json",
    "yaml",
    "sql"
  ],
```

vscode reload.....

## development

### setup

```
npm install -g pnpm@7.9.0
pnpm install
```

### test

run and debug from vscode.

or

```
npm run test
```

### import spreadsheet

Create Google Application.

see https://developers.google.com/sheets/api/quickstart/nodejs

Credentials JSON rename `credentials.json`.
`credentials.json` move `packages/textlint-writing-guideline` directory.

```
npm run spreadsheet
```
