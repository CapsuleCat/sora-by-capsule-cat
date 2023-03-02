/**
 * Cleans the input string
 */
export function cleanInput(dirty: string): string {
    // Replace "/*" with "/* " and "*/" with " */" to prevent comments from being removed
    let toReturn = dirty.replace(/\/\*(\/*)?/g, '').replace(/\*\//g, '');

    // Replace leading *
    toReturn = toReturn.replace(/^\s*\*/gm, '');

    // Replace [ChatGPT] with ""
    toReturn = toReturn.replace(/\[ChatGPT\]/g, '');

    // Trim
    return toReturn.trim();
}


export function extractResponseCode(dirty: string) {
    // Code will SOMETIMES appear in a code block
    const potentialMatches = dirty.match(/```[\S]*([\s\S]*)?```/);
    let code = dirty;

    if (potentialMatches && potentialMatches.length > 1) {
        code = potentialMatches[1];
    }

    return code.trim();
}