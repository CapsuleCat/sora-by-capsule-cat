interface ChatGPTResponse {
    choices: {
        text: string;
        index: number;
        logprobs: any;
        finish_reason: string;
    }[];
}