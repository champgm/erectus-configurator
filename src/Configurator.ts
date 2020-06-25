import * as vscode from 'vscode';
import { parse } from 'ini';
import * as _ from 'lodash';
import { baseIds } from './BaseIds';

export class Configurator implements vscode.Disposable {
  private subscriptions: vscode.Disposable[];
  private static baseIdRegex = new RegExp(" = [A-F,0-9]{8}");

  constructor() {
    this.subscriptions = [];
  }
  
  dispose() {
    console.log(`Nothing to deactivate right now`);
  }

  public activate(context: vscode.ExtensionContext) {
    console.log(`Configurator was activated`);
    this.subscriptions = context.subscriptions;
    if (this.subscriptions.indexOf(this) < 0) {
      this.subscriptions.push(this);
    }
    vscode.window.onDidChangeActiveTextEditor(this.eventTrigger, this, this.subscriptions);
    vscode.workspace.onDidOpenTextDocument(this.eventTrigger, this, this.subscriptions);
    vscode.workspace.onDidSaveTextDocument(this.eventTrigger, this, this.subscriptions);
    vscode.workspace.onDidChangeTextDocument(this.eventTrigger, this, this.subscriptions);
  }

  public async eventTrigger() {
    console.log(`Configurator event triggered`);
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const filePath = editor.document.fileName;
      if (filePath.includes("Erectus.ini")) {
        const indexes = Array(editor.document.lineCount)
        indexes.forEach((index)=>{
          let currentLine: vscode.TextLine = editor.document.lineAt(index);
          if (Configurator.baseIdRegex.test(currentLine.text)) {
            const baseId = currentLine.text.split('=')[1].trim();
            if (baseIds[baseId]) {
              editor.edit((editBuilder: vscode.TextEditorEdit) => {
                const insertLocation = new vscode.Position(
                  currentLine.lineNumber,
                  currentLine.range.end.character + 1,
                );
                editBuilder.insert(insertLocation,`; ${baseIds[baseId]}`)
              })
            }
          }
        })
      }
    }
  }

}
