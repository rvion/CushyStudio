"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// ../../../src/csuite/icons/icons.ts
var icons3 = __toESM(require("@mdi/js"), 1);

// ../../../src/csuite/icons/iconsCDI.ts
var icons = __toESM(require("@mdi/js"), 1);
var _CushyIcons = {
  /* Inherited Icons */
  cdiDraft: icons.mdiPencil,
  cdiApp: icons.mdiAbacus,
  cdiStep: icons.mdiAccessPoint,
  cdiPreset: icons.mdiAccessPoint,
  cdiExternalCivitai: icons.mdiCityVariant,
  cdiExternalSquoosh: icons.mdiCigar,
  /* Custom Icons */
  cdiTest: "M 2.40,7.20 A 20,20 0,0,1 12.00,7.20 A 20,20 0,0,1 21.60,7.20 Q 21.60,14.40 12.00,21.60 Q 2.40,14.40 2.40,7.20 z",
  cdiNodes: "M 16,5 C 16,3.89 15.1,3 14,3 H 8 C 6.8954305,3 6,3.8954305 6,5 v 3 c 0,1 1,2 2,2 V 7 6 h 6 V 8 H 8 v 2 h 6 c 1,0 2,-1 2,-2 V 5 h 1 c 1,0 1,1 1,1 h 2 c 1,0 1,1 1,1 v 10 c 0,0 0,1 -1,1 h -5 c 0,0 0,1 -1,1 v -3 h -1 v 3 c 0,0 0,2 -2,2 V 19 17 H 5 v 2 h 6 v 2 H 5 C 3,21 3,19 3,19 v -3 c 0,0 0,-2 2,-2 h 6 c 2,0 2,2 2,2 h 1 c 1,0 1,1 1,1 h 5 V 16 7 h -2 c 0,1 -1,1 -1,1 V 5 Z"
};

