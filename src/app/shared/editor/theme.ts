import { editor } from 'monaco-editor';
import IStandaloneThemeData = editor.IStandaloneThemeData;
import { themeColors } from './theme-colors';

export const dm_theme: IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: false,
  rules: [
    { token: '', foreground: themeColors.grayLightest, background: themeColors.grayDarker },
    { token: 'invalid', foreground: themeColors.red },
    { token: 'emphasis', fontStyle: 'italic' },
    { token: 'strong', fontStyle: 'bold' },

    { token: 'variable', foreground: themeColors.pink },
    { token: 'variable.predefined', foreground: themeColors.pinkLight },
    { token: 'variable.parameter', foreground: themeColors.pinkLight },
    { token: 'constant', foreground: themeColors.pinkLight },
    { token: 'comment', foreground: themeColors.blueDark, fontStyle: 'italic' },
    { token: 'number', foreground: themeColors.turquoise },
    { token: 'number.hex', foreground: themeColors.turquoise },
    { token: 'regexp', foreground: themeColors.green },
    { token: 'annotation', foreground: themeColors.blueBold },
    { token: 'type', foreground: themeColors.blueLight, fontStyle: 'italic' },

    { token: 'delimiter', foreground: themeColors.grayLightest },
    { token: 'delimiter.html', foreground: themeColors.grayLighter },
    { token: 'delimiter.xml', foreground: themeColors.grayLighter },

    { token: 'tag', foreground: themeColors.red },
    { token: 'tag.id.pug', foreground: themeColors.blueLight },
    { token: 'tag.class.pug', foreground: themeColors.pink },
    { token: 'meta.scss', foreground: themeColors.purple },
    { token: 'meta.tag', foreground: themeColors.purple },
    { token: 'metatag', foreground: themeColors.purple },
    { token: 'metatag.content.html', foreground: themeColors.grayLightest },
    { token: 'metatag.html', foreground: themeColors.orange },
    { token: 'metatag.xml', foreground: themeColors.orange },
    { token: 'metatag.php', fontStyle: themeColors.purple },

    { token: 'key', foreground: themeColors.pink },
    { token: 'string.key.json', foreground: themeColors.pink },
    { token: 'string.value.json', foreground: themeColors.green },

    { token: 'attribute.name', foreground: themeColors.yellow, fontStyle: 'italic' },
    { token: 'attribute.value', foreground: themeColors.green },
    { token: 'attribute.value.number.css', foreground: themeColors.turquoise },
    { token: 'attribute.value.unit.css', foreground: themeColors.blueLight },
    { token: 'attribute.value.hex.css', foreground: themeColors.blueLight },

    { token: 'string', foreground: themeColors.green },
    { token: 'string.sql', foreground: themeColors.green },

    { token: 'keyword', foreground: themeColors.blueLight, fontStyle: 'italic' },
    { token: 'keyword.flow', foreground: themeColors.blueLight, fontStyle: 'italic' },
    { token: 'keyword.json', foreground: themeColors.blueLight, fontStyle: 'italic' },
    { token: 'keyword.flow.scss', foreground: themeColors.blueLight, fontStyle: 'italic' },

    { token: 'operator.scss', foreground: themeColors.grayLighter },
    { token: 'operator.sql', foreground: themeColors.grayLighter },
    { token: 'operator.swift', foreground: themeColors.grayLighter },
    { token: 'predefined.sql', foreground: themeColors.pinkLight },
  ],
  colors: {
    'editor.background': '#' + themeColors.grayDarker,
    'editor.foreground': '#' + themeColors.grayLightest,
    'editor.inactiveSelectionBackground': '#3A3D41',
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
    'editor.selectionHighlightBackground': '#ADD6FF26'
  }
};
