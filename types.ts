
export interface ElementStyle {
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    color: string;
    textAlign: 'left' | 'center' | 'right';
    textStrokeWidth: number;
    textStrokeColor: string;
}

export interface EditableElement {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    style: Partial<ElementStyle>;
}
