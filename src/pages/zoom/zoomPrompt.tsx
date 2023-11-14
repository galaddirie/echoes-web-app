import React, { useState } from 'react';
import { Character } from '../../types/character';

export const basePromptTemplate = (scenario: string, characters: Character[], additionalDetails?: string) => {
    let prompt = `You will help me generate a script for a interactive experience 
    where a person will join and listen in on a zoom meeting with the CEO and other executives. \n\n
    they will acknowledge the person joining in and continue with the meeting.
    do not give the person joining in a name or any lines. \n\n

    Help me generate a script for the following scenario:\n\n
    `
    prompt = `Scenario: ${scenario}\n\n`;

    prompt += 'Characters in the scene:\n';
    //sort characters randomly
    const charactersCopy = [...characters];
    charactersCopy.sort(() => Math.random() - 0.5).forEach((character) => {
        prompt += `{
            ${character.name}:{
                id: ${character.id},
                name: ${character.name},
                age: ${character.age},
                description: ${character.description},
            }
        }`
    });


    if (additionalDetails) {
        prompt += `\nAdditional Details: ${additionalDetails}\n`;
    }

    // Finishing the prompt with a directive for script generation
    prompt += '\nGenerate a script for the above scenario and characters.';

    return prompt;
};



export const baseSceneTemplate = (characters: Character[], additionalDetails?: string) => {

    const scenarioBasePrompt = `
    Imagine a scenario set in a dystopian future where a large tech company, 
    notorious for prioritizing profit and power over ethics and morals, is holding an executive meeting. 
    As a manager, you are joining a Zoom call to observe a discussion between the CEO and other top executives.

    In this scenario, you will provide a high-level overview of the meeting's agenda. Choose a random topic
    The executives are known for their indifference to issues like 
    inequality, climate change, and human rights, race, and gender equality, 
    focusing solely on profit maximization. 
    Describe the key topics they will be addressing,
    the strategic objectives they aim to achieve, and the general tone of the conversation.

    Keep the portrayal subtly sinister, allowing the listener to grasp the company's malevolent nature without overtly dramatic elements. The aim is to provide a clear but nuanced picture of the company's ethos and strategic direction, without going into specific dialogue or individual character statements.

    Keep the scenario short (~150 words) and do not format as a script.
    ` 

    let prompt = scenarioBasePrompt;

    prompt += 'Characters in the scene:\n';
    const charactersCopy = [...characters];
    charactersCopy.sort(() => Math.random() - 0.5).forEach((character) => {
        prompt += `{
            ${character.name}:{
                id: ${character.id},
                name: ${character.name},
                age: ${character.age},
                description: ${character.description},
            }
        }`
    });

    return prompt;

}
