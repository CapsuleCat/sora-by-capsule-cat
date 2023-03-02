import * as vscode from "vscode";
import { Sora } from "../sora/sora";
import { cleanInput } from "../utilities";

export function getSubscription() {
    const typingDisposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const document = editor.document;

        if (event.document === document) {
            const initialTrigger = event.contentChanges.some((change) => {
                return change.text === 'T';
            });
            if (!initialTrigger) {
                return;
            }
            const triggerToken = '@chatgpt';
            // Get current line
            const currentLine = editor.selection.active.line;
            const currentLineText = document.lineAt(currentLine).text;

            // includes case insensitive
            if (!currentLineText.toLowerCase().includes(triggerToken)) {
                return;
            }

            const [blockStart, blockEnd] = [negativeSeekLineContains(document, '/*', currentLine), forwardSeekLineContains(document, '*/', currentLine)];
            const [javaBlockStart, javaBlockEnd] = [negativeSeekLineContains(document, '/**', currentLine), forwardSeekLineContains(document, '*/', currentLine)];
            
            let fullText = '';
            let lastLine = currentLine;
            
            if (blockStart !== -1 && blockEnd !== -1) {
                fullText = document.getText(new vscode.Range(blockStart, 0, blockEnd, document.lineAt(blockEnd).range.end.character));
                lastLine = blockEnd;
            } else if (javaBlockStart !== -1 && javaBlockEnd !== -1) {
                fullText = document.getText(new vscode.Range(javaBlockStart, 0, javaBlockEnd, document.lineAt(javaBlockEnd).range.end.character));
                lastLine = javaBlockEnd;
            } else {
                // Just use the text from the current line
                fullText = document.lineAt(currentLine).text;
            }
            
            const text = cleanInput(fullText);

            const languageId = document.languageId;
            const apiKey = vscode.workspace.getConfiguration().get<string>('sora-by-capsule-cat.apiKey');

            // Debug
            vscode.window.showInformationMessage(`Requesting Sora API with languageId: ${languageId}, text: ${text}`);

            if (!apiKey) {
                vscode.window.showErrorMessage('Please set your API key in the settings.');
                return;
            }

            const sora = new Sora();
            sora.setApiKey(apiKey);
            sora.generateText(languageId, text).then((response) => {
                editor.edit((editBuilder) => {
                    // Debug
                    vscode.window.showInformationMessage(`Response: ${response}`);
                    editBuilder.insert(new vscode.Position(lastLine + 1, 0), `\n${response}\n`);
                });
            }).catch((error) => {
                console.error(error);
                vscode.window.showErrorMessage(`Error: ${error}`);
            });
        }
    });


    return typingDisposable;
}

function negativeSeekLineContains(document: vscode.TextDocument, needle: string, startAt = 0): number {
    let line = startAt;
    while (line >= 0) {
        if (document.lineAt(line).text.includes(needle)) {
            return line;
        }

        line--;
    }

    return -1;
}

function forwardSeekLineContains(document: vscode.TextDocument, needle: string, startAt = 0): number {
    let line = startAt;
    while (line < document.lineCount) {
        if (document.lineAt(line).text.includes(needle)) {
            return line;
        }

        line++;
    }

    return -1;
}
