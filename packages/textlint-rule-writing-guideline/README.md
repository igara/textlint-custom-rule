# textlint-rule-writing-guideline

## Install

package.json

```
    "@igara/textlint-custom-rule": "https://github.com/igara/textlint-custom-rule.git#master",
    "@igara/textlint-rule-writing-guideline": "./node_modules/@igara/textlint-custom-rule/packages/textlint-rule-writing-guideline",
```

## Usage

Via `.textlintrc`(Recommended)

```json
{
  "rules": {
    "@igara/writing-guideline": true
  }
}
```

Via CLI

```
textlint --rule @igara/writing-guideline README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## License

ISC ©
