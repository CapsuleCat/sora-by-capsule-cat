import * as vscode from "vscode";
import { Sora } from "../sora/Sora";
import { cleanInput } from "../utilities";
import { SoraReference } from "../sora/prompt";

export function getSubscription() {
    const typingDisposable = vscode.workspace.onDidChangeTextDocument(async (event) => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        const document = editor.document;

        if (event.document === document) {
            const initialTrigger = event.contentChanges.some((change) => {
                return change.text.toLowerCase() === 't';
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
            
            if (javaBlockStart !== -1) {
                let end = javaBlockEnd;
                if (javaBlockEnd === -1) {
                    // Just use the current line
                    end = currentLine;
                }
                fullText = document.getText(new vscode.Range(javaBlockStart, 0, end, document.lineAt(end).range.end.character));
                lastLine = javaBlockEnd;
            } else if (blockStart !== -1 ) {
                let end = blockEnd;
                if (blockEnd === -1) {
                    // Just use the current line
                    end = currentLine;
                }
                fullText = document.getText(new vscode.Range(blockStart, 0, end, document.lineAt(end).range.end.character));
                lastLine = blockEnd;
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

            const uri = document.uri;
            const references = await buildReferences(text, uri);

            const sora = new Sora();
            sora.setApiKey(apiKey);
            sora.generateText(languageId, text, references).then((response: string) => {
                editor.edit((editBuilder) => {
                    // Debug
                    vscode.window.showInformationMessage(`Response: ${response}`);
                    editBuilder.insert(new vscode.Position(lastLine + 1, 0), `\n${response}\n`);
                });
            }).catch((error: unknown) => {
                console.error(error);
                vscode.window.showErrorMessage(`Error: ${String(error)}`);
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

async function buildReferences(text: string, baseUri: vscode.Uri): Promise<SoraReference[]> {
    // Find any matches for `[name](url)`
    const regex = /\[(.*?)\]\((.*?)\)/g;
    const matches = text.matchAll(regex);

    // Resolve the paths to absolute paths
    const references = Promise.all(Array.from(matches).map((match) => {
        const uri = vscode.Uri.joinPath(baseUri, '..', match[2]);
        return uri;
    }).map(async (uri): Promise<SoraReference> => {
        const document = await vscode.workspace.openTextDocument(uri);
        const content = document.getText();
        const language = document.languageId;

        return {
            content,
            relativeFilePath: uri.toString(),
            language,
        };
    }));

    return references;
}