import * as vscode from "vscode";
import { executeSora } from "../vscode/execute";

const TRIGGER_TOKEN = '@chatgpt';

export function getSubscription() {
    return vscode.workspace.onDidChangeTextDocument(async (event) => {
        const editor = vscode.window.activeTextEditor;
        const document = editor?.document;

        if (!editor || event.document !== document) {
            return;
        }

        if (chatGptTriggerCondition(event, editor)) {
            await executeSora(editor);
        }
    });
}

function chatGptTriggerCondition(event: vscode.TextDocumentChangeEvent, editor: vscode.TextEditor) {
    const initialTrigger = event.contentChanges.some((change) => {
        return change.text.toLowerCase() === 't';
    });

    // Get current line
    const currentLine = editor.selection.active.line;
    const currentLineText = editor.document.lineAt(currentLine).text;

    // includes case insensitive
    if (!currentLineText.toLowerCase().includes(TRIGGER_TOKEN)) {
        return false;
    }

    return initialTrigger;
}

