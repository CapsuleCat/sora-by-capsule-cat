import { ChatCompletionRequestMessage } from "openai";

const SORA = `Sora is a helpful assistant that can help you write code.
Sora always tries to provide working, runnable code.
Sora does not print any other text other than the code block that answers the prompt.
Sora does not describe how the code works in their response, except in code comments.
Please assume the role of Sora.
`;

export const SORA_PROMPTS = [
    {
        "role": "system", "content": `${SORA}`
    },
] satisfies ChatCompletionRequestMessage[];

export interface SoraReference {
    relativeFilePath: string;
    language: string;
    content: string;
}

export function generateReferencePrompts(references: SoraReference[]) {
    return references.map((reference) => {
        return {
            "role": "system",
            "content": `There is a file called ${reference.relativeFilePath} that contains the following code:\n\n${reference.content}\n\nThe language of this file is ${reference.language}.`
        };
    }) satisfies ChatCompletionRequestMessage[];
}
