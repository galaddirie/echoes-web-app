import axios, { AxiosInstance } from 'axios';
import morganAudio from '../assets/morgan.mp3';
import { Buffer } from 'buffer';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  
function base64ToArrayBuffer(base64: string): ArrayBuffer {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


interface playEventHandlers {
    onVolumeChange?: (volume: number) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
}

import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: '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',
    organization: 'org-duF7bTypTsmtLg7UBTDIDUki',
    dangerouslyAllowBrowser: true,
});

type openaiVoices = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
const openAiVoices: openaiVoices[] = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

function mapVoiceId(voiceId: string): openaiVoices {
    const hash = simpleHash(voiceId);
    const index = Math.abs(hash) % openAiVoices.length;
    return openAiVoices[index];
}
function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

class OpenAiTTS {

    
    async generate(voiceId: string, text: string) {
        const cacheKey = `${voiceId}:${text}`;
        const cachedAudio = localStorage.getItem(cacheKey);
        if (cachedAudio) {
            console.log('Audio found in cache');
            return base64ToArrayBuffer(cachedAudio);
        }
    
        try {
            const mp3 = await openai.audio.speech.create({
                model: "tts-1", // or "tts-1-hd" for higher quality
                voice: mapVoiceId(voiceId),
                input: text,
            });
    
            console.log('Text to Speech conversion successful');
            const buffer = Buffer.from(await mp3.arrayBuffer());
            const base64Audio = arrayBufferToBase64(buffer);
            localStorage.setItem(cacheKey, base64Audio);
            return buffer;
        } catch (error) {
            console.error('Error in Text to Speech conversion:', error);
            throw error;
        }
    }
    
    

    async play(arraybuffer: ArrayBuffer, eventHandlers: playEventHandlers) {
        const { onVolumeChange, onStart, onEnd, onError } = eventHandlers;

        return new Promise<void>(async (resolve, reject) => {
            try {
                const audioContext = new AudioContext();
                const audioBuffer = await audioContext.decodeAudioData(arraybuffer);
                const audioSource = audioContext.createBufferSource();
                audioSource.buffer = audioBuffer;
    
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                audioSource.connect(analyser);
                analyser.connect(audioContext.destination);
                audioSource.start();
                onStart?.();
    
                const checkVolume = () => {
                    analyser.getByteTimeDomainData(dataArray);
    
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    let average = sum / bufferLength;
    
                    onVolumeChange?.(sum)
                }
    
                const interval = setInterval(checkVolume, 100); // Check volume every 100ms
    
                audioSource.onended = () => {
                    clearInterval(interval);
                    onVolumeChange?.(0);
                    onEnd?.();
                };
            } catch (error) {
                console.error('Error in playing audio:', error);
                onError?.(error);
                reject(error); // Reject the promise in case of an error
            }
        });
    }
    

}


const openAiTTS = new OpenAiTTS();

export default openAiTTS;
