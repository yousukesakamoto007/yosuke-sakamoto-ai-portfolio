const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseCsv,
  parseTrades,
  calculateStats,
  pairStats,
  filterTradesByPeriod,
} = require("../analytics-core.js");

test("quoted CSV cells are parsed without splitting commas", () => {
  const rows = parseCsv('date,pair,note\n2026-01-01,USDJPY,"指標後, 押し目"');
  assert.equal(rows[1][2], "指標後, 押し目");
});

test("Japanese headers are accepted and dates are sorted", () => {
  const trades = parseTrades("日付,通貨ペア,損益,手法\n2026/02/01,USDJPY,-2000,逆張り\n2026/01/01,EURJPY,5000,順張り");
  assert.equal(trades.length, 2);
  assert.equal(trades[0].pair, "EURJPY");
  assert.equal(trades[1].profit, -2000);
});

test("required columns are validated", () => {
  assert.throws(() => parseTrades("date,pair\n2026-01-01,USDJPY"), /必須列/);
});

test("profit factor and maximum drawdown are calculated", () => {
  const trades = [100, -40, -80, 60].map((profit, index) => ({
    profit,
    date: new Date(2026, 0, index + 1),
    pair: "USDJPY",
  }));
  const stats = calculateStats(trades);
  assert.equal(stats.total, 40);
  assert.equal(stats.maxDrawdown, -120);
  assert.equal(stats.profitFactor, 160 / 120);
});

test("pair aggregation is ranked by total profit", () => {
  const trades = [
    { pair: "USDJPY", profit: -10 },
    { pair: "EURJPY", profit: 30 },
    { pair: "EURJPY", profit: 20 },
  ];
  const result = pairStats(trades);
  assert.deepEqual(result.map((item) => item.pair), ["EURJPY", "USDJPY"]);
  assert.equal(result[0].count, 2);
});

test("period filter supports cumulative, past, year, and month views", () => {
  const trades = [
    { date: new Date(2025, 11, 1), profit: 10 },
    { date: new Date(2026, 0, 1), profit: 20 },
    { date: new Date(2026, 1, 1), profit: 30 },
  ];
  assert.equal(filterTradesByPeriod(trades, { mode: "all" }).length, 3);
  assert.equal(filterTradesByPeriod(trades, { mode: "past" }).length, 1);
  assert.equal(filterTradesByPeriod(trades, { mode: "year", year: 2026 }).length, 2);
  assert.equal(filterTradesByPeriod(trades, { mode: "month", year: 2026, month: 2 }).length, 1);
});

test("TP, LC, timestamps, and exit reason are parsed for trade review", () => {
  const [trade] = parseTrades(
    "date,pair,profit,entry,exit,tp,lc,entry_time,exit_time,exit_reason\n" +
    "2026-08-01,USDJPY,25000,150.10,150.35,150.60,149.85,09:05,10:22,建値を切り上げて撤退"
  );
  assert.equal(trade.takeProfit, 150.6);
  assert.equal(trade.stopLoss, 149.85);
  assert.equal(trade.entryTime, "09:05");
  assert.equal(trade.exitTime, "10:22");
  assert.equal(trade.exitReason, "建値を切り上げて撤退");
});
