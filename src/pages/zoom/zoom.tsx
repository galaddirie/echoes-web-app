import React, { useState, useEffect } from "react";
import { Character } from "../../components/character";
import { generateScript, generateScene } from "../../services/openAiService";
import elevenLabs from "../../services/elevenLabsService";
import openAiTTS from "../../services/openAiTTS";
import { basePromptTemplate } from "./zoomPrompt";
import {
    Volume2,
    MicOff,
    VideoOff,
    Loader2,
    RefreshCcw,
    PhoneOff,

} from 'lucide-react';

import { Dialog, Character as CharacterType } from "../../types/character";

import morganAudio from "../../assets/test2.mp3";
import aiden1 from "../../assets/generated/aiden1.mp3";
import ethan1 from "../../assets/generated/ethan1.mp3";
import liam1 from "../../assets/generated/liam1.mp3";
import lucas1 from "../../assets/generated/lucas1.mp3";
import mason1 from "../../assets/generated/mason1.mp3";
import noah1 from "../../assets/generated/noah1.mp3";
import tony1 from "../../assets/generated/tony1.mp3";
import logan1 from "../../assets/generated/logan1.mp3";
import jackson1 from "../../assets/generated/jackson1.mp3";
import noah2 from "../../assets/generated/noah2v2.mp3";

import joinMeeting from "../../assets/join.mp3";
import leaveMeeting from "../../assets/leave.mp3";
export interface ZoomProps {
    characters: CharacterType[];
}



let fakeScript = [
    {id:1 , character: "Ethan Maverick", text: "Hello, I am Ethan Maverick, the Chief Innovation Officer", audioFile: ethan1},
    {id:2 , character: "Liam Sterling", text: "'ello everyone i am Liam Sterling... the Vice President of Finance", audioFile: liam1},
    {id:5 , character: "Noah Calhoun", text: "Hello, I am Noah Calhoun,  I am a computer scientist", audioFile: noah1},
    {id:3 , character: "Lucas Griffith", text: "Hello, I am Lucas Griffith, the Senior Legal Counsel", audioFile: lucas1},
    {id:4 , character: "Tony DeLuca", text: "Hello, I am DeLuca, Director of IT", audioFile: tony1},
    {id:6 , character: "Mason Knox", text: "Hello, I am Mason Knox, a 'Manager' on the 'Public Relations' team", audioFile: mason1},
    {id:7 , character: "Logan Bennett", text: "Hello, I am Logan Bennett, the Chief Operations Officer", audioFile: logan1},
    {id:8 , character: "Aiden Walker", text: "hey bros, i'm Aiden and umm, im like a manager or something on the marketing team", audioFile: aiden1},
    {id:9 , character: "Jackson Pierce", text: "g'day mates, i'm Jackson and im a Digital Strategist from brisbane", audioFile: jackson1},
    {id:5 , character: "Noah Calhoun", text: "Today we are going demonstrate dynamic conversation generation", audioFile: noah2},
]


