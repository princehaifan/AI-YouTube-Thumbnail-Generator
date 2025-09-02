
import React, { forwardRef } from 'react';
import type { EditableElement } from '../types';
import { EditableElementView } from './EditableElement';

interface EditorCanvasProps {
    backgroundImage: string | null;
    elements: EditableElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id:string, props: Partial<EditableElement>) => void;
    isLoading: boolean;
    error: string | null;
}

export const EditorCanvas = forwardRef<HTMLDivElement, EditorCanvasProps>(({ backgroundImage, elements, selectedElementId, onSelectElement, onUpdateElement, isLoading, error }, ref) => {
    
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onSelectElement(null);
        }
    }
    
    return (
        <div className="w-full max-w-5xl aspect-[16/9] bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden relative" onClick={handleCanvasClick}>
            {isLoading && (
                 <div className="flex flex-col items-center gap-4 text-gray-400">
                    <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-semibold">Generating your masterpiece...</p>
                 </div>
            )}
            {error && !isLoading && (
                <div className="text-center text-red-400 p-8">
                    <h3 className="text-xl font-bold mb-2">Oops!</h3>
                    <p>{error}</p>
                </div>
            )}
            {!isLoading && !error && !backgroundImage && (
                <div className="text-center text-gray-500 p-8">
                    <h3 className="text-xl font-bold mb-2">Welcome!</h3>
                    <p>Describe your thumbnail on the left and click "Generate" to start.</p>
                </div>
            )}
            {backgroundImage && (
                <div
                    ref={ref}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="w-full h-full relative" id="thumbnail-editor">
                       {elements.map(element => (
                            <EditableElementView 
                                key={element.id}
                                element={element}
                                isSelected={element.id === selectedElementId}
                                onSelect={onSelectElement}
                                onUpdate={onUpdateElement}
                                canvasRef={ref as React.RefObject<HTMLDivElement>}
                            />
                       ))}
                    </div>
                </div>
            )}
        </div>
    );
});
