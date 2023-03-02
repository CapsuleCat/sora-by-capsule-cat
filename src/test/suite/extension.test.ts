import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Should set API key in configuration', async function () {
		const command = 'sora-by-capsule-cat.setApiKey';

		await vscode.commands.executeCommand(command,
			"Test"			
		);

		//Get the value of the API Key from configuration
		const apiKey = vscode.workspace.getConfiguration().get('sora-by-capsule-cat.apiKey');

		assert.equal(apiKey, 'Test');
	});
});
