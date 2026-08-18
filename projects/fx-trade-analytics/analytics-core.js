(function exposeAnalyticsCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.FXAnalyticsCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createAnalyticsCore() {
  const aliases = {
    date: ["date", "日時", "日付", "open time", "close time", "決済日時", "約定日時"],
    pair: ["pair", "symbol", "通貨", "通貨ペア", "銘柄"],
    side: ["side", "type", "売買", "方向", "注文種別"],
    entry: ["entry", "open", "建値", "エントリー", "open price"],
    exit: ["exit", "close", "決済値", "イグジット", "close price"],
    entryTime: ["entry_time", "open time", "エントリー時刻", "注文時刻"],
    exitTime: ["exit_time", "close time", "決済時刻", "約定時刻"],
    takeProfit: ["tp", "take_profit", "take profit", "利確", "利確価格"],
    stopLoss: ["sl", "lc", "stop_loss", "stop loss", "損切", "損切り", "損切価格"],
    exitReason: ["exit_reason", "close_reason", "決済理由", "退出理由"],
    chartImage: ["chart_image", "image", "screenshot", "チャート画像", "画像url"],
    lots: ["lots", "lot", "数量", "ロット"],
    pips: ["pips", "pip", "獲得pips", "損益pips"],
    profit: ["profit", "pl", "p/l", "損益", "実現損益", "損益額", "profit/loss"],
    strategy: ["strategy", "setup", "手法", "戦略", "ルール"],
    note: ["note", "comment", "memo", "メモ", "コメント"],
  };

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"' && quoted && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(cell);
        if (row.some((value) => value.trim())) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    if (row.some((value) => value.trim())) rows.push(row);
    return rows;
  }

  function normalizeHeader(value) {
    return String(value || "").trim().toLowerCase();
  }

  function findIndex(headers, keys) {
    const normalized = headers.map(normalizeHeader);
    return keys.reduce((found, key) => {
      if (found !== -1) return found;
      return normalized.indexOf(normalizeHeader(key));
    }, -1);
  }

  function toNumber(value) {
    const cleaned = String(value || "")
      .replace(/[¥円,\s]/g, "")
      .replace(/[＋]/g, "+")
      .replace(/[－]/g, "-");
    const number = Number(cleaned);
    return Number.isFinite(number) ? number : 0;
  }

  function parseDate(value) {
    const normalized = String(value || "").replace(/[./]/g, "-");
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function parseTrades(text) {
    const rows = parseCsv(text);
    if (rows.length < 2) throw new Error("見出し行と1件以上の取引データが必要です。");

    const headers = rows[0];
    const index = Object.fromEntries(
      Object.entries(aliases).map(([field, keys]) => [field, findIndex(headers, keys)])
    );
    const missing = ["date", "pair", "profit"].filter((field) => index[field] === -1);
    if (missing.length) {
      throw new Error("必須列 date（日付）・pair（通貨ペア）・profit（損益）を確認してください。");
    }

    const trades = rows
      .slice(1)
      .map((row, rowIndex) => ({
        id: rowIndex + 1,
        date: parseDate(row[index.date]),
        dateLabel: row[index.date] || "",
        pair: String(row[index.pair] || "").trim(),
        side: index.side >= 0 ? row[index.side] || "" : "",
        entry: index.entry >= 0 ? toNumber(row[index.entry]) : 0,
        exit: index.exit >= 0 ? toNumber(row[index.exit]) : 0,
        entryTime: index.entryTime >= 0 ? String(row[index.entryTime] || "").trim() : "",
        exitTime: index.exitTime >= 0 ? String(row[index.exitTime] || "").trim() : "",
        takeProfit: index.takeProfit >= 0 ? toNumber(row[index.takeProfit]) : 0,
        stopLoss: index.stopLoss >= 0 ? toNumber(row[index.stopLoss]) : 0,
        exitReason: index.exitReason >= 0 ? String(row[index.exitReason] || "").trim() : "",
        chartImage: index.chartImage >= 0 ? String(row[index.chartImage] || "").trim() : "",
        lots: index.lots >= 0 ? toNumber(row[index.lots]) : 0,
        pips: index.pips >= 0 ? toNumber(row[index.pips]) : 0,
        profit: toNumber(row[index.profit]),
        strategy: index.strategy >= 0 ? row[index.strategy] || "未分類" : "未分類",
        note: index.note >= 0 ? row[index.note] || "" : "",
      }))
      .filter((trade) => trade.date && trade.pair)
      .sort((a, b) => a.date - b.date);

    if (!trades.length) throw new Error("読み込める取引データがありませんでした。");
    return trades;
  }

  function buildEquitySeries(trades) {
    let equity = 0;
    let peak = 0;
    let maxDrawdown = 0;
    const series = trades.map((trade) => {
      equity += trade.profit;
      peak = Math.max(peak, equity);
      const drawdown = equity - peak;
      maxDrawdown = Math.min(maxDrawdown, drawdown);
      return { date: trade.date, equity, drawdown, profit: trade.profit };
    });
    return { series, maxDrawdown };
  }

  function calculateStats(trades) {
    const total = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const wins = trades.filter((trade) => trade.profit > 0);
    const losses = trades.filter((trade) => trade.profit < 0);
    const grossProfit = wins.reduce((sum, trade) => sum + trade.profit, 0);
    const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.profit, 0));
    const averageWin = wins.length ? grossProfit / wins.length : 0;
    const averageLoss = losses.length ? grossLoss / losses.length : 0;
    const { maxDrawdown, series } = buildEquitySeries(trades);
    return {
      total,
      trades: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length ? (wins.length / trades.length) * 100 : 0,
      payoff: averageLoss ? averageWin / averageLoss : 0,
      profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit ? Infinity : 0,
      maxDrawdown,
      series,
    };
  }

  function monthlyStats(trades) {
    const groups = new Map();
    trades.forEach((trade) => {
      const key = `${trade.date.getFullYear()}-${String(trade.date.getMonth() + 1).padStart(2, "0")}`;
      groups.set(key, (groups.get(key) || 0) + trade.profit);
    });
    return [...groups.entries()].map(([label, value]) => ({ label, value }));
  }

  function pairStats(trades) {
    const groups = new Map();
    trades.forEach((trade) => {
      const group = groups.get(trade.pair) || {
        pair: trade.pair,
        count: 0,
        total: 0,
        wins: 0,
        grossProfit: 0,
        grossLoss: 0,
      };
      group.count += 1;
      group.total += trade.profit;
      if (trade.profit > 0) {
        group.wins += 1;
        group.grossProfit += trade.profit;
      } else if (trade.profit < 0) {
        group.grossLoss += Math.abs(trade.profit);
      }
      groups.set(trade.pair, group);
    });
    return [...groups.values()]
      .map((group) => ({
        pair: group.pair,
        count: group.count,
        winRate: group.count ? (group.wins / group.count) * 100 : 0,
        total: group.total,
        profitFactor: group.grossLoss ? group.grossProfit / group.grossLoss : group.grossProfit ? Infinity : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }

  function filterTradesByPeriod(trades, selection) {
    const { mode = "all", year = null, month = null } = selection || {};
    if (mode === "past") {
      return trades.filter((trade) => trade.date.getFullYear() <= 2025);
    }
    if (mode === "year" || mode === "month") {
      return trades.filter((trade) => {
        if (trade.date.getFullYear() !== Number(year)) return false;
        return mode !== "month" || trade.date.getMonth() + 1 === Number(month);
      });
    }
    return trades;
  }

  return {
    parseCsv,
    parseTrades,
    calculateStats,
    buildEquitySeries,
    monthlyStats,
    pairStats,
    filterTradesByPeriod,
  };
});
