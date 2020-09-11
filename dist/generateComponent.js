"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const vscode_1 = require("vscode");
const component_1 = __importDefault(require("./templates/component"));
const styles_1 = __importDefault(require("./templates/styles"));
const spec_1 = __importDefault(require("./templates/spec"));
;
function generateComponent(componentName, directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = fixComponentName(componentName);
        const projectRoot = vscode_1.workspace.workspaceFolders[0].uri.fsPath;
        if (!directory) {
            directory = (yield vscode_1.window.showInputBox({
                value: '/',
                prompt: `Path from root`,
                ignoreFocusOut: true,
                valueSelection: [-1, 1]
            })) || '';
        }
        if (!directory.includes(projectRoot)) {
            directory = projectRoot + directory;
        }
        if (!directory.endsWith('/'))
            directory = directory + '/';
        const component = {
            name,
            path: directory + name,
            files: [
                {
                    name: 'index.tsx',
                    content: component_1.default
                },
                {
                    name: 'styles.ts',
                    content: styles_1.default
                },
                {
                    name: 'index.spec.tsx',
                    content: spec_1.default
                }
            ]
        };
        makeDirectory(component.path);
        yield createFiles(component);
        setTimeout(() => {
            vscode_1.workspace.openTextDocument(`${component.path}/${component.files[0].name}`).then((editor) => {
                if (!editor)
                    return;
                vscode_1.window.showTextDocument(editor);
            });
        }, 50);
    });
}
function fixComponentName(unfixedComponentName) {
    const trimmedComponentName = unfixedComponentName.trim().split(' ').join('');
    const capitalizedComponentName = trimmedComponentName.charAt(0).toUpperCase() + trimmedComponentName.slice(1);
    return capitalizedComponentName;
}
function makeDirectory(directoryPath) {
    const root = path_1.default.isAbsolute(directoryPath) ? path_1.default.sep : "";
    return directoryPath.split(path_1.default.sep).reduce((parentDirectory, childDirectory) => {
        const currentDirectory = path_1.default.resolve(__dirname, parentDirectory, childDirectory);
        try {
            fs_1.default.mkdirSync(currentDirectory);
        }
        catch (error) {
            if (error.code === "EEXIST") {
                return currentDirectory;
            }
            if (error.code === "ENOENT") {
                throw new error(`EACCES: permission denied.'${parentDirectory}'`);
            }
            const caughtError = ["EACCES", "EPERM", "EISDIR"].indexOf(error.code) > -1;
            if (!caughtError || (caughtError && currentDirectory === path_1.default.resolve(directoryPath))) {
                throw error;
            }
        }
        return currentDirectory;
    }, root);
}
function createFiles(component) {
    return __awaiter(this, void 0, void 0, function* () {
        component.files.map((file) => {
            const filePath = `${component.path}/${file.name}`;
            if (!fs_1.default.existsSync(filePath)) {
                fs_1.default.createWriteStream(filePath).close();
                fs_1.default.writeFile(filePath, file.content(component.name), error => {
                    if (error)
                        vscode_1.window.showErrorMessage('Unable to write the file');
                });
            }
            else {
                vscode_1.window.showWarningMessage('File already exists');
            }
        });
    });
}
;
exports.default = generateComponent;
//# sourceMappingURL=generateComponent.js.map