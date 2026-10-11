const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const metricIds = ["newCount", "otherCount", "experiencedCount", "appliedCount", "heldCount", "rejectedCount"];

function setup() {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      value: "all", checked: false, textContent: "", innerHTML: "", style: {},
      listeners: new Map(), opened: false,
      addEventListener(type, callback) { this.listeners.set(type, callback); },
      showModal() { this.opened = true; }, close() { this.opened = false; },
    });
    return nodes.get(id);
  };
  node("#keyword").value = "";
  node("#hideReposted").checked = true;
  let networkCalls = 0;
  const forbiddenNetwork = () => { networkCalls++; throw new Error("Demo attempted an external request"); };
  const context = vm.createContext({
    document: { querySelector: node, getElementById: id => node(`#${id}`) },
    fetch: forbiddenNetwork, XMLHttpRequest: forbiddenNetwork, WebSocket: forbiddenNetwork,
    navigator: { sendBeacon: forbiddenNetwork },
  });
  vm.runInContext(script, context);
  const metrics = () => metricIds.map(id => Number(node(`#${id}`).textContent));
  const total = () => metrics().reduce((sum, count) => sum + count, 0);
  const click = (kind, id) => node("#groups").listeners.get("click")({
    target: { closest: selector => selector === `[data-${kind}]` ? { dataset: { [kind]: String(id) } } : null },
  });
  return { node, metrics, total, click, networkCalls: () => networkCalls };
}

test("initial tallies classify all seven artificial jobs without overlap", () => {
  const demo = setup();
  assert.deepEqual(demo.metrics(), [2, 1, 1, 0, 2, 1]);
  assert.equal(demo.total(), 7);
  assert.equal(demo.node("#visibleCount").textContent, "表示 6件"); // Reposted is hidden initially.
});

test("marking matched and held jobs transfers counts into applied, without double counting", () => {
  const demo = setup();
  demo.click("applied", 1);
  assert.deepEqual(demo.metrics(), [1, 1, 1, 1, 2, 1]);
  assert.equal(demo.total(), 7);
  demo.click("applied", 5);
  assert.deepEqual(demo.metrics(), [1, 1, 1, 2, 1, 1]);
  assert.equal(demo.total(), 7);
});

test("unmarking jobs restores their original classification", () => {
  const demo = setup();
  demo.click("applied", 1); demo.click("applied", 5);
  demo.click("applied", 1); demo.click("applied", 5);
  assert.deepEqual(demo.metrics(), [2, 1, 1, 0, 2, 1]);
  assert.equal(demo.total(), 7);
});

test("keyword filtering changes visible count while overview still represents all seven jobs", () => {
  const demo = setup();
  demo.node("#keyword").value = "Python";
  demo.node("#keyword").listeners.get("input")();
  assert.equal(demo.node("#visibleCount").textContent, "表示 1件");
  assert.deepEqual(demo.metrics(), [2, 1, 1, 0, 2, 1]);
  demo.node("#keyword").value = "見つからない架空キーワード";
  demo.node("#keyword").listeners.get("input")();
  assert.equal(demo.node("#visibleCount").textContent, "表示 0件");
  assert.equal(demo.node("#empty").style.display, "block");
  assert.equal(demo.total(), 7);
  demo.node("#reset").listeners.get("click")();
  assert.equal(demo.node("#visibleCount").textContent, "表示 6件");
  assert.equal(demo.total(), 7);
});

test("prepare and applied actions stay local; reloading starts with no applied marks", () => {
  const demo = setup();
  demo.click("prepare", 1);
  assert.equal(demo.node("#prepareDialog").opened, true);
  assert.match(demo.node("#prepareJob").textContent, /匿名サンプル企業A/);
  demo.node("#closeDialog").listeners.get("click")();
  assert.equal(demo.node("#prepareDialog").opened, false);
  demo.click("applied", 1);
  assert.equal(demo.metrics()[3], 1);
  assert.equal(demo.networkCalls(), 0);
  assert.equal(setup().metrics()[3], 0);
});
