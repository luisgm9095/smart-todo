import './tree-item.scss';
import { CSSProperties, memo } from 'react';

type TreeItemProps<T extends TreeNode> = {
    item: T,
    renderComponent: TreeNodeRenderer<T>,
};

export const TreeItem = <T extends TreeNode>({
    item,
    renderComponent
}: TreeItemProps<T>) => {
    const customStyle: CSSProperties = {
        paddingLeft: `${Math.floor(32 * item.path.length)}px`
    };
    
    return (
        <li className='TreeItem' style={customStyle}>
            {renderComponent(item)}
        </li>
    );
};
    
export const MemoizedTreeItem = memo(TreeItem) as typeof TreeItem;
