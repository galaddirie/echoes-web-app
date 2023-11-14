import React, { useState } from 'react';
import { Window } from '../../components/window';
import notesIcon from '../../assets/notes.png';
type Note = {
    id: number;
    title: string;
    content: string;
};




export const Notes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const addNote = () => {
        const newNote = {
            id: Date.now(), // simple unique id generator
            title: "New Note",
            content: ""
        };
        setNotes([...notes, newNote]);
        setSelectedNote(newNote);
    };

    const updateNote = (updatedNote: Note) => {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    };

    return (
        <Window title="Notes" className="w-[600px] h-full" icon={notesIcon}>
            <div className="flex h-full">
                <div className="w-1/3 bg-gray-900 p-4">
                    <button onClick={addNote} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded">New Note</button>
                    {notes.map(note => (
                        <div key={note.id} 
                             className={`p-2 ${selectedNote?.id === note.id ? 'bg-blue-300' : ''}`} 
                             onClick={() => setSelectedNote(note)}>
                            {note.title}
                        </div>
                    ))}
                </div>
                <div className="w-2/3 bg-gray-800 p-4">
                    {selectedNote && (
                        <div>
                            <input 
                                className="w-full p-2 mb-4  rounded"
                                value={selectedNote.title} 
                                onChange={(e) => updateNote({ ...selectedNote, title: e.target.value })} 
                            />
                            <textarea 
                                className="w-full h-64 p-2 rounded"
                                value={selectedNote.content} 
                                onChange={(e) => updateNote({ ...selectedNote, content: e.target.value })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Window>
    );
};
