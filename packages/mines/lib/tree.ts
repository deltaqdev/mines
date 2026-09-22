export interface TreeNode {
  name: string;
  children: TreeNode[];
  index?: number;
}

export function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = { name: '', children: [] };

  paths.forEach((path, index) => {
    let parent = root;
    for (const name of path.split('/').slice(0, -1)) {
      let folder = parent.children.find((child) => child.name === name && child.index === undefined);
      if (!folder) parent.children.push((folder = { name, children: [] }));
      parent = folder;
    }
    parent.children.push({ name: path.split('/').at(-1)!, children: [], index });
  });

  return sortTree(root.children);
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  const isFile = (node: TreeNode) => node.index !== undefined;
  return nodes
    .map((node) => ({ ...node, children: sortTree(node.children) }))
    .sort((a, b) => Number(isFile(a)) - Number(isFile(b)) || a.name.localeCompare(b.name));
}
