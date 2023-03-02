# Sora by Capsule Cat

Sora is a VSCode extension for integrating ChatGPT into your coding workflow.

Simply type a comment and then add `@ChatGPT` to trigger the extension. Sora will generate code based on the
prompt given.

Remember to get your [OpenAI API Key](https://beta.openai.com/account/api-keys) and add it to your VSCode settings with
the command `Sora: Set API Key`.

## Features

Once your API key is set, you can use Sora by typing a comment and then adding `@ChatGPT` to the end of the comment.

Typing `@ChatGPT` is the trigger keyword for Sora:

Example:

```javascript
/**
 * Write "Hello world" to console.
 * @ChatGPT
 */
```

Response:

```javascript
/**
 * Write "Hello world" to console.
 * @ChatGPT
 */
console.log("Hello world");
```

Another example:

```javascript
/**
 * Write a mocha test for a VScode extension. Open the command prompt, type "Sora: Set API Key".
 * Then in the prompt that appears, type "Test" for the API Key.
 * 
 * Assert that the API key is stored in the VScode configuration.
 * 
 * @ChatGPT
 */
const vscode = require('vscode');
const chai = require('chai');
const assert = chai.assert;

//Describe the test suite
describe('API Testing', function() {

  //Describe the individual test case
  it('Should set API key in configuration', async function() {

    //The command to open the Sora prompt
    const command = 'Sora: Set API Key';

    //Execute the command to open the prompt
    await vscode.commands.executeCommand(command);

    //Type in Test as the API Key
    await vscode.commands.executeCommand('workbench.action.terminal.sendSequence', {
      text: 'Test\n'
    });

    //Get the value of the API Key from configuration
    const apiKey = vscode.workspace.getConfiguration().get('sora.apiKey');

    //Assert the value is not empty and is equal to 'Test'
    assert.isNotEmpty(apiKey);
    assert.equal(apiKey, 'Test');

  });
});
```

## Requirements

Set your OpenAI API key once you install the extension.

## Extension Settings

This extension contributes the following settings:

* `sora-by-capsule-cat.apiKey`: The API key for OpenAI

## Development

This extension was developed using the VSCode Extension Generator.

Generate a new bundle using `npm run bundle`. This requires `@vscode/vsce` to be installed globally:

```sh
npm install -g @vscode/vsce
```
