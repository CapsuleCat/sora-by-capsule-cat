import * as vscode from "vscode";

export function getSubscription() {
    const apiKeyDisposable = vscode.commands.registerCommand('sora-by-capsule-cat.setApiKey', async (maybeInput?: string) => {
        const apiKey = maybeInput ?? await vscode.window.showInputBox({
            prompt: 'Enter your API key',
            value: '',
            ignoreFocusOut: true,
        });

        vscode.workspace.getConfiguration().update('sora-by-capsule-cat.apiKey', apiKey, true);
    });

    return apiKeyDisposable;
}