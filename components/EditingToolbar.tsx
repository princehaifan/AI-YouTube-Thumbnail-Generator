
import React, { useRef } from 'react';
import type { EditableElement, ElementStyle } from '../types';
import { AddImageIcon, AddTextIcon, DeleteIcon, ExportIcon, BringForwardIcon, SendBackwardIcon } from './icons';

interface EditingToolbarProps {
    selectedElement: EditableElement | undefined;
    onUpdateStyle: (id: string, newStyle: Partial<ElementStyle>) => void;
    onAddElement: (type: 'text' | 'image', file?: File) => void;
    onDeleteElement: (id: string) => void;
    onExport: () => void;
    onReorderElement: (direction: 'forward' | 'backward') => void;
    canMoveForward: boolean;
    canMoveBackward: boolean;
}

const FONT_OPTIONS = ['Impact', 'Arial', 'Verdana', 'Helvetica', 'Georgia', 'Courier New', 'Comic Sans MS'];

export const EditingToolbar: React.FC<EditingToolbarProps> = ({ 
    selectedElement, 
    onUpdateStyle, 
    onAddElement, 
    onDeleteElement, 
    onExport, 
    onReorderElement,
    canMoveForward,
    canMoveBackward,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onAddElement('image', file);
        }
        event.target.value = ''; // Reset input
    };

    const handleUpdateStyle = <K extends keyof ElementStyle,>(key: K, value: ElementStyle[K]) => {
        if (selectedElement) {
            onUpdateStyle(selectedElement.id, { [key]: value });
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-5 shadow-lg flex flex-col gap-6">
            <div>
                 <h2 className="text-lg font-semibold text-white mb-4">2. Customize Your Design</h2>
                 <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => onAddElement('text')}
                        className="flex items-center justify-center gap-2 bg-gray-700 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                    >
                        <AddTextIcon className="w-5 h-5" />
                        Add Text
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 bg-gray-700 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                    >
                        <AddImageIcon className="w-5 h-5" />
                        Add Image
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg"
                    />
                </div>
            </div>

            {selectedElement && (
                <div className="border-t border-gray-700 pt-6 flex flex-col gap-6">
                    {selectedElement.type === 'text' && (
                        <div className="flex flex-col gap-4">
                            <h3 className="text-md font-semibold text-white">Edit Text</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                                <textarea
                                    value={selectedElement.style.content}
                                    onChange={(e) => handleUpdateStyle('content', e.target.value)}
                                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Font Family</label>
                                <select
                                    value={selectedElement.style.fontFamily}
                                    onChange={(e) => handleUpdateStyle('fontFamily', e.target.value)}
                                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                                >
                                    {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Font Size</label>
                                <input
                                        type="number"
                                        value={selectedElement.style.fontSize}
                                        onChange={(e) => handleUpdateStyle('fontSize', parseInt(e.target.value, 10))}
                                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Font Color</label>
                                <input
                                        type="color"
                                        value={selectedElement.style.color}
                                        onChange={(e) => handleUpdateStyle('color', e.target.value)}
                                        className="w-full h-10 p-1 bg-gray-900 border border-gray-700 rounded-md cursor-pointer"
                                />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Stroke Width</label>
                                <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={selectedElement.style.textStrokeWidth}
                                        onChange={(e) => handleUpdateStyle('textStrokeWidth', parseInt(e.target.value, 10))}
                                        className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md"
                                />
                                </div>
                                <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Stroke Color</label>
                                <input
                                        type="color"
                                        value={selectedElement.style.textStrokeColor}
                                        onChange={(e) => handleUpdateStyle('textStrokeColor', e.target.value)}
                                        className="w-full h-10 p-1 bg-gray-900 border border-gray-700 rounded-md cursor-pointer"
                                />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-4">
                        <h3 className="text-md font-semibold text-white">Arrange & Delete</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => onReorderElement('forward')}
                                disabled={!canMoveForward}
                                className="flex items-center justify-center gap-2 bg-gray-700 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <BringForwardIcon className="w-5 h-5" />
                                Forward
                            </button>
                             <button
                                onClick={() => onReorderElement('backward')}
                                disabled={!canMoveBackward}
                                className="flex items-center justify-center gap-2 bg-gray-700 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                <SendBackwardIcon className="w-5 h-5" />
                                Backward
                            </button>
                        </div>
                        <button
                            onClick={() => onDeleteElement(selectedElement.id)}
                            className="flex items-center justify-center gap-2 bg-red-600/20 text-red-400 font-medium py-2 px-4 rounded-md hover:bg-red-600/30 transition-colors duration-200"
                        >
                            <DeleteIcon className="w-5 h-5" />
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}
            
            <div className="border-t border-gray-700 pt-6">
                <h2 className="text-lg font-semibold text-white mb-4">3. Export</h2>
                <button
                    onClick={onExport}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-green-500 disabled:bg-green-800 transition-colors duration-200"
                >
                    <ExportIcon className="w-5 h-5" />
                    Export Thumbnail
                </button>
            </div>
        </div>
    );
};
