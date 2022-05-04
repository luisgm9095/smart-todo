import { ChangeEvent, useEffect, useState } from 'react';
import { useEditModeContext } from '../../context/edit-mode';
import './app-logo.scss';

type AppLogoProps = ({
    value: string
    onChange: (value: string) => void
})

export const AppLogo = ({
    value,
    onChange
}: AppLogoProps) => {
    const [editValue, setEditValue] = useState(value);
    const { editMode } = useEditModeContext();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    };

    const handleBlur = () => {
        onChange(editValue);
    };

    useEffect(() => {
        setEditValue(value)
    }, [value])

    return (
        <div className='AppLogo' title={value} >
            <input className='AppLogo_input' type='text' title={value} value={editValue} onChange={handleChange} onBlur={handleBlur} disabled={!editMode}/>
        </div>
    );
};
