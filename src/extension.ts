import { ExtensionContext, window, Uri, commands } from 'vscode';
import generateComponent from './generateComponent';

async function handleGenerateComponent(args: Uri) {
  const componentName = await window.showInputBox({
    prompt: 'Component name: ',
    ignoreFocusOut: true,
    valueSelection: [-1, -1]
  });

  if (!componentName) return;

  if (args) {
    generateComponent(componentName, args.fsPath);
  } else {
    generateComponent(componentName);
  }

}

function activate(context: ExtensionContext) {
  let disposable = [
    commands.registerCommand("extension.synxty-next-components", args => {
      handleGenerateComponent(args);
    })
  ];

  context.subscriptions.push(...disposable);
}

function deactivate() { }

export { activate, deactivate };
