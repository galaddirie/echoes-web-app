import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';

type WindowProps = {
    children: React.ReactNode;
    title?: string;
    icon?: any;
    className?: string;
}

export const Window: React.FC<WindowProps> = ({ children, title, icon, className }) => {
    return (
        <Draggable>
            <div className={"bg-black rounded-lg shadow-lg overflow-hidden" + (className ? ` ${className}` : ``)}>
                <div className="bg-gray-800 px-4 py-2 flex items-center justify-between handle">
                    <div className="flex items-center">
                        <img src={icon} alt={title} className="w-5 h-5 mr-2"/>
                        <span className="text-white font-semibold">{title}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 cursor-pointer"/>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 cursor-pointer"/>
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 cursor-pointer"/>
                        
                        
                    </div>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </Draggable>
    ) 
}