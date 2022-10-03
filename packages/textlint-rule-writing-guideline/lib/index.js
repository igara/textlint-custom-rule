"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _writing = _interopRequireDefault(require("../writing.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writing = _writing.default;
var ngWords = Object.keys(writing);

var report = context => {
  var {
    Syntax,
    RuleError,
    report,
    fixer,
    getSource
  } = context;
  return {
    [Syntax.Str](node) {
      var text = getSource(node);
      var ngWordFilter = ngWords.filter(ng => {
        var reg = new RegExp(ng, 'g');
        return reg.test(text);
      });
      if (!ngWordFilter.length) return;
      ngWordFilter.forEach(ngWord => {
        if (!writing[ngWord]) return;
        var ng = writing[ngWord];
        var ignore = ng.ignore;

        if (ignore) {
          var reg = new RegExp(ignore, 'g');
          if (reg.test(text)) return;
        }

        var index = text.search(ngWord);
        var length = ngWord.length;
        var replace = fixer.replaceTextRange([index, index + length], ng.ok);
        var ruleError = new RuleError("".concat(ngWord, " -> ").concat(ng.ok), {
          index,
          fix: replace
        });
        report(node, ruleError);
      });
    }

  };
};

var _default = report;
exports.default = _default;
//# sourceMappingURL=index.js.map