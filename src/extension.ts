import { ExtensionContext, window, Uri, commands } from 'vscode';
import { generateReactComponent, generateNextComponent } from './generateComponent';

async function askForComponentName() {
  const componentName = await window.showInputBox({
    prompt: 'Component name: ',
    ignoreFocusOut: true,
    valueSelection: [-1, -1]
  });
  if (!componentName) return '';
  return componentName;
}

async function handleGenerateReactComponent(args: Uri) {
  const componentName = await askForComponentName();
  if (!componentName) return;

  if (args) {
    generateReactComponent(componentName, args.fsPath);
  } else {
    generateReactComponent(componentName);
  }

}

async function handleGenerateNextComponent(args: Uri) {
  const componentName = await askForComponentName();
  if (!componentName) return;

  if (args) {
    generateNextComponent(componentName, args.fsPath);
  } else {
    generateNextComponent(componentName);
  }
}

function activate(context: ExtensionContext) {
  let disposable = [
    commands.registerCommand("extension.synxty-next-component", args => {
      handleGenerateNextComponent(args);
    }),
    commands.registerCommand("extension.synxty-react-component", args => {
      handleGenerateReactComponent(args);
    })
  ];

  context.subscriptions.push(...disposable);
}

function deactivate() { }

export { activate, deactivate };