// ../../../src/csuite/icons/iconsLDI.ts
var _IconsLDI = {
  // locomotive ---------------------------------------------------------------------
  ldiRegularStar: "M11.049 2.92664C11.3483 2.00537 12.6517 2.00538 12.951 2.92664L14.4699 7.60055C14.6038 8.01254 14.9877 8.29148 15.4209 8.29149L20.3354 8.29168C21.3041 8.29172 21.7068 9.53127 20.9232 10.1007L16.9474 12.9895C16.5969 13.2441 16.4503 13.6955 16.5841 14.1075L18.1026 18.7815C18.4019 19.7028 17.3475 20.4689 16.5638 19.8995L12.5878 17.011C12.2373 16.7564 11.7627 16.7564 11.4122 17.011L7.43622 19.8995C6.65252 20.4689 5.5981 19.7028 5.8974 18.7815L7.41589 14.1075C7.54974 13.6955 7.40309 13.2441 7.05263 12.9895L3.07683 10.1007C2.29317 9.53127 2.69592 8.29172 3.66461 8.29168L8.57911 8.29149C9.01231 8.29148 9.39623 8.01254 9.53011 7.60055L11.049 2.92664Z",
  ldiRegularStatusOnline: "M5.63604 18.3646C2.12132 14.8499 2.12132 9.15144 5.63604 5.63672M18.364 5.63672C21.8787 9.15144 21.8787 14.8499 18.364 18.3646M8.46447 15.5362C6.51184 13.5836 6.51184 10.4178 8.46447 8.46515M15.5355 8.46515C17.4882 10.4178 17.4882 13.5836 15.5355 15.5362M13 12.0007C13 12.553 12.5523 13.0007 12 13.0007C11.4477 13.0007 11 12.553 11 12.0007C11 11.4484 11.4477 11.0007 12 11.0007C12.5523 11.0007 13 11.4484 13 12.0007Z",
  ldiRegularUser: "M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z",
  ldiSolidArchive: "M4 3C2.89543 3 2 3.89543 2 5C2 6.10457 2.89543 7 4 7H16C17.1046 7 18 6.10457 18 5C18 3.89543 17.1046 3 16 3H4Z M3 8H17V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V8ZM8 11C8 10.4477 8.44772 10 9 10H11C11.5523 10 12 10.4477 12 11C12 11.5523 11.5523 12 11 12H9C8.44772 12 8 11.5523 8 11Z",
  ldiSolidArrowNarrowUp: "M5.29289 7.70711C4.90237 7.31658 4.90237 6.68342 5.29289 6.29289L9.2929 2.29289C9.68342 1.90237 10.3166 1.90237 10.7071 2.29289L14.7071 6.29289C15.0976 6.68342 15.0976 7.31658 14.7071 7.70711C14.3166 8.09763 13.6834 8.09763 13.2929 7.70711L11 5.41421L11 17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17L9 5.41421L6.70711 7.70711C6.31658 8.09763 5.68342 8.09763 5.29289 7.70711Z",
  ldiSolidArrowUp: "M3.29289 9.70711C2.90237 9.31658 2.90237 8.68342 3.29289 8.29289L9.29289 2.29289C9.68342 1.90237 10.3166 1.90237 10.7071 2.29289L16.7071 8.29289C17.0976 8.68342 17.0976 9.31658 16.7071 9.70711C16.3166 10.0976 15.6834 10.0976 15.2929 9.70711L11 5.41421L11 17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17L9 5.41421L4.70711 9.70711C4.31658 10.0976 3.68342 10.0976 3.29289 9.70711Z",
  ldiSolidChevronDown: "M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.7071 7.29289L9.99999 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68341 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z",
  ldiSolidChevronUp: "M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z",
  ldiSolidFilter: "M3 3C3 2.44772 3.44772 2 4 2H16C16.5523 2 17 2.44772 17 3V6C17 6.26522 16.8946 6.51957 16.7071 6.70711L12 11.4142V15C12 15.2652 11.8946 15.5196 11.7071 15.7071L9.70711 17.7071C9.42111 17.9931 8.99099 18.0787 8.61732 17.9239C8.24364 17.7691 8 17.4045 8 17V11.4142L3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6V3Z",
  ldiSolidFolder: "M2 6C2 4.89543 2.89543 4 4 4H9L11 6H16C17.1046 6 18 6.89543 18 8V14C18 15.1046 17.1046 16 16 16H4C2.89543 16 2 15.1046 2 14V6Z",
  ldiSolidPencil: "M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z",
  ldiSolidPhone: "M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z",
  ldiSolidSearch: "M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8Z",
  ldiSolidStar: "M7.49288 0.76784C7.88896 0.0878043 8.87138 0.0878028 9.26747 0.767838L11.2236 4.12633C11.3687 4.37544 11.6118 4.55208 11.8936 4.6131L15.6922 5.43567C16.4613 5.60223 16.7649 6.53657 16.2406 7.12341L13.6509 10.0216C13.4589 10.2366 13.366 10.5224 13.395 10.8092L13.7865 14.6761C13.8658 15.4591 13.071 16.0365 12.3509 15.7192L8.79424 14.1519C8.53043 14.0357 8.22991 14.0357 7.9661 14.1519L4.40948 15.7192C3.68932 16.0365 2.89453 15.4591 2.9738 14.6761L3.36532 10.8092C3.39436 10.5224 3.30149 10.2366 3.10941 10.0216L0.51978 7.12341C-0.00457591 6.53657 0.299008 5.60223 1.06816 5.43567L4.86676 4.6131C5.14851 4.55208 5.39164 4.37544 5.53673 4.12633L7.49288 0.76784Z",
  ldiSolidX: "M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10 8.58579L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
};

// ../../../src/csuite/icons/iconsXDI.ts
var icons2 = __toESM(require("@mdi/js"), 1);
var _IconsXDI = {
  // semantic stuff ----------------------------------------------------------------
  _missedCall: icons2.mdiPhoneMissed,
  _transferredCall: icons2.mdiPhoneInTalk,
  _close: icons2.mdiClose,
  _clear: icons2.mdiClose,
  _check: icons2.mdiCheck,
  _edit: icons2.mdiPencil,
  // grid
  _gridFilter: icons2.mdiFilterOutline,
  _gridSortedAsc: icons2.mdiArrowUp,
  _gridSortedDesc: icons2.mdiArrowDown,
  _gridGroupBy: icons2.mdiViewGrid,
  // features
  _webchat: icons2.mdiChatProcessing
};

// ../../../src/csuite/icons/icons.ts
var allIcons = {
  _: "M 0,0 z",
  // made by pictogrammers, for all
  ...icons3,
  // made by/for ???
  ..._IconsXDI,
  // made by/for locomotive
  ..._IconsLDI,
  // made by/for cushy
  ..._CushyIcons
};

