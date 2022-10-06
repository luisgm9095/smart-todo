type TreeNodeId = string;

type TreeNode = {
    id: TreeNodeId,
    parentId?: TreeNodeId,
    path: TreeNodeId[]
};

type Tree<T extends TreeNode> = T[];

type TreeReducer<T extends TreeNode> = StateReducer<Tree<T>, T>

type TreeNodeFilterCallback<T> = (value: T) => (node: TreeNode) => boolean;

type TreeNodeRenderer<T extends TreeNode> = (value: T) => React.ReactNode;