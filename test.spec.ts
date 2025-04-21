import test from "node:test";
import { BPTree, InnerNode, LeafNode } from "./bptree";
import assert from "node:assert";

test("B+Tree", async (t) => {
  let bpTree: BPTree;
  t.beforeEach(() => {
    bpTree = new BPTree();
  });

  await t.test("root is null on initialisation", () => {
    assert.equal(bpTree.root, null);
  });

  await t.test("insert", async (t) => {
    t.beforeEach(() => {
      bpTree = new BPTree();
    });

    await t.test("insert one element", () => {
      bpTree.insert(1, 10);
      const root = bpTree.root as LeafNode;
      assert.equal(root?.keys[0], 1);
      assert.equal(root?.values[0], 10);
    });

    await t.test("insert multiple elements", () => {
      bpTree.insert(2, 20);
      bpTree.insert(3, 30);
      const root = bpTree.root as LeafNode;
      console.log(root);
      assert.equal(root?.count, 2);
      assert.equal(root?.keys[0], 2);
      assert.equal(root?.values[0], 20);
      assert.equal(root?.keys[1], 3);
      assert.equal(root?.values[1], 30);
    });

    await t.test("insert more than leaf node capacity", () => {
      for (let i = 0; i < 11; i++) {
        bpTree.insert(i, i * 10);
      }
      assert.equal(bpTree.root instanceof InnerNode, true);
      const root = bpTree.root as InnerNode;
      assert.equal(root.count, 2);
      assert.equal(root.keys[0], 5);
      const leftChild = root.children[0] as LeafNode;
      assert.equal(leftChild.count, 5);
    });
  });
});
