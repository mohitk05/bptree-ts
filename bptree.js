"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPTree = exports.LeafNode = exports.InnerNode = void 0;
var BaseNode = /** @class */ (function () {
    function BaseNode(level, count) {
        this.level = level;
        this.count = count;
    }
    BaseNode.prototype.isLeaf = function () {
        return this.level === 0;
    };
    return BaseNode;
}());
var InnerNode = /** @class */ (function (_super) {
    __extends(InnerNode, _super);
    function InnerNode() {
        var _this = _super.call(this, 0, 0) || this;
        _this.keys = [];
        _this.children = [];
        return _this;
    }
    InnerNode.capacity = 10;
    return InnerNode;
}(BaseNode));
exports.InnerNode = InnerNode;
var LeafNode = /** @class */ (function (_super) {
    __extends(LeafNode, _super);
    function LeafNode() {
        var _this = _super.call(this, 0, 0) || this;
        _this.keys = [];
        _this.values = [];
        return _this;
    }
    LeafNode.capacity = 10;
    return LeafNode;
}(BaseNode));
exports.LeafNode = LeafNode;
var BPTree = /** @class */ (function () {
    function BPTree() {
        this.root = null;
    }
    BPTree.prototype.lookup = function (key) {
        if (!this.root) {
            return null;
        }
        var node = this.root;
        while (!node.isLeaf()) {
            var innerNode = node;
            var pos = this.lowerBound(innerNode.keys, key);
            var childNodePosition = pos === -1
                ? innerNode.keys.length
                : key === innerNode.keys[pos]
                    ? pos + 1
                    : pos;
            node = innerNode.children[childNodePosition];
        }
        var leafNode = node;
        if (leafNode.keys.includes(key)) {
            return leafNode.values[leafNode.keys.indexOf(key)];
        }
        return null;
    };
    BPTree.prototype.insert = function (key, value) {
        if (!this.root) {
            var leaf = new LeafNode();
            leaf.keys[0] = key;
            leaf.values[0] = value;
            leaf.count = 1;
            this.root = leaf;
            return;
        }
        var result = this._insert(this.root, key, value);
        if (result) {
            // split root node
            var newRoot = new InnerNode();
            newRoot.count = 2;
            newRoot.children = [this.root, result.node];
            newRoot.keys[0] = result.separatorKey;
            newRoot.level = this.root.level + 1;
            this.root = newRoot;
        }
    };
    BPTree.prototype.erase = function (key) { };
    BPTree.prototype.lowerBound = function (arr, key) {
        return arr.findIndex(function (n) { return n > key; });
    };
    BPTree.prototype._insert = function (node, key, value) {
        if (node.isLeaf()) {
            var leafNode = node;
            var index = leafNode.keys.indexOf(key);
            if (index !== -1) {
                leafNode.values[index] = value;
            }
            else {
                leafNode.keys.push(key);
                leafNode.values.push(value);
                leafNode.count++;
            }
            if (leafNode.keys.length <= LeafNode.capacity) {
                return null;
            }
            else {
                // split leaf node
                var mid = Math.floor(leafNode.keys.length / 2);
                var newNode = new LeafNode();
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
            var innerNode = node;
            var pos = this.lowerBound(innerNode.keys, key);
            var childNodePosition = pos === -1
                ? innerNode.keys.length
                : key === innerNode.keys[pos]
                    ? pos + 1
                    : pos;
            var childNode = innerNode.children[childNodePosition];
            var result = this._insert(childNode, key, value);
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
                    var mid = Math.floor(innerNode.keys.length / 2);
                    var separatorKey = innerNode.keys[mid];
                    var newNode = new InnerNode();
                    newNode.count = innerNode.keys.length - mid;
                    newNode.level = innerNode.level;
                    newNode.keys = innerNode.keys.slice(mid + 1);
                    newNode.children = innerNode.children.slice(mid + 1);
                    innerNode.count = mid + 1;
                    innerNode.keys = innerNode.keys.slice(0, mid);
                    innerNode.children = innerNode.children.slice(0, mid + 1);
                    return { node: newNode, separatorKey: separatorKey };
                }
            }
            return null;
        }
    };
    return BPTree;
}());
exports.BPTree = BPTree;
