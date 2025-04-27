class BaseNode {
    constructor(level, count) {
        this.level = level;
        this.count = count;
        this.id = this.generateId();
    }
    generateId() {
        return Math.random().toString(36).substring(2, 15);
    }
    isLeaf() {
        return this.level === 0;
    }
}
export class InnerNode extends BaseNode {
    constructor() {
        super(0, 0);
        this.keys = [];
        this.children = [];
    }
}
InnerNode.capacity = 10;
export class LeafNode extends BaseNode {
    constructor() {
        super(0, 0);
        this.keys = [];
        this.values = [];
    }
}
LeafNode.capacity = 10;
export class BPTree {
    constructor() {
        this.root = null;
    }
    lookup(key) {
        if (!this.root) {
            return null;
        }
        let node = this.root;
        while (!node.isLeaf()) {
            const innerNode = node;
            const pos = this.lowerBound(innerNode.keys, key);
            const childNodePosition = pos === -1
                ? innerNode.keys.length
                : key === innerNode.keys[pos]
                    ? pos + 1
                    : pos;
            node = innerNode.children[childNodePosition];
        }
        const leafNode = node;
        if (leafNode.keys.includes(key)) {
            return leafNode.values[leafNode.keys.indexOf(key)];
        }
        return null;
    }
    insert(key, value) {
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
    erase(key) { }
    lowerBound(arr, key) {
        return arr.findIndex((n) => n > key);
    }
    _insert(node, key, value) {
        if (node.isLeaf()) {
            const leafNode = node;
            const index = leafNode.keys.indexOf(key);
            if (index !== -1) {
                leafNode.values[index] = value;
            }
            else {
                const pos = this.lowerBound(leafNode.keys, key);
                if (pos === -1) {
                    leafNode.keys.push(key);
                    leafNode.values.push(value);
                }
                else {
                    leafNode.keys.splice(pos, 0, key);
                    leafNode.values.splice(pos, 0, value);
                }
                leafNode.count++;
            }
            if (leafNode.keys.length <= LeafNode.capacity) {
                return null;
            }
            else {
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
        }
        else {
            const innerNode = node;
            const pos = this.lowerBound(innerNode.keys, key);
            const childNodePosition = pos === -1
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
                }
                else {
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
