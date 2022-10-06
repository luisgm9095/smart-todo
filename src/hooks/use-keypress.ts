import { useEffect, useState } from 'react';

const checkTrigger = (trigger: boolean, value: boolean): boolean => (!trigger && !value) || (trigger && value);

export const useKeyPress = (targetKey: string, targetCtrl = false, targetAlt = false) => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState<boolean>(false);
    // If pressed key is our target key then set to true
    function downHandler ({ key, ctrlKey, altKey }: KeyboardEvent) {
      if (key === targetKey && checkTrigger(targetCtrl, ctrlKey) && checkTrigger(targetAlt, altKey)) {
        setKeyPressed(true);
      }
    }
    // If released key is our target key then set to false
    function upHandler ({ key, ctrlKey, altKey }: KeyboardEvent) {
      if (key === targetKey || checkTrigger(targetCtrl, ctrlKey) || checkTrigger(targetAlt, altKey)) {
        setKeyPressed(false);
      }
    }
    // Add event listeners
    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return keyPressed;
  }