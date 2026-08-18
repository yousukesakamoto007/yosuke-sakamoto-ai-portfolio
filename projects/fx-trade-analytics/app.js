const sampleCsv = `date,pair,side,entry,exit,lots,pips,profit,strategy,note,tp,sl,entry_time,exit_time,exit_reason,chart_image
2025-01-06,USDJPY,buy,157.12,157.46,1.0,34,34000,London Breakout,NY前の押し目
2025-01-09,EURUSD,sell,1.0322,1.0298,1.0,24,24000,Trend Follow,雇用統計前に利確
2025-01-15,GBPJPY,buy,190.42,189.96,0.8,-46,-36800,Reversal,高値掴み
2025-01-22,AUDJPY,buy,97.18,97.42,1.2,24,28800,London Breakout,東京レンジ上抜け
2025-02-03,USDJPY,sell,154.82,154.21,1.0,61,61000,Trend Follow,日足抵抗帯
2025-02-11,EURJPY,buy,160.12,160.36,0.9,24,21600,Reversal,短期反発
2025-02-19,GBPJPY,sell,191.1,191.58,0.7,-48,-33600,Trend Follow,撤退遅れ
2025-03-05,USDJPY,buy,149.82,150.14,1.1,32,35200,London Breakout,指標後の再上昇
2025-03-13,EURUSD,buy,1.0871,1.0904,1.0,33,33000,Reversal,下げ止まり確認
2025-03-20,AUDJPY,sell,94.65,94.18,1.0,47,47000,Trend Follow,高値切下げ
2025-04-02,GBPJPY,buy,188.74,188.18,0.8,-56,-44800,London Breakout,損切り
2025-04-10,USDJPY,sell,147.9,147.31,1.2,59,70800,Trend Follow,戻り売り
2025-04-21,EURJPY,sell,162.34,161.98,1.0,36,36000,Trend Follow,欧州初動
2025-05-08,AUDJPY,buy,96.02,96.31,1.1,29,31900,Reversal,安値圏反発
2025-05-16,EURUSD,sell,1.1192,1.1224,1.0,-32,-32000,Reversal,想定崩れ
2025-06-04,USDJPY,buy,143.64,144.28,1.0,64,64000,Trend Follow,日足転換
2025-06-13,GBPJPY,sell,194.3,193.82,0.9,48,43200,London Breakout,欧州時間
2025-06-26,EURJPY,buy,168.1,167.72,1.0,-38,-38000,Reversal,早すぎた
2025-07-07,AUDJPY,sell,95.76,95.22,1.0,54,54000,Trend Follow,MA割れ
2025-07-18,USDJPY,sell,146.44,146.02,1.3,42,54600,London Breakout,東京高値否定
2025-08-05,EURUSD,buy,1.152,1.1564,0.9,44,39600,Trend Follow,上昇継続
2025-08-18,GBPJPY,buy,199.4,198.86,0.7,-54,-37800,Reversal,損切り
2025-09-02,USDJPY,buy,148.18,148.72,1.0,54,54000,Trend Follow,押し目
2025-09-11,EURJPY,sell,172.33,171.87,0.8,46,36800,London Breakout,レンジ下抜け
2025-10-03,AUDJPY,buy,98.4,98.14,1.1,-26,-28600,Reversal,想定未達
2025-10-17,USDJPY,sell,151.08,150.36,1.0,72,72000,Trend Follow,日銀関連
2025-11-06,EURUSD,sell,1.141,1.1378,1.0,32,32000,London Breakout,欧州初動
2025-11-20,GBPJPY,sell,202.6,201.98,0.8,62,49600,Trend Follow,高値圏反落
2025-12-04,USDJPY,buy,153.2,152.78,1.0,-42,-42000,Reversal,撤退
2025-12-18,EURJPY,buy,176.4,176.92,0.9,52,46800,Trend Follow,年末薄商い
2026-01-08,USDJPY,sell,156.42,155.98,1.0,44,44000,Trend Follow,戻り売り,155.70,156.75,09:10,11:42,分割利確後の戻りで決済,
2026-02-12,EURUSD,buy,1.0412,1.0386,1.0,-26,-26000,Reversal,想定崩れ,1.0460,1.0386,15:35,17:08,LC到達,
2026-03-06,GBPJPY,sell,193.84,193.22,0.8,62,49600,London Breakout,欧州初動,192.90,194.35,16:05,18:14,目標手前で反発し利確,
2026-04-17,AUDJPY,buy,101.18,101.55,1.0,37,37000,Trend Follow,高値更新,101.80,100.90,09:22,13:40,高値更新後に失速して利確,
2026-05-14,USDJPY,buy,148.62,148.31,1.1,-31,-34100,Reversal,早すぎた,149.20,148.30,10:15,11:02,LC手前で裁量撤退,
2026-06-19,EURJPY,sell,169.74,169.18,0.9,56,50400,Trend Follow,日足抵抗帯,168.90,170.15,15:48,18:05,日足サポート接近で利確,
2026-07-09,GBPJPY,buy,198.1,198.58,0.8,48,38400,London Breakout,レンジ上抜け,199.00,197.70,16:10,19:26,伸び悩みで利確,
2026-08-06,USDJPY,sell,150.88,150.31,1.0,57,57000,Trend Follow,戻り確認,149.90,151.25,09:35,14:12,東京安値前で利確,`;

