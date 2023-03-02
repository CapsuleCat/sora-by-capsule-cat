import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	it('Should set API key in configuration', async function () {
		const command = 'Sora: Set API Key';

		// Execute the command to open the prompt
		await vscode.commands.executeCommand(command);

		// Type in Test as the API Key
		await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', {
			text: 'Test\n'
		});

		//Get the value of the API Key from configuration
		const apiKey = vscode.workspace.getConfiguration().get('sora.apiKey');

		assert.equal(apiKey, 'Test');
	});
});
