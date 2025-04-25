import Benchmark from "benchmark";
import { BPTree } from "./bptree.js";
const suite = new Benchmark.Suite();

const bpTree = new BPTree();
suite
  .add("B+Tree Insert", () => {
    for (let i = 0; i < 1000; i++) {
      bpTree.insert(i, i * 10);
    }
  })
  .add("B+Tree Lookup", () => {
    for (let i = 0; i < 1000; i++) {
      bpTree.lookup(i);
    }
  })
  .on("cycle", (event: Benchmark.Event) => {
    console.log(String(event.target));
  })
  .run();
