
import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-4 sticky top-0 z-50">
            <div className="max-w-screen-2xl mx-auto flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <CameraIcon className="w-6 h-6 text-white"/>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">AI Thumbnail Generator</h1>
                    <p className="text-sm text-gray-400">Create engaging YouTube thumbnails in seconds.</p>
                </div>
            </div>
        </header>
    );
};
