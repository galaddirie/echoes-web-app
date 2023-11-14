import OpenAI from 'openai';
import { Character, Dialog } from '../types/character';
import {baseSceneTemplate} from '../pages/zoom/zoomPrompt';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    organization: process.env.OPENAI_ORG_ID || "",
    dangerouslyAllowBrowser: true,
});


const systemPrompt = `
You will be writing a script set in a dystopian future 
where the world where ethics and morals are secondary to profit and power.

this script will be then parsed so each character can be voiced by a TTS engine.

you will be given a scenario and a list of characters will return a script for the entire scene. in json format:
[
    {
        "character": "character name",
        "id": "character id",
        "text": "dialogue"
    },
    ...
]
The dialouge will be natural and be a dynamic conversation between the characters. 
(characters will respond to each other, ask questions, 
wont always respond to the last person who spoke, wont always state the persons name they are speaking to, etc)
Dialouge will opmized for TTS engines, 
where each character will have a unique voice (you can add ums, ahs, and other quirks to the dialogue)
Context is key for generating specific emotions. 
Thus, if one inputs laughing/funny text they might get a happy output. 
Similarly with anger, sadness, and other emotions, setting the context is key. 
Punctuation and voice settings play the leading role in how the output is delivered. 
Add emphasis by putting the relevant words/phrases in quotation marks. You can use dashes to indicate pauses. 
Use punctuation like ? and ! to indicate the tone of the sentence. 
write in style that is more accurate to how people speak instead of how people write.
do not including any stage directions, only dialogue and things that would be said out spoken.

`

export const generateScript = async (prompt: string) : Promise<Dialog[]> => {
    const maxRetries = 3;
    let currentTry = 0;
    console.log("Generating script...");

    while (currentTry < maxRetries) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k-0613",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
                max_tokens: 4096,
            });

            const script = response.choices[0].message.content || "";

            try {
                const parsedScript = parseScript(script);
                console.log("Generated script:", parsedScript);
                return  parsedScript;
            } catch (parseError) {
                console.log("Error parsing script:", parseError);
                currentTry++;
            }
        } catch (error) {
            console.log("Error generating script:", error);
            currentTry++;
        }
    }

    console.log("Failed to generate a valid script after retries");
    return [];
}


export const parseScript = (script: string) : Dialog[] => {
    // try parsing as JSON in Markdown block
    const markdownRegex = /```json\n([\s\S]*?)\n```/;
    const markdownMatches = script.match(markdownRegex);
    if (markdownMatches && markdownMatches.length >= 2) {
        try {
            return JSON.parse(markdownMatches[1]);
        } catch (error) {
            console.log("Invalid JSON format in Markdown block");
        }
    }

    // try parsing as JSON
    try {
        return JSON.parse(script);
    } catch (error) {
        console.log("Invalid JSON format");
        throw error;
    }
}




export const generateScene = async (characters: Character[]) : Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k-0613",
            messages: [
                { role: "user", content: baseSceneTemplate(characters) },
            ],
            max_tokens: 1000,
        });

        const scene = response.choices[0].message.content || "";
        console.log("Generated scene:", scene);
        return scene;
    } catch (error) {
        console.log("Error generating script:", error);
        return "";
    }   
    
}