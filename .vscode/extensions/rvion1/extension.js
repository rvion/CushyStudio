var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .vscode/extensions/rvion1/extension.ts
__export(exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
var vscode = __toModule(require("vscode"));

// src/icons/icons.ts
var icons = __toModule(require("@mdi/js"));
var myCustomIcons = {
  ldiTest: "M 2.40,7.20 A 20,20 0,0,1 12.00,7.20 A 20,20 0,0,1 21.60,7.20 Q 21.60,14.40 12.00,21.60 Q 2.40,14.40 2.40,7.20 z"
};
var allIcons = {
  ...icons,
  ...myCustomIcons
};

// .vscode/extensions/rvion1/extension.ts
function activate(context) {
  console.log("decorator sample is activated");
  let timeout = void 0;
  const channel = vscode.window.createOutputChannel("cushy");
  const iconDecorationType = vscode.window.createTextEditorDecorationType({
    before: {
      width: "1em",
      height: "1em"
    }
  });
  const userDecorationType = vscode.window.createTextEditorDecorationType({
    cursor: "crosshair",
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
    if (!activeEditor)
      return;
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
    const regEx = /[ml]di([A-Z-a-z]+)/g;
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
          before: {
            contentIconPath: vscode.Uri.parse(uriTxt)
          }
        }
      };
      iconDecoration.push(decoration);
    }
    const contrDecoration = [];
    activeEditor.setDecorations(iconDecorationType, iconDecoration);
    const regEx2 = /@(globi|rvion|taha|gui)/g;
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
          before: {
            contentIconPath: uriForLocalFile
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
    if (throttle)
      timeout = setTimeout(updateDecorations, 500);
    else
      updateDecorations();
  }
  if (activeEditor)
    triggerUpdateDecorations();
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    activeEditor = editor;
    if (editor)
      triggerUpdateDecorations();
  }, null, context.subscriptions);
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerUpdateDecorations(true);
    }
  }, null, context.subscriptions);
}
function deactivate() {
  console.log("decorator sample is deactivated");
}
