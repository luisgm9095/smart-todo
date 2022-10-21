export const hasTreeNodeId: TreeNodeFilterCallback<TreeNodeId> = (id) => (node) => node.id === id;

export const hasTreeNodeParentId: TreeNodeFilterCallback<TreeNodeId> = (id) => (node) => node.parentId === id;

export const hasTreeNodeIdAtPath: TreeNodeFilterCallback<TreeNodeId> = (id) => (node) => node.path.includes(id);

export const addTreeNode = <T extends TreeNode>(nodes: Tree<T>, node: T): Tree<T> => {
    const parentId = node.parentId;
    // Start by adding the tree node at the end of the nodes hierarchy
    let index = nodes.length;
    // If the tree node has a parent, place it under the last element of the siblings and subchildren
    if (parentId) {
        nodes.forEach((otherTreeNode, i) => {
            if (hasTreeNodeId(parentId)(otherTreeNode) || hasTreeNodeParentId(parentId)(otherTreeNode) || hasTreeNodeIdAtPath(parentId)(otherTreeNode)) {
                index = i + 1;
            }
        });
    }
    const result = [
        ...nodes.slice(0, index),
        node,
        ...nodes.slice(index)
    ] as Tree<T>;
    
    return result;
}

export const orderTree = <T extends TreeNode>(nodes: Tree<T>): Tree<T> => 
    nodes.sort((a,b) => a.path.length - b.path.length).reduce<Tree<T>>((acc, curr) => addTreeNode(acc, curr), [] as Tree<T>);
    