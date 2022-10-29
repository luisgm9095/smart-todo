import { DragEvent, useCallback } from 'react';

/// TYPES

type DragCallback<T extends Element = Element> = (event: DragEvent<T>) => void;

/// CONSTANTS

const _SEPARATOR = '/';
const _FORMAT = 'text';
const _DEFAULT_CALLBACK = (): void => void 0;

/// UTILS

const disableNativeDragOverEvent: DragCallback = (event) => event.preventDefault();
const isDragEventInsideParent = <T extends Element = Element>(event: DragEvent<T>) => event.currentTarget.contains(event.relatedTarget as EventTarget & T);
const handleDropEvent = <T extends string>(event: DragEvent, context: string, callback: (key: T) => void) => {
    const data = event.dataTransfer?.getData(_FORMAT).split(_SEPARATOR);
    
    if (data.length > 1) {
        const [droppedContext, droppedKey] = data;

        if(droppedContext === context) {
            callback(droppedKey as T);
            event.stopPropagation();
        }
    }
};

/// HOOK

export const useDraggable = <T extends string>(
    key: T,
    context: string,
    onDropCallback: (key: T) => void = _DEFAULT_CALLBACK,
    onDragEnterCallback: () => void = _DEFAULT_CALLBACK,
    onDragLeaveCallback: () => void = _DEFAULT_CALLBACK
): {
    onDragOver: DragCallback,
    onDragStart: DragCallback,
    onDrop: DragCallback,
    onDragEnter: DragCallback,
    onDragLeave: DragCallback
} => {

    const onDragStart: DragCallback = useCallback((event) => {
        event.dataTransfer?.setData(_FORMAT, `${context}${_SEPARATOR}${key}`);
    }, []);

    const onDrop: DragCallback = useCallback((event) => {
        handleDropEvent(event, context, onDropCallback);
    }, [onDropCallback, context]);

    const onDragEnter: DragCallback = useCallback((event) => {
        !isDragEventInsideParent(event) && onDragEnterCallback();
        event.stopPropagation();
        event.preventDefault();
    }, [onDragEnterCallback]);

    const onDragLeave: DragCallback = useCallback((event) => {
        !isDragEventInsideParent(event) && onDragLeaveCallback();
        event.stopPropagation();
        event.preventDefault();
    }, [onDragLeaveCallback]);

    return {
        onDragOver: disableNativeDragOverEvent,
        onDragStart,
        onDrop,
        onDragEnter,
        onDragLeave
    }
}