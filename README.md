# Sora by Capsule Cat

[![Push Check](https://github.com/CapsuleCat/sora-by-capsule-cat/actions/workflows/push.yml/badge.svg)](https://github.com/CapsuleCat/sora-by-capsule-cat/actions/workflows/push.yml)
[![VSCode Marketplace](https://img.shields.io/badge/VSCode-Marketplace-blue)](https://marketplace.visualstudio.com/items?itemName=CapsuleCat.sora-by-capsule-cat)

Sora is a VSCode extension for integrating ChatGPT into your coding workflow.

Simply type a comment and then add `@ChatGPT` to trigger the extension. Sora will generate code based on the
prompt given.

Remember to get your [OpenAI API Key](https://beta.openai.com/account/api-keys) and add it to your VSCode settings with
the command `Sora: Set API Key`.

## Features

Once your API key is set, you can use Sora one of two ways:

* Hovering over a comment and clicking the `ChatGPT` button.
* Typing a comment and then adding `@ChatGPT` to the end of the comment.

### Using the ChatGPT button

This is the easiest way to use Sora. Simply hover over a comment and click the `ChatGPT` button:

![Simple Sora hover example](./assets/hover-sora.gif)

### Using @ChatGPT

Typing `@ChatGPT` is the trigger keyword for Sora:

![Simple Sora example](./assets/simple-sora.gif)

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

## Requirements

Set your OpenAI API key once you install the extension.

## Extension Settings

This extension contributes the following settings:

* `sora-by-capsule-cat.apiKey`: The API key for OpenAI

## Development

This extension was developed using the VSCode Extension Generator. This requires `@vscode/vsce` to be installed globally:

```sh
npm install -g @vscode/vsce
```

Then use `vsce publish` to package and deploy the extension.

A full order of commands typically looks like:

```sh
npm version [major|minor|patch]
vsce publish
```
