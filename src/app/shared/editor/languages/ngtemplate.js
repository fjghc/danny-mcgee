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
    console.log('maybeBackup called with:', {
      stream: stream,
      pat: pat,
      style: style
    });
    var cur = stream.current();
    var close = cur.search(pat);
    console.log('stream.current:', stream.current());
    console.log('cur.length: ' + cur.length);
    console.log('close = cur.search(pat):', close);

    if (close > -1) {
      console.log('close > -1, so back up by cur.length - close');
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      console.log('\'</\' matched on cur, so back up by cur.length');
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) {
        console.log('!stream.match(pat, false), so stream.match(cur)');
        stream.match(cur);
      }
    }
    console.log('returning style:', style);
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

      // console.log('html called');

      var style = htmlMode.token(stream, state.htmlState);
      var attr = style === 'attribute'; // /\battribute\b/.test(style);

      if (attr) {
        state.inNgAttr = /^[\[(*]/.test(stream.current());
      }

      if (state.inNgAttr && stream.current() === "=") {
        // We just started an attribute value that should be tokenized as Javascript
        let quote;
        if (stream.match(/^["'`]/, false)) {

          // Deal with the opening quote somehow
          quote = stream.peek();

          var modeSpec = "application/typescript";
          var mode = CodeMirror.getMode(config, modeSpec);
          var endQuote = new RegExp(quote);

          state.token = function (stream, state) {
            if (stream.match(endQuote)) {
              if (state.ngBlockStarted) {
                state.token = html;
                state.localState = state.localMode = null;
                state.ngBlockStarted = false;
                return 'string';
              } else {
                state.ngBlockStarted = true;
                return 'string';
              }
            }
            return maybeBackup(stream, endQuote, state.localMode.token(stream, state.localState));
          };

          state.localMode = mode;
          state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, ""));
        }
      }

      // if (state.inNgAttr && style === 'string') {
      //   console.log(stream.current());
      //   console.log('I think this should be tokenized as Typescript^^^\n\n');
      // }
      //
      // if (/\bbracket\b/.test(style) && state.inNgAttr) {
      //   state.inNgAttr = false;
      // }

      var tag = /\btag\b/.test(style);
      var tagName;

      if (tag && !/[<>\s\/]/.test(stream.current())
          && (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase())
          && tags.hasOwnProperty(tagName)) {

        state.inTag = tagName + " ";

      } else if (state.inTag && tag && />$/.test(stream.current())) {

        // We just started a <script> tag, so set the mode to Javascript
        var inTag = /^([\S]+) (.*)/.exec(state.inTag);

        state.inTag = null;
        var modeSpec = stream.current() === ">" && findMatchingMode(tags[inTag[1]], inTag[2]);
        var mode = CodeMirror.getMode(config, modeSpec);
        var endTagA = getTagRegexp(inTag[1], true);
        var endTag = getTagRegexp(inTag[1], false);

        console.log('vars set:', {
          modeSpec: modeSpec,
          mode: mode,
          endTagA: endTagA,
          endTag: endTag
        });

        state.token = function (stream, state) {
          console.log('(state.token function)', {
            stream: stream,
            state: state
          });
          if (stream.match(endTagA, false)) {
            // We just closed the script tag, so reset mode to HTML
            console.log('stream.match(endTagA)');
            state.token = html;
            state.localState = state.localMode = null;
            console.log('setting state.token to html');
            console.log('setting state.localState and state.localMode to null');

            return null;
          }
          console.log('returning maybeBackup');
          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
        };

        console.log('setting state.localMode to mode');
        state.localMode = mode;
        console.log('setting state.localState to CodeMirror.startState(mode, htmlMode.indent(state.htmlState, ""))');
        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, ""));

      } else if (state.inTag) {

        state.inTag += stream.current();
        if (stream.eol())
          state.inTag += " ";
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
