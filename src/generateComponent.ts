import fs from 'fs';
import path from 'path';
import { workspace, window } from 'vscode';

import stylesTemplate from './templates/styles';
import reactComponentTemplate from './templates/component';
import reactSpecTemplate from './templates/spec';
import nextComponentTemplate from './templates/next/component';
import nextSpecTemplate from './templates/next/spec';

interface componentProps {
  name: string;
  path: string;
  files: {
    name: string;
    content: (componentName: string) => string;
  }[];
};

async function generateReactComponent(componentName: string, directory?: string) {
  const files = [
    {
      name: 'index.tsx',
      content: reactComponentTemplate
    },
    {
      name: 'styles.ts',
      content: stylesTemplate
    },
    {
      name: 'index.spec.tsx',
      content: reactSpecTemplate
    }
  ];
  generateComponent(componentName, files, directory);

}

async function generateNextComponent(componentName: string, directory?: string) {
  const files = [
    {
      name: 'index.tsx',
      content: nextComponentTemplate
    },
    {
      name: 'styles.ts',
      content: stylesTemplate
    },
    {
      name: 'index.spec.tsx',
      content: nextSpecTemplate
    }
  ];
  generateComponent(componentName, files, directory);

}

async function generateComponent(componentName: string, files: componentProps['files'], directory?: string) {
  const name = fixComponentName(componentName);
  const projectRoot = (workspace.workspaceFolders as any)[0].uri.fsPath;

  if (!directory) {
    directory = await window.showInputBox({
      value: '/',
      prompt: `Path from root`,
      ignoreFocusOut: true,
      valueSelection: [-1, 1]
    }) || '';
  }

  if (!directory.includes(projectRoot)) {
    directory = projectRoot + directory;
  }

  if (!directory.endsWith('/')) directory = directory + '/';
  const component = {
    name,
    path: directory + name,
    files
  };

  makeDirectory(component.path);
  await createFiles(component);

  setTimeout(() => {
    workspace.openTextDocument(`${component.path}/${component.files[0].name}`).then(
      (editor) => {
        if (!editor) return;
        window.showTextDocument(editor);
      }
    );
  }, 50);

}

function fixComponentName(unfixedComponentName: string) {
  const trimmedComponentName = unfixedComponentName.trim().split(' ').join('');
  const capitalizedComponentName = trimmedComponentName.charAt(0).toUpperCase() + trimmedComponentName.slice(1);
  return capitalizedComponentName;
}


function makeDirectory(directoryPath: string) {
  const root = path.isAbsolute(directoryPath) ? path.sep : "";
  return directoryPath.split(path.sep).reduce(
    (parentDirectory, childDirectory) => {
      const currentDirectory = path.resolve(__dirname, parentDirectory, childDirectory);
      try {
        fs.mkdirSync(currentDirectory);
      } catch (error) {
        if (error.code === "EEXIST") {
          return currentDirectory;
        }
        if (error.code === "ENOENT") {
          throw new error(`EACCES: permission denied.'${parentDirectory}'`);
        }
        const caughtError = ["EACCES", "EPERM", "EISDIR"].indexOf(error.code) > -1;
        if (!caughtError || (caughtError && currentDirectory === path.resolve(directoryPath))) {
          throw error;
        }
      }

      return currentDirectory;
    }, root
  );
}

async function createFiles(component: componentProps) {
  component.files.map((file) => {
    const filePath = `${component.path}/${file.name}`;
    if (!fs.existsSync(filePath)) {
      fs.createWriteStream(filePath).close();
      fs.writeFile(filePath, file.content(component.name), error => {
        if (error) window.showErrorMessage('Unable to write the file');
      });
    } else {
      window.showWarningMessage('File already exists');
    }
  });

};

export { generateReactComponent, generateNextComponent };
