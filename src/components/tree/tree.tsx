import { MemoizedTreeItem, TreeItem } from '../tree-item/tree-item';
import './tree.scss';

type TreeProps<T extends TreeNode> = {
    tree: Tree<T>,
    memoized?: boolean,
    renderComponent: TreeNodeRenderer<T>,
};

export const Tree = <T extends TreeNode>({
    tree,
    memoized = true,
    renderComponent
}: TreeProps<T>) => {
    const TreeItemComponent = memoized ? MemoizedTreeItem : TreeItem;
    const renderNode = (node: T) => (
        <TreeItemComponent key={node.id} item={node} renderComponent={renderComponent} />
    );
    const nodes = tree.map((node) => renderNode(node));
    
    return (
        <ol className='Tree'>
            { nodes }
        </ol>
    );
};