const state = {
  trades: [],
  filtered: [],
  period: { mode: "all", year: null, month: null },
  activeTrade: null,
};

const {
  parseTrades,
  calculateStats,
  monthlyStats,
  pairStats,
  filterTradesByPeriod,
} = window.FXAnalyticsCore;

const els = {
  csvInput: document.querySelector("#csvInput"),
  loadSampleButton: document.querySelector("#loadSampleButton"),
  resetFiltersButton: document.querySelector("#resetFiltersButton"),
  pairFilter: document.querySelector("#pairFilter"),
  strategyFilter: document.querySelector("#strategyFilter"),
  periodRangeButtons: document.querySelector("#periodRangeButtons"),
  periodDetailButtons: document.querySelector("#periodDetailButtons"),
  periodSummary: document.querySelector("#periodSummary"),
  metricGrid: document.querySelector("#metricGrid"),
  equityCanvas: document.querySelector("#equityCanvas"),
  drawdownCanvas: document.querySelector("#drawdownCanvas"),
  monthlyCanvas: document.querySelector("#monthlyCanvas"),
  pairTable: document.querySelector("#pairTable"),
  tradeTable: document.querySelector("#tradeTable"),
  emptyState: document.querySelector("#emptyState"),
  dataStatus: document.querySelector("#dataStatus"),
  importError: document.querySelector("#importError"),
  tradeDialog: document.querySelector("#tradeDialog"),
  closeTradeDialog: document.querySelector("#closeTradeDialog"),
  tradeDialogTitle: document.querySelector("#tradeDialogTitle"),
  tradeDetailMetrics: document.querySelector("#tradeDetailMetrics"),
  tradeMapCanvas: document.querySelector("#tradeMapCanvas"),
  downloadTradeMap: document.querySelector("#downloadTradeMap"),
  tradeChartInput: document.querySelector("#tradeChartInput"),
  chartImageEmpty: document.querySelector("#chartImageEmpty"),
  tradeChartImage: document.querySelector("#tradeChartImage"),
  tradeDetailNote: document.querySelector("#tradeDetailNote"),
};

