import { TextlintRuleModule } from '@textlint/types';

import writingJSON from '../writing.json';
const writing = writingJSON as any;
const ngWords = Object.keys(writing);

export interface Options {
  // if the Str includes `allows` word, does not report it
  allows?: string[];
}

const report: TextlintRuleModule<Options> = (context) => {
  const { Syntax, RuleError, report, fixer, getSource } = context;

  return {
    [Syntax.Str](node) {
      const text = getSource(node);

      const ngWordFilter = ngWords.filter((ng) => {
        const reg = new RegExp(ng, 'g');
        return reg.test(text);
      });

      if (!ngWordFilter.length) return;

      ngWordFilter.forEach((ngWord) => {
        if (!writing[ngWord]) return;

        const ng = writing[ngWord];

        const ignore = ng.ignore;
        if (ignore) {
          const reg = new RegExp(ignore, 'g');
          if (reg.test(text)) return;
        }

        const index = text.search(ngWord);
        const length = ngWord.length;
        const replace = fixer.replaceTextRange([index, index + length], ng.ok);

        const ruleError = new RuleError(`${ngWord} -> ${ng.ok}`, {
          index,
          fix: replace,
        });
        report(node, ruleError);
      });
    },
  };
};
export default report;
