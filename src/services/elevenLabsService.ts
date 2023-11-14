import axios, { AxiosInstance } from 'axios';
import morganAudio from '../assets/morgan.mp3';
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

class ElevenLabs {
    private apiKey: string;
    private axiosInstance: AxiosInstance;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.axiosInstance = axios.create({
        baseURL: 'https://api.elevenlabs.io/v1',
        headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
        }
        });
    }

    async generate(voiceId: string, text: string) {
        const cacheKey = `${voiceId}:${text}`;
        const cachedAudio = localStorage.getItem(cacheKey);
        if (cachedAudio) {
            console.log('Audio found in cache');
            return base64ToArrayBuffer(cachedAudio);
        }
        try {
        const response = await this.axiosInstance.post(
            `/text-to-speech/${voiceId}/stream`,
            {
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
                stability: 0,
                similarity_boost: 0,
                style: 0,
                use_speaker_boost: true
            }
            },
            {
            responseType: 'arraybuffer'
            }
        );

        console.log('Text to Speech conversion successful');
        const base64Audio = arrayBufferToBase64(response.data);
        localStorage.setItem(cacheKey, base64Audio);
        return response.data;
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

const elevenLabs = new ElevenLabs(import.meta.env.ELEVENLABS_API_KEY || '');

export default elevenLabs;
