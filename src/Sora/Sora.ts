import { SORA_PROMPTS } from './prompt';
import { Configuration, OpenAIApi } from "openai";

export class Sora {
    constructor(private apiKey: string | null = null) { }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateText(language: string, text: string) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        const configuration = new Configuration({
            apiKey: this.apiKey,
        });

        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                ...SORA_PROMPTS,
                {
                    "role": "user", "content": `Coding language: ${language}\n\nPrompt: ${text}`
                },
            ]
        });

        console.log(response);

        const choices = response.data.choices;

        return extractCode(choices[0]?.message?.content ?? '');
    }
}

function extractCode(dirty: string) {
    // Code will SOMETIMES appear in a code block
    const potentialMatches = dirty.match(/```[\S]*([\s\S]*)?```/);
    let code = dirty;

    if (potentialMatches && potentialMatches.length > 1) {
        code = potentialMatches[1];
    }

    return code.trim();
}