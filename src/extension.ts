import * as vscode from 'vscode';

import { getSubscription as getApiKeySubscription } from "./commands/apiKey";
import { getSubscription as getTypingSubscription } from "./commands/editor";
import { getSubscriptions as hoverSubscriptions } from "./commands/hover";

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(getApiKeySubscription());
	context.subscriptions.push(getTypingSubscription());
	hoverSubscriptions().forEach((subscription) => context.subscriptions.push(subscription));
}

export function deactivate() {}
