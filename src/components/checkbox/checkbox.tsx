import cn from 'classnames';
import { MouseEvent } from 'react';
import './checkbox.scss';

type CheckboxProps = {
    className?: string,
    checked: boolean,
    onChange: (event: MouseEvent) => void
}

export const Checkbox = ({
    className,
    checked,
    onChange
}: CheckboxProps) => (
    <div className={cn(className, 'Checkbox', { 'Checkbox--checked': checked})} onClick={onChange} />
);