// extension.ts
function activate(context) {
  console.log("decorator sample is activated");
  let timeout = void 0;
  const channel = vscode.window.createOutputChannel("cushy");
  const iconDecorationType = vscode.window.createTextEditorDecorationType({
    // borderWidth: '1px',
    // borderStyle: 'solid',
    // overviewRulerColor: 'blue',
    // overviewRulerLane: vscode.OverviewRulerLane.Right,
    // light: { borderColor: 'darkblue' },
    // dark: { borderColor: 'lightblue' },
    before: {
      width: "1em",
      height: "1em"
    }
  });
  const userDecorationType = vscode.window.createTextEditorDecorationType({
    cursor: "crosshair",
    // use a themable color. See package.json for the declaration and default values.
    // backgroundColor: { id: 'myextension.largeNumberBackground' },
    before: {
      width: "21px",
      height: "21px"
    }
  });
  let activeEditor = vscode.window.activeTextEditor;
  vscode.commands.registerCommand("myextension.rescale100To24", async (args) => {
    const editor = activeEditor;
    if (editor == null) {
      channel.appendLine("rescale100To24: No active editor => aborting");
      return;
    }
    const text = editor.document.getText(editor.selection);
    channel.appendLine(`rescale100To24: initial text=${text}`);
    const newText = text.replace(/(\d+)/g, (match, p1) => {
      const rescaled = Number(p1) * 24 / 100;
      return rescaled.toFixed(2);
    });
    channel.appendLine(`rescale100To24:      to text=${newText}`);
    vscode.window.activeTextEditor?.edit((editBuilder) => {
      editBuilder.replace(editor.selection, newText);
    });
    vscode.window.showInformationMessage("rescale100To24: done");
  });
  function updateDecorations() {
    if (!activeEditor) return;
    function getDecorationIcon(path, iconColor = "white", size = 24) {
      const origin = `${size / 2} ${size / 2}`;
      return [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`,
        `<path transform-origin="${origin}" fill="${iconColor}" d="${path}"/>`,
        `</svg>`
      ].join("");
    }
    const text = activeEditor.document.getText();
    const iconDecoration = [];
    const regEx = /[mlc]di([A-Z-a-z0-9]+)/g;
    let match;
    while (match = regEx.exec(text)) {
      const iconName = match[0];
      const iconPath = allIcons[iconName];
      const uriTxt = `data:image/svg+xml,${encodeURI(getDecorationIcon(iconPath))}`;
      console.log(`[\u{1F920}] uriTxt`, uriTxt);
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(match.index + match[0].length);
      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: "Number **" + match[0] + "**",
        renderOptions: {
          // prettier-ignore
          before: {
            // contentText: `👍<${match[0]}>`,
            contentIconPath: vscode.Uri.parse(uriTxt)
            // color: { id: 'myextension.largeNumberBackground' },
            // margin: '0 0.5em',
          }
        }
      };
      iconDecoration.push(decoration);
    }
    const contrDecoration = [];
    activeEditor.setDecorations(iconDecorationType, iconDecoration);
    const regEx2 = /@(globi|rvion|taha|gui|birdddev)/g;
    while (match = regEx2.exec(text)) {
      const iconName = match[0];
      const iconPath = allIcons[iconName];
      const uriTxt = `data:image/svg+xml,${encodeURI(getDecorationIcon(iconPath))}`;
      console.log(`[\u{1F920}] uriTxt`, uriTxt);
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(match.index + match[0].length);
      const uriForLocalFile = vscode.Uri.file("/Users/loco/dev/CushyStudio/.vscode/extensions/rvion1/HeartsLove21.gif");
      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: "Number **" + match[0] + "**",
        renderOptions: {
          // prettier-ignore
          before: {
            // contentText: `👍<${match[0]}>`,
            contentIconPath: uriForLocalFile
            // width: '1em',
            // height: '1em',
            // color: { id: 'myextension.largeNumberBackground' },
            // margin: '0 0.5em',
          }
        }
      };
      contrDecoration.push(decoration);
    }
    activeEditor.setDecorations(userDecorationType, contrDecoration);
  }
  function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
    if (throttle) timeout = setTimeout(updateDecorations, 500);
    else updateDecorations();
  }
  if (activeEditor) triggerUpdateDecorations();
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) triggerUpdateDecorations();
    },
    null,
    context.subscriptions
  );
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations(true);
      }
    },
    null,
    context.subscriptions
  );
}
function deactivate() {
  console.log("decorator sample is deactivated");
}
