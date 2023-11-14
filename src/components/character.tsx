import React, { useEffect, useState } from 'react'
import { Character as CharacterType } from '../types/character'
import char1 from "../assets/characters/1.png";
import char2 from "../assets/characters/2.png";
import char3 from "../assets/characters/3.png";
import char4 from "../assets/characters/4.png";
import char5 from "../assets/characters/5.png";
import char6 from "../assets/characters/6.png";
import char7 from "../assets/characters/7.png";
import char8 from "../assets/characters/8.png";
import char9 from "../assets/characters/9.png";
import char10 from "../assets/characters/10.png";
import char11 from "../assets/characters/11.png";


export const CharacterIcons = {
    1: "https://upload.wikimedia.org/wikipedia/en/9/9b/Luke_Skywalker.png",

}

export const Characters = [
    {
        id: 1,
        name: "Ethan Maverick",
        age: 45,
        image: char1,
        description: `Ethan Maverick, the Chief Innovation Officer, 
        speaks with a sophisticated British accent. 
        Known for his visionary ideas, he often gets lost in theoretical concepts, 
        using complex jargon that leaves others puzzled.`,
        voiceID: "N2lVS1w4EtoT3dr4eOWO"
    },
    {
        id: 2,
        name: "Liam Sterling",
        age: 38,
        image: char2,
        description: `Liam Sterling, the Vice President of Finance, 
        with his sharp british-essex accent, is a numbers wizard. 
        He loves to crunch data but is often overly cautious, 
        doubting even solid financial strategies.`,
        voiceID: "CYw3kZ02Hs0563khs1Fj"
    },
    {
        id: 3,
        name: "Lucas Griffith",
        age: 50,
        image: char3,
        description: `Lucas Griffith, the Senior Legal Counsel, 
        has a deep, authoritative Southern accent. He's a master of legal language 
        but sometimes overcomplicates simple legal matters, causing confusion.`,
        voiceID: "flq6f7yk4E4fJM5XTYuZ"
    },
    {
        id: 4,
        name: "Tony DeLuca",
        age: 36,
        image: char4,
        description: `Tony DeLuca, Director of IT,
        speaks rapidly with a distinct New York italian accent.
        He's a tech genius but often so absorbed in technology 
        that he neglects practical applications.
        Everyone calls him "DeLuca".
        `,
        voiceID: "zcAOhNBS3c14rBihAFp1"
    },
    
    {
        id: 5,
        name: "Noah Calhoun",
        age: 42,
        image: char5,
        description: `Dr. Noah Calhoun, a south african computer scientist,
        he has poor social skills, speaks in fake southern accent to sound more trustworthy.
        He speaks in riddles that don't make sense but sound smart enough to fool most people. 
        his opinions are highly valued by the company's executives.`,
        voiceID: "t0jbNlBVZ17f02VDIeMI"
        
    },
    {
        id: 6,
        name: "Mason Knox",
        age: 48,
        image: char6,
        description: `Mason Knox, 
        a Manager on the Public Relations team, talks with a charming Californian lilt.
        He's excellent at spinning stories but often embellishes facts, 
        leading to exaggerated company narratives.`,
        voiceID: "ZQe5CZNOzWyzPSCn5a3c"
    },
    {
        id: 7,
        name: "Logan Bennett",
        age: 53,
        image: char7,
        description: `Logan Bennett, 
        the Chief Operations Officer, speaks in a clear, 
        concise manner. He's known for his operational efficiency but is so risk-averse 
        that he sometimes misses out on innovative opportunities.`,
        voiceID: "onwK4e9ZLuTAKqWW03F9"

    },
    {
        id: 8,
        name: "Aiden Walker",
        age: 39,
        image: char10,
        description: `Aiden Walker, a charismatic Marketing Manager,
        has an upbeat surfer bro accent. 
        He's great at networking but often slacks off, 
        using vague company jargon to white lie about his previous day's work.`,
        voiceID: "GBv7mTt0atIp3Br8iCZE"
    },
    {
        id: 9,
        name: "Jackson Pierce",
        age: 41,
        image: char11,
        description: `Jackson Pierce, Digital Strategist,
        known for his articulate speech with a slight Australian twang. 
        He's a strategic thinker but often gets caught up in long-term planning, 
        missing immediate company needs.`,
        voiceID: "yoZ06aMxZJJ28mfd3POQ"
    }
]


export const Character: React.FC<CharacterType & { isTalking: boolean, avgVolume: number }> = ({ name, age, image, isTalking, avgVolume }) => {
    // Calculate mouth height based on volume
    const [mouthHeight, setMouthHeight] = useState(0);
    useEffect(() => {
        const mouthHeight = 10 + Math.random()
        if (isTalking && avgVolume > 130000) {
            setMouthHeight(mouthHeight);
        }
        else {
            setMouthHeight(0);
        }

    }, [avgVolume]);


    return (
        <div className='text-center'>
        <div className="col-span-1 relative flex flex-col justify-center items-center">
            
            <div className="w-[102px] h-[102px]  overflow-hidden flex justify-center items-center">
                <img src={image} alt={name} className=
                {
                    `w-[100px] h-[100px] object-cover object-center `
                    + (isTalking && avgVolume > 130000 ? `character-active` : ``)
                }
                 />
            </div>
            {/* mouth effect */}
            <div
                className={`w-5 bg-[#100617] rounded-xl absolute right-[39.0%] bottom-[30%] overflow-hidden transition-all duration-75 ease-in`}
                style={{ height: `${mouthHeight}px` }} 
            >
                
                <div
                    className={`w-3 bg-[#cf6676] rounded-xl absolute right-[15.0%] bottom-[-80%] overflow-hidden`}
                    style={{ height: `10px` }} 
                />
            </div>
            

            
        </div>
        <p className="text-sm font-bold mt-2">
            {name}
        </p>

        </div>
    )
}
