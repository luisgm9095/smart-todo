import { ReactComponent as Icon } from '../../menu.svg';
import './app-menu-icon.scss';

type AppMenuIconProps = {
    onClick: () => void
}
export const AppMenuIcon = ({
    onClick
}: AppMenuIconProps) => (
    <div className='AppMenuIcon' onClick={onClick}>
        <Icon />
    </div>
);
