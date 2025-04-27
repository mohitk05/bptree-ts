class BaseNode {
  private static idCounter = 0;
  // level in the tree
  level: number;
  // number of children
  count: number;
  // identifier
  id: number;

  constructor(level: number, count: number) {
    this.level = level;
    this.count = count;
    this.id = BaseNode.idCounter++;
  }

  isLeaf() {
    return this.level === 0;
  }
}

export class InnerNode extends BaseNode {
  static capacity = 10;
  keys: number[] = [];
  children: BaseNode[] = [];

  constructor() {
    super(0, 0);
  }
}

export class LeafNode extends BaseNode {
  static capacity = 10;
  keys: number[] = [];
  values: number[] = [];

  constructor() {
    super(0, 0);
  }
}

export class BPTree {
  root: BaseNode | null = null;

  constructor() {}

  lookup(key: number): number | null {
    if (!this.root) {
      return null;
    }

    let node = this.root;

    while (!node.isLeaf()) {
      const innerNode = node as InnerNode;
      const pos = this.lowerBound(innerNode.keys, key);
      const childNodePosition =
        pos === -1
          ? innerNode.keys.length
          : key === innerNode.keys[pos]
          ? pos + 1
          : pos;

      node = innerNode.children[childNodePosition];
    }

    const leafNode = node as LeafNode;
    if (leafNode.keys.includes(key)) {
      return leafNode.values[leafNode.keys.indexOf(key)];
    }

    return null;
  }

  insert(key: number, value: number) {
    if (!this.root) {
      const leaf = new LeafNode();
      leaf.keys[0] = key;
      leaf.values[0] = value;
      leaf.count = 1;

      this.root = leaf;
      return;
    }

    const result = this._insert(this.root, key, value);
    if (result) {
      // split root node
      const newRoot = new InnerNode();
      newRoot.count = 2;
      newRoot.children = [this.root, result.node];
      newRoot.keys[0] = result.separatorKey;
      newRoot.level = this.root.level + 1;

      this.root = newRoot;
    }
  }

  erase(key: number) {}

  private lowerBound(arr: number[], key: number) {
    return arr.findIndex((n) => n > key);
  }

  private _insert(
    node: BaseNode,
    key: number,
    value: number
  ): { node: BaseNode; separatorKey: number } | null {
    if (node.isLeaf()) {
      const leafNode = node as LeafNode;
      const index = leafNode.keys.indexOf(key);
      if (index !== -1) {
        leafNode.values[index] = value;
      } else {
        const pos = this.lowerBound(leafNode.keys, key);
        if (pos === -1) {
          leafNode.keys.push(key);
          leafNode.values.push(value);
        } else {
          leafNode.keys.splice(pos, 0, key);
          leafNode.values.splice(pos, 0, value);
        }
        leafNode.count++;
      }

      if (leafNode.keys.length <= LeafNode.capacity) {
        return null;
      } else {
        // split leaf node
        const mid = Math.floor(leafNode.keys.length / 2);
        const newNode = new LeafNode();
        newNode.keys = leafNode.keys.slice(mid);
        newNode.values = leafNode.values.slice(mid);
        newNode.count = leafNode.keys.length - mid;
        leafNode.keys = leafNode.keys.slice(0, mid);
        leafNode.values = leafNode.values.slice(0, mid);
        leafNode.count = mid;

        return { node: newNode, separatorKey: newNode.keys[0] };
      }
    } else {
      const innerNode = node as InnerNode;
      const pos = this.lowerBound(innerNode.keys, key);
      const childNodePosition =
        pos === -1
          ? innerNode.keys.length
          : key === innerNode.keys[pos]
          ? pos + 1
          : pos;
      const childNode = innerNode.children[childNodePosition];
      const result = this._insert(childNode, key, value);

      if (result) {
        // insert new key
        innerNode.keys.splice(childNodePosition, 0, result.separatorKey);
        innerNode.children.splice(childNodePosition + 1, 0, result.node);

        if (innerNode.keys.length <= InnerNode.capacity) {
          innerNode.count = innerNode.children.length;
          return null;
        } else {
          // split inner node
          const mid = Math.floor(innerNode.keys.length / 2);
          const separatorKey = innerNode.keys[mid];

          const newNode = new InnerNode();
          newNode.count = innerNode.keys.length - mid;
          newNode.level = innerNode.level;
          newNode.keys = innerNode.keys.slice(mid + 1);
          newNode.children = innerNode.children.slice(mid + 1);

          innerNode.count = mid + 1;
          innerNode.keys = innerNode.keys.slice(0, mid);
          innerNode.children = innerNode.children.slice(0, mid + 1);

          return { node: newNode, separatorKey };
        }
      }

      return null;
    }
  }
}
