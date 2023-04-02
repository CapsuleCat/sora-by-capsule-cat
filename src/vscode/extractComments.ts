import * as vscode from "vscode";
import { cleanInput } from "../utilities";

export function extractCommentText(editor: vscode.TextEditor, line?: number) {
    const document = editor.document;
    const currentLine = line ?? editor.selection.active.line;
    const [blockStart, blockEnd] = [negativeSeekLineContains(document, '/*', currentLine, ['*/']), forwardSeekLineContains(document, '*/', currentLine, ['/*'])];
    const [javaBlockStart, javaBlockEnd] = [negativeSeekLineContains(document, '/**', currentLine, ['*/']), forwardSeekLineContains(document, '*/', currentLine, ['/*'])];

    let fullText = '';
    let startLine = currentLine;
    let lastLine = currentLine;

    if (javaBlockStart !== -1) {
        let end = javaBlockEnd;
        if (javaBlockEnd === -1) {
            // Just use the current line
            end = currentLine;
        }
        fullText = document.getText(new vscode.Range(javaBlockStart, 0, end, document.lineAt(end).range.end.character));
        startLine = javaBlockStart;
        lastLine = javaBlockEnd;
    } else if (blockStart !== -1) {
        let end = blockEnd;
        if (blockEnd === -1) {
            // Just use the current line
            end = currentLine;
        }
        fullText = document.getText(new vscode.Range(blockStart, 0, end, document.lineAt(end).range.end.character));
        startLine = blockStart;
        lastLine = blockEnd;
    } else if (document.lineAt(currentLine).text.trim().startsWith('//')) {
        // Just use the text from the current line
        fullText = document.lineAt(currentLine).text;
    } else {
        return null;
    }

    const text = cleanInput(fullText);

    return {
        text,
        selection: {
            startLine: startLine,
            endLine: lastLine,
        },
    };
}

function negativeSeekLineContains(document: vscode.TextDocument, needle: string, startAt = 0, terminators: string[]): number {
    let line = startAt;
    while (line >= 0) {
        if (terminators.some((terminator) => document.lineAt(line).text.includes(terminator))) {
            return -1;
        }
        if (document.lineAt(line).text.includes(needle)) {
            return line;
        }

        line--;
    }

    return -1;
}

function forwardSeekLineContains(document: vscode.TextDocument, needle: string, startAt = 0, terminators: string[]): number {
    let line = startAt;
    while (line < document.lineCount) {
        if (terminators.some((terminator) => document.lineAt(line).text.includes(terminator))) {
            return -1;
        }
        if (document.lineAt(line).text.includes(needle)) {
            return line;
        }

        line++;
    }

    return -1;
}