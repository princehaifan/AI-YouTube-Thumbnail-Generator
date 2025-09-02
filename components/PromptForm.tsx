
import React from 'react';
import { SparklesIcon } from './icons';

interface PromptFormProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-5 shadow-lg flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">1. Describe Your Thumbnail</h2>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A robot exploring a glowing alien jungle"
                className="w-full h-32 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                disabled={isLoading}
            />
            <button
                onClick={onGenerate}
                disabled={isLoading || !prompt}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        Generate Thumbnail
                    </>
                )}
            </button>
        </div>
    );
};