const ScriptPanel: React.FC<{script: Dialog[], handlePlayAll: () => void}> = ({script, handlePlayAll}) => {
    return (
        <div className="w-full">
            <h3 className="text-lg font-bold mb-2">Generated Script</h3>
            <button className="w-full p-2 bg-blue-500 text-white rounded mb-4" onClick={handlePlayAll} >Play All</button>
            
           
            <div className="w-full h-full overflow-y-auto p-2 border bg-black">
                {script.map((dialog, index) => (
                    <div key={index} className="mb-2">
                        <div className="flex items-center mb-2">
                            <button className="text-white mr-1" 
                            // onClick={() => streamAudio(dialog.text, "GBv7mTt0atIp3Br8iCZE", dialog.id)}
                            >
                                <Volume2 size={16} className="inline-block mr-2"/>
                            </button>
                            <span className="text-gray-400">{dialog.character}:</span>
                        </div>
                        <p className="text-white">{dialog.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const Zoom: React.FC<ZoomProps> = ({ characters }) => {
    const [simulateTalking, setSimulateTalking] = useState(true); // New state to track simulation

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [script, setScript] = useState<Dialog[]>(fakeScript);
    const [talkingCharacter, setTalkingCharacter] = useState<number | null>(null);
    const [avgVolume, setAvgVolume] = useState(0); // Add state to hold average volume

    const joinAudio = new Audio(joinMeeting);
    const leaveAudio = new Audio(leaveMeeting);

    const handleTalking = (characterId: number, isTalking: boolean) => {
        if (isTalking) {
            setTalkingCharacter(characterId);
        } else if (talkingCharacter === characterId) {
            setTalkingCharacter(null);
        }
    };

    const generateAudioStreams = async (dialogs: Dialog[]) => {
        const audioStreams = [];
        for (const dialog of dialogs) {
            const character = characters.find((character) => character.id === dialog.id);
            if (dialog.audioFile) {
                console.log("using audio file");
                const stream = await fetch(dialog.audioFile);
                audioStreams.push({ stream: await stream.arrayBuffer(), characterId: dialog.id });
                continue;
            } else  {
                // const stream = await elevenLabs.generate(character?.voiceID || "", dialog.text);
                // // const testAudio =  await fetch(morganAudio);
                // // const stream = await testAudio.arrayBuffer();
                // audioStreams.push({ stream, characterId: dialog.id });
            }
        }
        return audioStreams;
    };

    const playAudioStream = async (audioStream: { stream: ArrayBuffer; characterId: number; }) => {
        return new Promise<void>((resolve, reject) => {
            elevenLabs.play(audioStream.stream, {
                onVolumeChange: (volume: number) => {
                    console.log(volume);
                    setAvgVolume(volume);
                },
                onEnd: () => {
                    console.log('Audio ended');
                    handleTalking(audioStream.characterId, false);
                    resolve();
                },
                onError: (error: any) => {
                    console.error('Error in playing audio:', error);
                    handleTalking(audioStream.characterId, false);
                    reject(error);
                },
            });
        });
    };

    const playAudioSequentially = async (audioStreams: { stream: ArrayBuffer; characterId: number; }[]) => {
        for (const audioStream of audioStreams) {
            handleTalking(audioStream.characterId, true); // Open mouth
            await playAudioStream(audioStream);
        }
    };

    const handlePlayAll = async (dialogs: Dialog[]) => {
        const audioStreams = await generateAudioStreams(dialogs);
        await playAudioSequentially(audioStreams);
    };

    const handleSceneGeneration = async () => {
        console.log("generating scene...");
        const scene = await generateScene(characters);
        if (!scene) { return null; }
        return scene;
    }
    
    const handleGenerateScript = async (scene: string | null) => {
        if (!scene) { return; }
        const basePrompt = basePromptTemplate(scene, characters);
        console.log(basePrompt);
        const script = await generateScript(basePrompt)
        if (!script) { return; }
        return script;
    };
    
    const simulateCharacterTalking = () => {
        const randomCharacterId = characters[Math.floor(Math.random() * characters.length)].id;
        setTalkingCharacter(randomCharacterId);
        setAvgVolume(100000 + Math.random() * 500000); // Set a random volume within a reasonable range
        setSimulateTalking(true);
    };

    const stopSimulatingTalking = () => {
        setTalkingCharacter(null);
        setAvgVolume(0);
        setSimulateTalking(false);
    };

    const handleJoinMeeting = async () => {
        console.log("joining meeting...");
        setLoading(true);
        // const scene = await handleSceneGeneration();
        // const script = await handleGenerateScript(scene);
        if (!script) { 
            console.log("no script generated");
            return; 
        }
        
        const audioStreams = await generateAudioStreams(script);
        if (simulateTalking) {
            stopSimulatingTalking(); // Stop simulating when user joins
        }
        setLoading(false);
        // play join meeting audio
        joinAudio.play();
        setLoaded(true);

        await playAudioSequentially(audioStreams);
        setScript(script);

        handleLeaveMeeting();


    }

    const handleLeaveMeeting = () => {
        console.log("leaving meeting...");
        setLoaded(false);
        // play leave meeting audio
        leaveAudio.play();
        setSimulateTalking(true);
        // setScript([]);
    }
    useEffect(() => {
        let characterChangeInterval: NodeJS.Timeout;
        let volumeChangeInterval: NodeJS.Timeout;

        if (simulateTalking) {
            characterChangeInterval = setInterval(() => {
                const randomCharacterId = characters[Math.floor(Math.random() * characters.length)].id;
                setTalkingCharacter(randomCharacterId);
            }, 2000); // Change character every 2 seconds

            volumeChangeInterval = setInterval(() => {
                setAvgVolume(100000 + Math.random() * 45000); // Random volume
            }, 100); // Update volume every 100 milliseconds
        }

        return () => {
            if (characterChangeInterval) clearInterval(characterChangeInterval);
            if (volumeChangeInterval) clearInterval(volumeChangeInterval);
        };
    }, [simulateTalking, characters]);


    return (
        <div className="grid grid-cols-1 gap-10">
            <div className="flex flex-col items-center">
                <div className="flex">
                    <div className="grid grid-cols-3 gap-10">
                        {characters.map((character) => (
                            <Character
                            key={character.id}
                            {...character}
                            isTalking={talkingCharacter === character.id}
                            avgVolume={avgVolume}
                        />

                        ))}
                    </div>
                </div>
                {/* <div className="w-96  p-4">
                    <h2 className="text-lg font-bold mb-4">Scene</h2>
                    <div className="w-full h-32 overflow-y-auto p-2 border bg-black mb-4">
                        <p className="text-white">{prompt || "No SCene Generated"}</p>
                    </div>
                    <button
                        className="w-full p-2 bg-blue-500 text-white rounded mb-4"
                        onClick={handleSceneGeneration}
                    >
                        Generate Scene
                    </button>
                    <button
                        className="w-full p-2 bg-blue-500 text-white rounded"
                        onClick={handleGenerateScript}
                    >
                        Create Script
                    </button>

                </div> */}
                <div className="w-96  p-4 mt-2">
                { loaded ?
                    <div className="flex items-center justify-center">
                        <button className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center mr-4">
                            <MicOff size={24} className="text-white"/>
                        </button>
                        <button className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                            <VideoOff size={24} className="text-white"/>
                        </button>
                        <button className="w-10 h-10 bg-red-500 hover:bg-red-600
                        rounded-full flex items-center justify-center ml-4"
                            onClick={() => {
                                handleLeaveMeeting();
                            }}
                        >
                            <PhoneOff size={24} className="text-white"/>
                        </button>
                        {/* <button className=" p-4 h-10 bg-red-500 hover:bg-red-600
                        rounded-full flex items-center justify-center ml-4"
                        onClick={() => {
                            handleJoinMeeting();
                        }}
                        >
                            <RefreshCcw size={24} className="text-white"/> reload script
                        </button> */}
                    </div>
                    :
                    <button
                        className="w-full p-2 bg-transparent border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all duration-150"
                        onClick={handleJoinMeeting}
                    >
                        {loading ? <Loader2 size={24} className="inline-block mr-2 animate-spin"/> : "Join Meeting"}
                    </button>
                }
                </div>
            </div>
            {/* <ScriptPanel script={script} handlePlayAll={handlePlayAll} />  */}

        </div>
    )
}

