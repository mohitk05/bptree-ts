var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BPTree, InnerNode } from "./bptree.js";
import { expect, test, beforeEach, suite, describe } from "vitest";
suite("B+Tree", () => __awaiter(void 0, void 0, void 0, function* () {
    let bpTree;
    beforeEach(() => {
        bpTree = new BPTree();
    });
    test("root is null on initialisation", () => {
        expect(bpTree.root).toEqual(null);
    });
    describe("insert", (t) => __awaiter(void 0, void 0, void 0, function* () {
        beforeEach(() => {
            bpTree = new BPTree();
        });
        test("insert one element", () => {
            bpTree.insert(1, 10);
            const root = bpTree.root;
            expect(root === null || root === void 0 ? void 0 : root.keys[0]).toBe(1);
            expect(root === null || root === void 0 ? void 0 : root.values[0]).toBe(10);
        });
        test("insert multiple elements", () => {
            bpTree.insert(2, 20);
            bpTree.insert(3, 30);
            const root = bpTree.root;
            expect(root === null || root === void 0 ? void 0 : root.count).toBe(2);
            expect(root === null || root === void 0 ? void 0 : root.keys[0]).toBe(2);
            expect(root === null || root === void 0 ? void 0 : root.values[0]).toBe(20);
            expect(root === null || root === void 0 ? void 0 : root.keys[1]).toBe(3);
            expect(root === null || root === void 0 ? void 0 : root.values[1]).toBe(30);
        });
        test("insert more than leaf node capacity", () => {
            for (let i = 0; i < 11; i++) {
                bpTree.insert(i, i * 10);
            }
            expect(bpTree.root instanceof InnerNode).toBe(true);
            const root = bpTree.root;
            expect(root.count).toBe(2);
            expect(root.keys[0]).toBe(5);
            const leftChild = root.children[0];
            expect(leftChild.count).toBe(5);
        });
    }));
}));
