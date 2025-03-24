import * as vscode from "vscode";
import axios from "axios";

export function activate(context: vscode.ExtensionContext) {
    console.log("AI Commenter extension activated!");

    let disposable = vscode.commands.registerCommand("extension.addComments", async () => {
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
            
            const response = await axios.post("http://127.0.0.1:8000/generate_comments", { code });
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
        } catch (error: any) {
            console.error("Error generating comment:", error.message);
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log("AI Commenter extension deactivated.");
}