function importCsv(text, label) {
  try {
    state.trades = parseTrades(text);
    els.importError.textContent = "";
    els.importError.classList.add("hidden");
    els.dataStatus.textContent = `${label}：${state.trades.length}件を分析中`;
    populateFilters();
    render();
  } catch (error) {
    els.importError.textContent = error.message;
    els.importError.classList.remove("hidden");
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}%`;
}

function formatDate(date) {
  return date
    ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
    : "-";
}

function formatPrice(value) {
  if (!Number.isFinite(value) || value === 0) return "未設定";
  const decimals = Math.abs(value) < 10 ? 5 : 3;
  return value.toLocaleString("ja-JP", { maximumFractionDigits: decimals });
}

function populateFilters() {
  const pairs = [...new Set(state.trades.map((trade) => trade.pair))].sort();
  const strategies = [...new Set(state.trades.map((trade) => trade.strategy))].sort();
  fillSelect(els.pairFilter, pairs, "全通貨ペア");
  fillSelect(els.strategyFilter, strategies, "全手法");
}

function fillSelect(select, values, label) {
  const current = select.value;
  select.innerHTML = "";
  select.append(new Option(label, "all"));
  values.forEach((value) => select.append(new Option(value, value)));
  select.value = values.includes(current) ? current : "all";
}

function applyFilters() {
  const pair = els.pairFilter.value;
  const strategy = els.strategyFilter.value;
  const periodTrades = filterTradesByPeriod(state.trades, state.period);
  state.filtered = periodTrades.filter((trade) => {
    if (pair !== "all" && trade.pair !== pair) return false;
    if (strategy !== "all" && trade.strategy !== strategy) return false;
    return true;
  });
}

function periodLabel() {
  const { mode, year, month } = state.period;
  if (mode === "past") return "2025年以前";
  if (mode === "year") return `${year}年`;
  if (mode === "month") return `${year}年${month}月`;
  return "全期間累計";
}

function renderPeriodControls() {
  const years = [...new Set(state.trades.map((trade) => trade.date.getFullYear()))]
    .sort((a, b) => b - a);
  const recentYears = years.filter((year) => year > 2025);
  const hasPast = years.some((year) => year <= 2025);
  const activeTop = state.period.mode === "all"
    ? "all"
    : state.period.mode === "past" || Number(state.period.year) <= 2025
      ? "past"
      : String(state.period.year);

  const topButtons = [
    { key: "all", label: "累計", mode: "all" },
    ...(hasPast ? [{ key: "past", label: "2025年以前", mode: "past" }] : []),
    ...recentYears.map((year) => ({ key: String(year), label: `${year}年`, mode: "year", year })),
  ];
  els.periodRangeButtons.innerHTML = topButtons.map((item) => (
    `<button type="button" class="period-button ${activeTop === item.key ? "active" : ""}" ` +
    `data-mode="${item.mode}" data-year="${item.year || ""}">${item.label}</button>`
  )).join("");

  const selectedYear = Number(state.period.year);
  if ((state.period.mode === "year" || state.period.mode === "month") && selectedYear) {
    const monthsWithData = new Set(
      state.trades
        .filter((trade) => trade.date.getFullYear() === selectedYear)
        .map((trade) => trade.date.getMonth() + 1)
    );
    const annualActive = state.period.mode === "year";
    els.periodDetailButtons.innerHTML = [
      `<button type="button" class="period-button secondary ${annualActive ? "active" : ""}" data-month="all">年間</button>`,
      ...Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const active = state.period.mode === "month" && Number(state.period.month) === month;
        const disabled = monthsWithData.has(month) ? "" : "disabled";
        return `<button type="button" class="period-button month ${active ? "active" : ""}" data-month="${month}" ${disabled}>${month}月</button>`;
      }),
    ].join("");
    els.periodDetailButtons.classList.remove("hidden");
  } else {
    els.periodDetailButtons.innerHTML = "";
    els.periodDetailButtons.classList.add("hidden");
  }
  els.periodSummary.textContent = `表示期間：${periodLabel()} ／ ${state.filtered.length}件`;
}


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMetrics(stats) {
  const metrics = [
    ["総損益", formatCurrency(stats.total), `${stats.trades} trades`, stats.total],
    ["勝率", formatPercent(stats.winRate), `${stats.wins}勝 / ${stats.losses}敗`, stats.winRate - 50],
    ["最大DD", formatCurrency(stats.maxDrawdown), "ピークからの最大下落", stats.maxDrawdown],
    ["PF", Number.isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : "∞", "総利益 ÷ 総損失", stats.profitFactor - 1],
    ["ペイオフ", stats.payoff ? stats.payoff.toFixed(2) : "-", "平均利益 ÷ 平均損失", stats.payoff - 1],
    ["平均損益", formatCurrency(stats.trades ? stats.total / stats.trades : 0), "1取引あたり", stats.total],
  ];

  els.metricGrid.innerHTML = metrics
    .map(([label, value, note, signal]) => {
      const tone = signal > 0 ? "positive" : signal < 0 ? "negative" : "";
      return `<article class="metric"><span>${label}</span><strong class="${tone}">${value}</strong><small>${note}</small></article>`;
    })
    .join("");
}

function renderTables(trades) {
  els.pairTable.innerHTML = pairStats(trades)
    .map(
      (row) => `<tr>
        <td>${escapeHtml(row.pair)}</td>
        <td>${row.count}</td>
        <td>${formatPercent(row.winRate)}</td>
        <td class="${row.total >= 0 ? "positive" : "negative"}">${formatCurrency(row.total)}</td>
        <td>${Number.isFinite(row.profitFactor) ? row.profitFactor.toFixed(2) : "∞"}</td>
      </tr>`
    )
    .join("");

  els.tradeTable.innerHTML = trades
    .slice()
    .reverse()
    .slice(0, 12)
    .map(
      (trade) => `<tr>
        <td>${formatDate(trade.date)}</td>
        <td>${escapeHtml(trade.pair)}</td>
        <td>${escapeHtml(trade.side || "-")}</td>
        <td class="${trade.profit >= 0 ? "positive" : "negative"}">${formatCurrency(trade.profit)}</td>
        <td>${escapeHtml(trade.strategy)}</td>
        <td><button class="trade-view-button" type="button" data-trade-id="${trade.id}">取引図</button></td>
      </tr>`
    )
    .join("");
}

function safeChartImageUrl(value) {
  if (!value) return "";
  if (value.startsWith("blob:") || value.startsWith("data:image/")) return value;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" || url.origin === window.location.origin ? url.href : "";
  } catch {
    return "";
  }
}

function renderTradeImage(trade) {
  const source = safeChartImageUrl(trade.localChartImage || trade.chartImage);
  els.tradeChartImage.classList.toggle("hidden", !source);
  els.chartImageEmpty.classList.toggle("hidden", Boolean(source));
  if (source) els.tradeChartImage.src = source;
  else els.tradeChartImage.removeAttribute("src");
}

function openTradeDialog(trade) {
  state.activeTrade = trade;
  els.tradeDialogTitle.textContent = `${trade.pair} ${String(trade.side || "").toUpperCase()} / ${formatDate(trade.date)}`;
  const details = [
    ["エントリー", formatPrice(trade.entry), trade.entryTime || "時刻未設定"],
    ["TP", formatPrice(trade.takeProfit), "利確予定"],
    ["LC", formatPrice(trade.stopLoss), "損切予定"],
    ["実決済", formatPrice(trade.exit), trade.exitTime || "時刻未設定"],
    ["決済理由", trade.exitReason || "未設定", trade.profit >= 0 ? "利益確定" : "損失確定"],
    ["損益", formatCurrency(trade.profit), `${trade.pips || 0} pips`],
    ["手法", trade.strategy || "未分類", trade.side || "-"],
    ["ロット", trade.lots || "-", trade.pair],
  ];
  els.tradeDetailMetrics.innerHTML = details.map(([label, value, note]) => (
    `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><span>${escapeHtml(note)}</span></div>`
  )).join("");
  els.tradeDetailNote.textContent = trade.note || "-";
  els.tradeChartInput.value = "";
  renderTradeImage(trade);
  els.tradeDialog.showModal();
  requestAnimationFrame(() => drawTradeMap(els.tradeMapCanvas, trade));
}

function drawTradeMap(canvas, trade) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const pad = { top: 34, right: 92, bottom: 48, left: 82 };
  const rawLevels = [trade.entry, trade.exit, trade.takeProfit, trade.stopLoss].filter((value) => Number.isFinite(value) && value !== 0);
  if (!rawLevels.length) return;
  let min = Math.min(...rawLevels);
  let max = Math.max(...rawLevels);
  const margin = (max - min || Math.max(Math.abs(max) * 0.002, 0.001)) * 0.22;
  min -= margin;
  max += margin;
  const y = (value) => pad.top + ((max - value) / (max - min)) * (height - pad.top - pad.bottom);
  const xEntry = pad.left + (width - pad.left - pad.right) * 0.16;
  const xExit = pad.left + (width - pad.left - pad.right) * 0.82;

  ctx.fillStyle = "#fbfcfc";
  ctx.fillRect(0, 0, width, height);
  ctx.font = "12px Segoe UI, Meiryo, sans-serif";
  for (let index = 0; index <= 5; index += 1) {
    const value = min + ((max - min) / 5) * index;
    const py = y(value);
    ctx.strokeStyle = "#e5ebee";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, py);
    ctx.lineTo(width - pad.right, py);
    ctx.stroke();
    ctx.fillStyle = "#65727d";
    ctx.textAlign = "right";
    ctx.fillText(formatPrice(value), pad.left - 10, py + 4);
  }

  const levels = [
    ["TP", trade.takeProfit, "#147653"],
    ["ENTRY", trade.entry, "#2f5f9f"],
    ["LC", trade.stopLoss, "#b1443f"],
  ].filter(([, value]) => Number.isFinite(value) && value !== 0);
  levels.forEach(([label, value, color]) => {
    const py = y(value);
    ctx.save();
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = color;
    ctx.lineWidth = label === "ENTRY" ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, py);
    ctx.lineTo(width - pad.right, py);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.font = "700 12px Segoe UI, Meiryo, sans-serif";
    ctx.fillText(`${label}  ${formatPrice(value)}`, width - pad.right + 8, py + 4);
  });

  if (trade.entry && trade.exit) {
    const yEntry = y(trade.entry);
    const yExit = y(trade.exit);
    ctx.strokeStyle = trade.profit >= 0 ? "#147653" : "#b1443f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xEntry, yEntry);
    ctx.bezierCurveTo((xEntry + xExit) / 2, yEntry, (xEntry + xExit) / 2, yExit, xExit, yExit);
    ctx.stroke();
    [[xEntry, yEntry, "ENTRY"], [xExit, yExit, "EXIT"]].forEach(([x, py, label]) => {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = label === "ENTRY" ? "#2f5f9f" : trade.profit >= 0 ? "#147653" : "#b1443f";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#172026";
      ctx.textAlign = "center";
      ctx.font = "700 12px Segoe UI, Meiryo, sans-serif";
      ctx.fillText(label, x, py - 16);
    });
    ctx.fillStyle = "#65727d";
    ctx.textAlign = "center";
    ctx.font = "12px Segoe UI, Meiryo, sans-serif";
    ctx.fillText(trade.entryTime || "エントリー", xEntry, height - 18);
    ctx.fillText(trade.exitTime || "決済", xExit, height - 18);
  }
}

function drawLineChart(canvas, points, options) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const pad = { top: 20, right: 22, bottom: 34, left: 68 };
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (!points.length) return;

  const values = points.map((point) => point.value);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = max - min || 1;
  const x = (index) => pad.left + (index / Math.max(points.length - 1, 1)) * (width - pad.left - pad.right);
  const y = (value) => pad.top + ((max - value) / range) * (height - pad.top - pad.bottom);

  drawGrid(ctx, width, height, pad, min, max, y);

  ctx.beginPath();
  points.forEach((point, index) => {
    const px = x(index);
    const py = y(point.value);
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = options.color;
  ctx.stroke();

  ctx.strokeStyle = "#9aa8b2";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, y(0));
  ctx.lineTo(width - pad.right, y(0));
  ctx.stroke();

  ctx.fillStyle = "#65727d";
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(points[0].label, pad.left, height - 10);
  ctx.textAlign = "right";
  ctx.fillText(points.at(-1).label, width - pad.right, height - 10);
}

function drawBarChart(canvas, bars) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const pad = { top: 20, right: 22, bottom: 42, left: 68 };
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  if (!bars.length) return;

  const values = bars.map((bar) => bar.value);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = max - min || 1;
  const chartWidth = width - pad.left - pad.right;
  const barWidth = Math.max(8, chartWidth / bars.length - 8);
  const y = (value) => pad.top + ((max - value) / range) * (height - pad.top - pad.bottom);
  drawGrid(ctx, width, height, pad, min, max, y);

  bars.forEach((bar, index) => {
    const x = pad.left + index * (chartWidth / bars.length) + 4;
    const y0 = y(0);
    const yValue = y(bar.value);
    ctx.fillStyle = bar.value >= 0 ? "#147653" : "#b1443f";
    ctx.fillRect(x, Math.min(y0, yValue), barWidth, Math.max(2, Math.abs(y0 - yValue)));
  });

  ctx.fillStyle = "#65727d";
  ctx.font = "12px Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(bars[0].label, pad.left, height - 12);
  ctx.textAlign = "right";
  ctx.fillText(bars.at(-1).label, width - pad.right, height - 12);
}

function drawGrid(ctx, width, height, pad, min, max, y) {
  ctx.strokeStyle = "#edf1f3";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#65727d";
  ctx.font = "11px Segoe UI, sans-serif";
  ctx.textAlign = "right";

  for (let i = 0; i <= 4; i += 1) {
    const value = min + ((max - min) / 4) * i;
    const py = y(value);
    ctx.beginPath();
    ctx.moveTo(pad.left, py);
    ctx.lineTo(width - pad.right, py);
    ctx.stroke();
    ctx.fillText(formatCurrency(value), pad.left - 8, py + 4);
  }
}

function renderCharts(stats, trades) {
  const equityPoints = stats.series.map((point) => ({
    label: formatDate(point.date),
    value: point.equity,
  }));
  const drawdownPoints = stats.series.map((point) => ({
    label: formatDate(point.date),
    value: point.drawdown,
  }));
  const monthlyPoints = monthlyStats(trades);

  drawLineChart(els.equityCanvas, equityPoints, { color: "#2f5f9f" });
  drawLineChart(els.drawdownCanvas, drawdownPoints, { color: "#b1443f" });
  drawBarChart(els.monthlyCanvas, monthlyPoints);
}

function render() {
  applyFilters();
  renderPeriodControls();
  const hasTrades = state.filtered.length > 0;
  els.emptyState.classList.toggle("hidden", state.trades.length > 0);

  const stats = calculateStats(state.filtered);
  renderMetrics(stats);
  renderCharts(stats, state.filtered);
  renderTables(state.filtered);

  document.body.classList.toggle("has-data", hasTrades);
}

function resetFilters() {
  els.pairFilter.value = "all";
  els.strategyFilter.value = "all";
  state.period = { mode: "all", year: null, month: null };
  render();
}

els.loadSampleButton.addEventListener("click", () => {
  importCsv(sampleCsv, "サンプルデータ");
});

els.csvInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    els.importError.textContent = "CSVは5MB以下のファイルを選択してください。";
    els.importError.classList.remove("hidden");
    return;
  }
  const text = await file.text();
  importCsv(text, file.name);
});

[els.pairFilter, els.strategyFilter].forEach((select) => {
  select.addEventListener("change", render);
});

els.periodRangeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mode]");
  if (!button) return;
  const mode = button.dataset.mode;
  state.period = mode === "year"
    ? { mode: "year", year: Number(button.dataset.year), month: null }
    : { mode, year: null, month: null };
  render();
});

els.periodDetailButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-month]");
  if (!button || button.disabled) return;
  const year = Number(state.period.year);
  state.period = button.dataset.month === "all"
    ? { mode: "year", year, month: null }
    : { mode: "month", year, month: Number(button.dataset.month) };
  render();
});

els.resetFiltersButton.addEventListener("click", resetFilters);

els.tradeTable.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-trade-id]");
  if (!button) return;
  const trade = state.trades.find((item) => item.id === Number(button.dataset.tradeId));
  if (trade) openTradeDialog(trade);
});

els.closeTradeDialog.addEventListener("click", () => els.tradeDialog.close());

els.tradeDialog.addEventListener("click", (event) => {
  if (event.target === els.tradeDialog) els.tradeDialog.close();
});

els.tradeChartInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file || !state.activeTrade) return;
  if (file.size > 8 * 1024 * 1024) {
    window.alert("チャート画像は8MB以下にしてください。");
    event.target.value = "";
    return;
  }
  if (state.activeTrade.localChartImage?.startsWith("blob:")) {
    URL.revokeObjectURL(state.activeTrade.localChartImage);
  }
  state.activeTrade.localChartImage = URL.createObjectURL(file);
  renderTradeImage(state.activeTrade);
});

els.downloadTradeMap.addEventListener("click", () => {
  if (!state.activeTrade) return;
  const link = document.createElement("a");
  link.download = `${state.activeTrade.dateLabel || "trade"}_${state.activeTrade.pair}_review.png`;
  link.href = els.tradeMapCanvas.toDataURL("image/png");
  link.click();
});

window.addEventListener("resize", () => {
  renderCharts(calculateStats(state.filtered), state.filtered);
  if (els.tradeDialog.open && state.activeTrade) drawTradeMap(els.tradeMapCanvas, state.activeTrade);
});

importCsv(sampleCsv, "サンプルデータ");
