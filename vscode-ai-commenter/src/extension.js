"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
function activate(context) {
    console.log("AI Commenter extension activated!");
    let disposable = vscode.commands.registerCommand("extension.addComments", () => __awaiter(this, void 0, void 0, function* () {
        console.log("AI Comment command executed!");
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found.");
            return;
        }
        const code = editor.document.getText(editor.selection);
        if (!code) {
            vscode.window.showErrorMessage("No code selected.");
            return;
        }
        vscode.window.showInformationMessage("Generating AI comments...");
        try {
            console.log("Sending request to FastAPI...");
            const response = yield axios_1.default.post("http://127.0.0.1:8000/generate_comments", { code });
            console.log("Response received:", response.data);
            const comment = response.data.comment.trim();
            if (!comment) {
                vscode.window.showErrorMessage("No comment generated.");
                return;
            }
            editor.edit((editBuilder) => {
                const position = editor.selection.start;
                editBuilder.insert(position, `# ${comment}\n`);
            });
            vscode.window.showInformationMessage("AI comment added!");
        }
        catch (error) {
            console.error("Error generating comment:", error.message);
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    }));
    context.subscriptions.push(disposable);
}
function deactivate() {
    console.log("AI Commenter extension deactivated.");
}
