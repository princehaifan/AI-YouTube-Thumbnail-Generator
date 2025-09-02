import React, { useState, useCallback, useRef } from 'react';
import { PromptForm } from './components/PromptForm';
import { EditorCanvas } from './components/EditorCanvas';
import { EditingToolbar } from './components/EditingToolbar';
import { Header } from './components/Header';
import type { EditableElement, ElementStyle } from './types';
import { generateThumbnail } from './services/geminiService';
// FIX: Removed unused import of MimeType, as it is not an exported member of '@google/genai'.

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A vibrant sunset over a futuristic city, cinematic lighting, hyperrealistic');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [elements, setElements] = useState<EditableElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    
    const canvasRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a prompt to generate a thumbnail.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setElements([]); // Clear existing elements on new generation

        try {
            const imageUrl = await generateThumbnail(prompt);
            setGeneratedImage(imageUrl);
        } catch (e) {
            console.error(e);
            setError('Failed to generate thumbnail. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const addElement = useCallback((type: 'text' | 'image', file?: File) => {
        const newElement: EditableElement = {
            id: crypto.randomUUID(),
            type,
            x: 50,
            y: 50,
            width: type === 'text' ? 400 : 300,
            height: type === 'text' ? 70 : 300,
            style: {
                content: type === 'text' ? 'New Text' : '',
                fontFamily: 'Impact, sans-serif',
                fontSize: 64,
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
                textStrokeWidth: 2,
                textStrokeColor: '#000000',
            },
        };
        
        if (type === 'image' && file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file (PNG, JPG, etc.).');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image file is too large. Please upload an image under 5MB.');
                return;
            }
            setError(null); // Clear previous errors

            const reader = new FileReader();
            reader.onloadend = () => {
                newElement.style.content = reader.result as string;
                setElements(prev => [...prev, newElement]);
                setSelectedElementId(newElement.id);
            };
            reader.readAsDataURL(file);
        } else if(type === 'text') {
            setError(null);
            setElements(prev => [...prev, newElement]);
            setSelectedElementId(newElement.id);
        }
    }, []);

    const updateElement = useCallback((id: string, newProps: Partial<EditableElement>) => {
        setElements(prev => 
            prev.map(el => (el.id === id ? { ...el, ...newProps } : el))
        );
    }, []);

    const updateElementStyle = useCallback((id: string, newStyle: Partial<ElementStyle>) => {
        setElements(prev =>
            prev.map(el =>
                el.id === id ? { ...el, style: { ...el.style, ...newStyle } } : el
            )
        );
    }, []);

    const deleteElement = useCallback((id: string) => {
        setElements(prev => prev.filter(el => el.id !== id));
        if (selectedElementId === id) {
            setSelectedElementId(null);
        }
    }, [selectedElementId]);

    const handleReorderElement = useCallback((direction: 'forward' | 'backward') => {
        if (!selectedElementId) return;

        setElements(prevElements => {
            const index = prevElements.findIndex(el => el.id === selectedElementId);
            if (index === -1) return prevElements;

            const newElements = [...prevElements];
            if (direction === 'forward' && index < newElements.length - 1) {
                [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
            } else if (direction === 'backward' && index > 0) {
                [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
            }
            return newElements;
        });
    }, [selectedElementId]);

    const handleExport = useCallback(() => {
        const nodeToCapture = canvasRef.current;
        if (!nodeToCapture) {
            setError('Could not find canvas element to export.');
            return;
        }
        if (!(window as any).htmlToImage) {
            setError('Export library not loaded. Please refresh the page.');
            return;
        }

        // Deselect element to hide controls before capture
        setSelectedElementId(null);

        // A short delay to allow the UI to update (hide selection outlines)
        setTimeout(() => {
            const options = {
                quality: 1.0, // Use highest quality for PNG
                canvasWidth: 1280,
                canvasHeight: 720,
                pixelRatio: 1, // We are setting a fixed canvas size, so pixelRatio should be 1
            };

            (window as any).htmlToImage.toPng(nodeToCapture, options)
                .then((dataUrl: string) => {
                    // Create a link and trigger the download
                    const link = document.createElement('a');
                    link.download = 'youtube-thumbnail.png';
                    link.href = dataUrl;
                    document.body.appendChild(link); // Append to body for Firefox compatibility
                    link.click();
                    document.body.removeChild(link); // Clean up
                })
                .catch((err: Error) => {
                    console.error('Export failed:', err);
                    setError('Could not export image. Please try again.');
                });
        }, 100);
    }, []);

    const selectedElement = elements.find(el => el.id === selectedElementId);
    const selectedElementIndex = selectedElementId ? elements.findIndex(el => el.id === selectedElementId) : -1;
    const canMoveForward = selectedElementIndex !== -1 && selectedElementIndex < elements.length - 1;
    const canMoveBackward = selectedElementIndex > 0;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6">
                <div className="lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
                    <PromptForm 
                        prompt={prompt} 
                        setPrompt={setPrompt} 
                        onGenerate={handleGenerate} 
                        isLoading={isLoading} 
                    />
                    {generatedImage && (
                        <EditingToolbar 
                            selectedElement={selectedElement}
                            onUpdateStyle={updateElementStyle}
                            onAddElement={addElement}
                            onDeleteElement={deleteElement}
                            onExport={handleExport}
                            onReorderElement={handleReorderElement}
                            canMoveForward={canMoveForward}
                            canMoveBackward={canMoveBackward}
                        />
                    )}
                </div>

                <div className="flex-grow flex items-center justify-center">
                   <EditorCanvas
                        ref={canvasRef}
                        backgroundImage={generatedImage}
                        elements={elements}
                        selectedElementId={selectedElementId}
                        onSelectElement={setSelectedElementId}
                        onUpdateElement={updateElement}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;