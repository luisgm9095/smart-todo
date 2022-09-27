import { DragEvent } from 'react';

type DragCallback = (event: DragEvent) => void;

const _SEPARATOR = '/';
const _FORMAT = 'text';
const _DEFAULT_CALLBACK = (): void => void 0;
const disableNativeDragOverEvent: DragCallback = (event) => event.preventDefault();
const checkDragEvent = <T extends string>(event: DragEvent, context: string, callback: (key: T) => void) => {
    const data = event.dataTransfer?.getData(_FORMAT).split(_SEPARATOR);
    
    if (data.length > 1) {
        const [droppedContext, droppedKey] = data;

        if(droppedContext === context) {
            callback(droppedKey as T);
        }
    }
};

export const useDraggable = <T extends string>(
    key: T,
    context: string,
    onDropCallback: (key: T) => void = _DEFAULT_CALLBACK,
    onDragEnterCallback: (key: T) => void = _DEFAULT_CALLBACK,
    onDragLeaveCallback: (key: T) => void = _DEFAULT_CALLBACK
): {
    onDragOver: DragCallback,
    onDragStart: DragCallback,
    onDrop: DragCallback,
    onDragEnter: DragCallback,
    onDragLeave: DragCallback
} => {

    const onDragStart: DragCallback = (event) => {
        event.dataTransfer?.setData(_FORMAT, `${context}${_SEPARATOR}${key}`);
    }

    const onDrop: DragCallback = (event) => {
        checkDragEvent(event, context, onDropCallback);
    }

    const onDragEnter: DragCallback = (event) => {
        checkDragEvent(event, context, onDragEnterCallback);
    }

    const onDragLeave: DragCallback = (event) => {
        checkDragEvent(event, context, onDragLeaveCallback);
    }

    return {
        onDragOver: disableNativeDragOverEvent,
        onDragStart,
        onDrop,
        onDragEnter,
        onDragLeave
    }
}