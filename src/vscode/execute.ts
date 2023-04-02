import * as vscode from 'vscode';
import { extractCommentText } from './extractComments';
import { Sora } from "../sora/Sora";
import { SoraReference } from "../sora/prompt";

export async function executeSora(editor: vscode.TextEditor, line?: number) {
    const result = extractCommentText(editor, line);
    const document = editor.document;

    if (!result) {
        return;
    }

    const {
        text,
        selection: {
            endLine,
        }
    } = result;

    const languageId = document.languageId;
    const apiKey = vscode.workspace.getConfiguration().get<string>('sora-by-capsule-cat.apiKey');

    if (!apiKey) {
        vscode.window.showErrorMessage('Please set your API key in the settings.');
        return;
    }

    vscode.window.showInformationMessage(`Sora: Sending request to ChatGPT`);

    const uri = document.uri;
    const references = await buildReferences(text, uri);

    if (references.some(ref => ref.warnings)) {
        references.forEach(ref => {
            ref.warnings?.forEach(warning => {
                switch (warning) {
                    case "fileIsBinary":
                        vscode.window.showWarningMessage(`File ${ref.relativeFilePath} is binary and cannot be used as a reference.`);
                        break;
                    case "fileTooLarge":
                        vscode.window.showWarningMessage(`File ${ref.relativeFilePath} is too large and cannot be used as a reference.`);
                        break;
                    case "fileNotFound":
                        vscode.window.showWarningMessage(`File ${ref.relativeFilePath} was not found and cannot be used as a reference.`);
                        break;
                    case "noContent":
                        vscode.window.showWarningMessage(`File ${ref.relativeFilePath} has no content.`);
                        break;
                }
            });
        });
    }

    const safeReferences = references.filter(ref => !ref.warnings);

    const sora = new Sora();
    sora.setApiKey(apiKey);
    sora.generateText(languageId, text, safeReferences).then((response: string) => {
        editor.edit((editBuilder) => {
            vscode.window.showInformationMessage(`Sora: Success`);
            editBuilder.insert(new vscode.Position(endLine + 1, 0), `\n${response}\n`);
        });
    }).catch((error: unknown) => {
        console.error(error);
        vscode.window.showErrorMessage(`Sora Error: ${String(error)}`);
    });
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
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const language = document.languageId;

            // Check if the file is a binary file
            if (language === 'binary') {
                return {
                    content: '',
                    warnings: ['fileIsBinary'],
                    relativeFilePath: uri.toString(),
                    language: 'plaintext',
                };
            }

            // Check if the file is too large
            if (document.getText().length > 5000) {
                return {
                    content: '',
                    warnings: ['fileTooLarge'],
                    relativeFilePath: uri.toString(),
                    language: 'plaintext',
                };
            }

            if (document.getText().length === 0) {
                return {
                    content: '',
                    warnings: ['noContent'],
                    relativeFilePath: uri.toString(),
                    language: 'plaintext',
                };
            }

            const content = document.getText();

            return {
                content,
                relativeFilePath: uri.toString(),
                language,
            };
        } catch (error) {
            return {
                content: '',
                warnings: ['fileNotFound'],
                relativeFilePath: uri.toString(),
                language: 'plaintext',
            };
        }
    }));

    return references;
}