// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(
      require("../../../../../node_modules/codemirror/lib/codemirror"),
      require("../../../../../node_modules/codemirror/mode/xml/xml"),
      require("./javascript"),
      require("../../../../../node_modules/codemirror/mode/css/css")
    );
  else if (typeof define == "function" && define.amd) // AMD
    define([
      "../../../../../node_modules/codemirror/lib/codemirror",
      "../../../../../node_modules/codemirror/mode/xml/xml",
      "./javascript",
      "../../../../../node_modules/codemirror/mode/css/css"
    ], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  var defaultTags = {
    script: [
      ["lang", /(javascript|babel)/i, "javascript"],
      ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
      ["type", /./, "text/plain"],
      [null, null, "javascript"]
    ],
    style:  [
      ["lang", /^css$/i, "css"],
      ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
      ["type", /./, "text/plain"],
      [null, null, "css"]
    ]
  };

  function maybeBackup(stream, pat, style) {
    var cur = stream.current();
    var close = cur.search(pat);

    if (close > -1) {
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) {
        stream.match(cur);
      }
    }
    return style;
  }

  var attrRegexpCache = {};

  function getAttrRegexp(attr) {
    var regexp = attrRegexpCache[attr];
    if (regexp) return regexp;
    return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
  }

  function getAttrValue(text, attr) {
    var match = text.match(getAttrRegexp(attr))
    return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : ""
  }

  function getTagRegexp(tagName, anchored) {
    return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
  }

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  function findMatchingMode(tagInfo, tagText) {
    for (var i = 0; i < tagInfo.length; i++) {
      var spec = tagInfo[i];
      if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
    }
  }

  CodeMirror.defineMode("ngtemplate", function (config, parserConfig) {
    console.log('CodeMirror.defineMode called');

    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    var tags = {};
    var configTags = parserConfig && parserConfig.tags;
    var configScript = parserConfig && parserConfig.scriptTypes;

    addTags(defaultTags, tags);

    if (configTags)
      addTags(configTags, tags);

    if (configScript)
      for (var i = configScript.length - 1; i >= 0; i--)
        tags.script.unshift([
          "type",
          configScript[i].matches,
          configScript[i].mode
        ])

    function html(stream, state) {

      var style = htmlMode.token(stream, state.htmlState);
      var attr = style === 'attribute';

      // Check if the attribute name starts with [, (, or *
      if (attr) {
        state.inNgAttr = /^[\[(*]/.test(stream.current());
      }

      // Tokenize the attribute value as Typescript
      if (state.inNgAttr) {

        // Eat the equals sign to prevent the HTML parser from getting stuck in attribute value state
        if (stream.current() === '=') {
          stream.backUp(1);
          stream.eat('=');
          return null;
        }

        if (/^["'`]/.test(stream.current())) {
          // Back up to the start of the attribute value
          stream.backUp(stream.current().length);

          // Note the character type so we can recognize when it closes
          var quote = stream.peek();
          var endQuote = new RegExp(quote);

          // Set the mode
          var modeSpec = "application/typescript";
          var mode = CodeMirror.getMode(config, modeSpec);

          // Create the parser
          state.token = function (stream, state) {
            if (stream.match(endQuote)) {
              if (!state.ngBlockStarted) {
                // Mark the opening quote as a string and start the ngBlock
                state.ngBlockStarted = true;
                return 'string';
              } else {
                // This must be the end quote, so mark it as a string and return to HTML mode
                state.token = html;
                state.localState = state.localMode = null;
                state.ngBlockStarted = false;
                return 'string';
              }
            }
            return maybeBackup(stream, endQuote, state.localMode.token(stream, state.localState));
          };

          state.localMode = mode;
          state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, ""));
        }
      }

      return style;
    }

    return {
      startState: function () {
        var state = CodeMirror.startState(htmlMode);
        return {
          token: html,
          inTag: null,
          inNgAttr: false,
          ngBlockStarted: false,
          localMode: null,
          localState: null,
          htmlState: state
        };
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {
          token: state.token,
          inTag: state.inTag,
          localMode: state.localMode, localState: local,
          htmlState: CodeMirror.copyState(htmlMode, state.htmlState)
        };
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter, line) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter);

        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter, line);

        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {
          state: state.localState || state.htmlState,
          mode: state.localMode || htmlMode
        };
      }
    };
  }, "xml", "javascript", "css");

  CodeMirror.defineMIME("text/html", "ngtemplate");
});
