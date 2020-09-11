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
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const generateComponent_1 = __importDefault(require("./generateComponent"));
function handleGenerateComponent(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const componentName = yield vscode_1.window.showInputBox({
            prompt: 'Component name: ',
            ignoreFocusOut: true,
            valueSelection: [-1, -1]
        });
        if (!componentName)
            return;
        if (args) {
            generateComponent_1.default(componentName, args.fsPath);
        }
        else {
            generateComponent_1.default(componentName);
        }
    });
}
function activate(context) {
    let disposable = [
        vscode_1.commands.registerCommand("extension.synxty-next-components", args => {
            handleGenerateComponent(args);
        })
    ];
    context.subscriptions.push(...disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map