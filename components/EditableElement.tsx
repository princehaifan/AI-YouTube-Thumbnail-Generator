
import React, { useEffect, useRef, useState } from 'react';
import type { EditableElement } from '../types';

interface EditableElementProps {
    element: EditableElement;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, props: Partial<EditableElement>) => void;
    canvasRef: React.RefObject<HTMLDivElement>;
}

export const EditableElementView: React.FC<EditableElementProps> = ({ element, isSelected, onSelect, onUpdate, canvasRef }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelect(element.id);
        setIsDragging(true);
    };
    
    const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsResizing(true);
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const canvasRect = canvasRef.current.getBoundingClientRect();

            if (isDragging && ref.current) {
                 const newX = e.clientX - canvasRect.left - ref.current.offsetWidth / 2;
                 const newY = e.clientY - canvasRect.top - ref.current.offsetHeight / 2;
                 onUpdate(element.id, { x: newX, y: newY });
            }
            if (isResizing && ref.current) {
                const newWidth = e.clientX - canvasRect.left - element.x;
                const newHeight = e.clientY - canvasRect.top - element.y;
                onUpdate(element.id, { width: Math.max(newWidth, 50), height: Math.max(newHeight, 50) });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, onUpdate, element.id, element.x, element.y, canvasRef]);
    
    const textShadow = element.style.textStrokeWidth && element.style.textStrokeColor
        ? `${element.style.textStrokeColor} ${element.style.textStrokeWidth}px 0px 0px, ${element.style.textStrokeColor} 0px ${element.style.textStrokeWidth}px 0px, ${element.style.textStrokeColor} -${element.style.textStrokeWidth}px 0px 0px, ${element.style.textStrokeColor} 0px -${element.style.textStrokeWidth}px 0px`
        : 'none';


    return (
        <div
            ref={ref}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                cursor: isDragging ? 'grabbing' : 'grab',
                outline: isSelected ? '2px dashed #3b82f6' : 'none',
                outlineOffset: '4px'
            }}
        >
            {element.type === 'text' ? (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        fontFamily: element.style.fontFamily,
                        fontSize: `${element.style.fontSize}px`,
                        fontWeight: element.style.fontWeight,
                        color: element.style.color,
                        textAlign: element.style.textAlign,
                        lineHeight: 1.2,
                        textShadow: textShadow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none',
                    }}
                >
                    {element.style.content}
                </div>
            ) : (
                <img
                    src={element.style.content}
                    alt="user-upload"
                    className="w-full h-full object-contain pointer-events-none"
                    draggable="false"
                />
            )}
            {isSelected && (
                 <div
                    onMouseDown={handleResizeMouseDown}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize"
                 />
            )}
        </div>
    );
};
