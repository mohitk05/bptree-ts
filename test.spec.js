var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import test from "node:test";
import { BPTree, InnerNode } from "./bptree";
import assert from "node:assert";
test("B+Tree", (t) => __awaiter(void 0, void 0, void 0, function* () {
    let bpTree;
    t.beforeEach(() => {
        bpTree = new BPTree();
    });
    yield t.test("root is null on initialisation", () => {
        assert.equal(bpTree.root, null);
    });
    yield t.test("insert", (t) => __awaiter(void 0, void 0, void 0, function* () {
        t.beforeEach(() => {
            bpTree = new BPTree();
        });
        yield t.test("insert one element", () => {
            bpTree.insert(1, 10);
            const root = bpTree.root;
            assert.equal(root === null || root === void 0 ? void 0 : root.keys[0], 1);
            assert.equal(root === null || root === void 0 ? void 0 : root.values[0], 10);
        });
        yield t.test("insert multiple elements", () => {
            bpTree.insert(2, 20);
            bpTree.insert(3, 30);
            const root = bpTree.root;
            console.log(root);
            assert.equal(root === null || root === void 0 ? void 0 : root.count, 2);
            assert.equal(root === null || root === void 0 ? void 0 : root.keys[0], 2);
            assert.equal(root === null || root === void 0 ? void 0 : root.values[0], 20);
            assert.equal(root === null || root === void 0 ? void 0 : root.keys[1], 3);
            assert.equal(root === null || root === void 0 ? void 0 : root.values[1], 30);
        });
        yield t.test("insert more than leaf node capacity", () => {
            for (let i = 0; i < 11; i++) {
                bpTree.insert(i, i * 10);
            }
            assert.equal(bpTree.root instanceof InnerNode, true);
            const root = bpTree.root;
            assert.equal(root.count, 2);
            assert.equal(root.keys[0], 5);
            const leftChild = root.children[0];
            assert.equal(leftChild.count, 5);
        });
    }));
}));
