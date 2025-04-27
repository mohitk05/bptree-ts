import { BPTree, InnerNode, LeafNode } from "./bptree.js";
import { expect, test, beforeEach, suite, describe } from "vitest";

suite("B+Tree", async () => {
  let bpTree: BPTree;
  beforeEach(() => {
    bpTree = new BPTree();
  });

  test("root is null on initialisation", () => {
    expect(bpTree.root).toEqual(null);
  });

  describe("insert", async (t) => {
    beforeEach(() => {
      bpTree = new BPTree();
    });

    test("insert one element", () => {
      bpTree.insert(1, 10);
      const root = bpTree.root as LeafNode;
      expect(root?.keys[0]).toBe(1);
      expect(root?.values[0]).toBe(10);
    });

    test("insert multiple elements", () => {
      bpTree.insert(2, 20);
      bpTree.insert(3, 30);
      const root = bpTree.root as LeafNode;
      expect(root?.count).toBe(2);
      expect(root?.keys[0]).toBe(2);
      expect(root?.values[0]).toBe(20);
      expect(root?.keys[1]).toBe(3);
      expect(root?.values[1]).toBe(30);
    });

    test("insert more than leaf node capacity", () => {
      for (let i = 0; i < 11; i++) {
        bpTree.insert(i, i * 10);
      }
      expect(bpTree.root instanceof InnerNode).toBe(true);
      const root = bpTree.root as InnerNode;
      expect(root.count).toBe(2);
      expect(root.keys[0]).toBe(5);
      const leftChild = root.children[0] as LeafNode;
      expect(leftChild.count).toBe(5);
    });
  });
});
