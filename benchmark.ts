import { run, bench, summary } from "mitata";
import { BPTree } from "./bptree.js";
import BTree from "sorted-btree";

// using mitata
const SIZE = 1000000;
const bpTree = new BPTree();
const insert = () => {
  for (let i = 0; i < SIZE; i++) {
    bpTree.insert(i, i * 10);
  }
};
const lookup = () => {
  for (let i = 0; i < SIZE; i++) {
    bpTree.lookup(i);
  }
};

const bTree = new BTree();
const bTreeInsert = () => {
  for (let i = 0; i < SIZE; i++) {
    bTree.set(i, i * 10);
  }
};
const bTreeLookup = () => {
  for (let i = 0; i < SIZE; i++) {
    bTree.get(i);
  }
};

summary(() => {
  bench("B+Tree Insert", insert);
  bench("qwertie/btree-typescript Insert", bTreeInsert);
});

summary(() => {
  bench("B+Tree Lookup", lookup);
  bench("qwertie/btree-typescript Lookup", bTreeLookup);
});

run();
