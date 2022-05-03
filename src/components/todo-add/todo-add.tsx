import cn from 'classnames';
import './todo-add.scss';

type TodoAddProps = {
    className?: string,
    onClick: () => void
}

export const TodoAdd = ({
    className,
    onClick
}: TodoAddProps) => {
    return (
        <button className={cn(className, 'TodoAdd')} onClick={onClick}>+</button>
    )
};
