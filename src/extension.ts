import * as vscode from 'vscode';

import { getSubscription as getApiKeySubscription } from "./commands/apiKey";
import { getSubscription as getTypingSubscription } from "./commands/editor";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(getApiKeySubscription());
	context.subscriptions.push(getTypingSubscription());
}

export function deactivate() {}
