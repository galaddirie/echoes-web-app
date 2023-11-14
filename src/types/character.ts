
export type Character = {
    id: number;
    name: string;
    age: number;
    image: string;
    description: string;
    voiceID?: string;
}

export type Dialog = {
    id: number;
    character: string; // character name
    text: string;
    audioFile?: string;
}