import { createContext, useContext } from 'react';

const EditModeContext = createContext({
    editMode: false
})

export const useEditModeContext = () => useContext(EditModeContext);

export const EditModeProvider = EditModeContext.Provider;
