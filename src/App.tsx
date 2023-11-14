import React from 'react';
import Draggable from 'react-draggable';

import { Zoom } from './pages/zoom/zoom';
import { Window } from './components/window';
import { Characters, Character as CharacterType } from './components/character';
import zoomIcon from './assets/zoom.png';
import { Notes } from './pages/notes/notes';


function App() {
    
    return (
        <div className="relative flex justify-center items-center min-h-screen">
                <Window title="Daily Standup - Zoom" className="w-[600px] h-full" icon={zoomIcon}>
                        <Zoom characters={Characters} />
                </Window>
                {/* <Notes /> */}
        </div>
    );
        
}

export default App;
