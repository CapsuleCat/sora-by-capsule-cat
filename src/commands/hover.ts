import * as vscode from "vscode";
import { extractCommentText } from "../vscode/extractComments";
import { executeSora } from "../vscode/execute";

function hoverProvider(document: vscode.TextDocument, position: vscode.Position) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const comment = extractCommentText(editor, position.line);

    if (!comment) {
        return;
    }

    const range = new vscode.Range(
        comment.selection.startLine,
        0,
        comment.selection.endLine,
        document.lineAt(comment.selection.endLine).range.end.character
    );

    const commentButtonMarkdown = new vscode.MarkdownString(`[Send to ChatGPT](command:sora-by-capsule-cat.executeSora?${encodeURIComponent(JSON.stringify({ line: position.line }))})`);
    commentButtonMarkdown.isTrusted = true;

    return new vscode.Hover([
        commentButtonMarkdown
    ], range);
}

export function getSubscriptions() {
    const commandDisposable = vscode.commands.registerCommand('sora-by-capsule-cat.executeSora', async ({ line }: { line: number }) => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        await executeSora(editor, line);
    });

    const untitledDisposable = vscode.languages.registerHoverProvider({ scheme: 'untitled' }, {
        provideHover: hoverProvider
    });
    
    const fileDisposable = vscode.languages.registerHoverProvider({ scheme: 'file' }, {
        provideHover: hoverProvider
    });

    return [
        commandDisposable,
        untitledDisposable,
        fileDisposable
    ];
}
