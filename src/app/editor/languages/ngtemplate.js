// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(
      require("../../../../node_modules/codemirror/lib/codemirror"),
      require("../../../../node_modules/codemirror/mode/xml/xml"),
      require("./javascript"),
      require("../../../../node_modules/codemirror/mode/css/css")
    );
  else if (typeof define == "function" && define.amd) // AMD
    define([
      "../../../../node_modules/codemirror/lib/codemirror",
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

  function tokenizeTypescript(stream, pat, style, state) {
    var cur = stream.current();
    var close = cur.search(pat);

    // Special case: always style "of" as a keyword since this parser
    // doesn't know the context and it gets used a lot in *ngFor statements
    if (cur === 'of') {
      return 'keyword';
    }

    // Keep track of local vars defined in ngFor blocks
    if (style === 'def' && state.ngForBlock && state.ngForBlock.started) {
      state.ngForBlock.vars.push(stream.current());
    }
    if (style === 'variable' && state.ngForBlock && state.ngForBlock.started) {
      if (state.ngForBlock.vars.indexOf(stream.current()) !== -1) {
        return 'variable-2';
      }
    }

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

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  CodeMirror.defineMode("ngtemplate", function (config, parserConfig) {

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

      // Get the Typescript mode for insertion
      var tsMode = CodeMirror.getMode(config, "application/typescript");

      var style = htmlMode.token(stream, state.htmlState);
      var attr = style === 'attribute';

      // Check if the attribute name starts with [, (, or *
      if (attr) {
        state.inNgAttr = /^[\[(*]/.test(stream.current());
      }

      // Tokenize the attribute value as Typescript
      if (state.inNgAttr) {

        // Keep track of ngFor blocks so we can recognize local vars
        if (stream.current() === '*ngFor') {
          state.ngForBlock = {
            started: true,
            tagName: state.htmlState.tagName,
            indent: state.htmlState.tagStart,
            vars: []
          };
        }

        // Eat the equals sign to prevent the HTML parser from getting stuck in the attr value state
        if (stream.current() === '=') {
          stream.backUp(1);
          stream.eat('=');
          return null;
        }

        if (/^["'`]/.test(stream.current())) {
          // Back up to the start of the attribute value
          stream.backUp(stream.current().length);

          // Note the quote character so we can recognize when it closes
          var quote = new RegExp(stream.peek());

          // Create the parser
          state.token = function (stream, state) {
            if (stream.match(quote)) {
              if (!state.ngBlockStarted) {
                // Style the opening quote as a string and start the ngBlock
                state.ngBlockStarted = true;
                return 'string';
              } else {
                // This must be the end quote, so style it as a string and return to HTML mode
                state.token = html;
                state.localState = state.localMode = null;
                state.ngBlockStarted = false;
                return 'string';
              }
            }
            return tokenizeTypescript(stream, quote, state.localMode.token(stream, state.localState), state);
          };

          // Set the mode and start the local Typescript state
          state.localMode = tsMode;
          state.localState = CodeMirror.startState(tsMode, htmlMode.indent(state.htmlState, ""));
        }
      }

      // Close out any open ngFor blocks
      if (state.ngForBlock && state.ngForBlock.started
          && state.ngForBlock.indent === state.htmlState.indented
          && /<\//.test(stream.current())
          && stream.match(state.ngForBlock.tagName, false)) {
        state.ngForBlock = {
          started: false,
          tagName: null,
          indent: null,
          vars: []
        }
      }

      // Check for Typescript interpolation inside regular text
      var interpStart = /{{/;
      var interpStop = /}}/;
      var interpPos = stream.current().search(interpStart);

      if (interpPos !== -1) {
        // Interpolator brackets found, so back up the stream to their start position
        stream.backUp(stream.current().length - interpPos);

        state.token = function(stream, state) {
          if (stream.match(interpStart)) {
            // Style the interp brackets
            return 'operator-2';
          }
          if (stream.match(interpStop)) {
            // Stop parsing Typescript
            state.token = html;
            state.localState = state.localMode = null;
            // Style the closing brackets
            return 'operator-2';
          }
          return tokenizeTypescript(stream, interpStop, state.localMode.token(stream, state.localState), state);
        };

        // Set the mode and start the local Typescript state
        state.localMode = tsMode;
        state.localState = CodeMirror.startState(tsMode, htmlMode.indent(state.htmlState, ""));
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
          ngForBlock: {
            started: false,
            tagName: null,
            indent: null,
            vars: [],
          },
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
