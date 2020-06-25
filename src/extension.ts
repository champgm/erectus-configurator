// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Configurator } from './Configurator';

export const configurator: Configurator = new Configurator();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "erectus-configurator" is now active!');

  const disposable = vscode.commands.registerCommand("onCommand:extension.annotateIds", async () => {
    configurator.eventTrigger();
  });
  configurator.eventTrigger();
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (configurator) {
    configurator.dispose();
  }
}
