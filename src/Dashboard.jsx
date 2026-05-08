import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";

const monthlyData = [
  { month: "Dec '23", visitors: 420, orders: 8, aov: 148, returns: 1, source: "Instagram" },
  { month: "Jan '24", visitors: 310, orders: 5, aov: 150, returns: 0, source: "Google" },
  { month: "Feb '24", visitors: 380, orders: 7, aov: 152, returns: 1, source: "Instagram" },
  { month: "Mar '24", visitors: 510, orders: 14, aov: 150, returns: 1, source: "Instagram" },
  { month: "Apr '24", visitors: 620, orders: 19, aov: 148, returns: 2, source: "TikTok" },
  { month: "May '24", visitors: 480, orders: 11, aov: 155, returns: 1, source: "Instagram" },
  { month: "Jun '24", visitors: 390, orders: 9, aov: 145, returns: 1, source: "Google" },
  { month: "Jul '24", visitors: 680, orders: 26, aov: 150, returns: 2, source: "Instagram" },
  { month: "Aug '24", visitors: 750, orders: 31, aov: 152, returns: 3, source: "TikTok" },
  { month: "Sep '24", visitors: 560, orders: 18, aov: 148, returns: 1, source: "Instagram" },
  { month: "Oct '24", visitors: 490, orders: 13, aov: 150, returns: 1, source: "Google" },
  { month: "Nov '24", visitors: 700, orders: 28, aov: 153, returns: 2, source: "Instagram" },
  { month: "Dec '24", visitors: 580, orders: 22, aov: 149, returns: 2, source: "Direct" },
];

const COST_PER_UNIT = 110;

const enriched = monthlyData.map(d => ({
  ...d,
  revenue: d.orders * d.aov,
  cogs: d.orders * COST_PER_UNIT,
  profit: d.orders * (d.aov - COST_PER_UNIT),
  convRate: ((d.orders / d.visitors) * 100).toFixed(1),
  returnRate: ((d.returns / d.orders) * 100).toFixed(1),
}));

const totalRevenue = enriched.reduce((s, d) => s + d.revenue, 0);
const totalOrders = enriched.reduce((s, d) => s + d.orders, 0);
const totalProfit = enriched.reduce((s, d) => s + d.profit, 0);
const totalVisitors = enriched.reduce((s, d) => s + d.visitors, 0);
const totalReturns = enriched.reduce((s, d) => s + d.returns, 0);
const avgConv = ((totalOrders / totalVisitors) * 100).toFixed(1);
const avgAOV = (totalRevenue / totalOrders).toFixed(0);
const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

const sourceCount = {};
monthlyData.forEach(d => { sourceCount[d.source] = (sourceCount[d.source] || 0) + 1; });
const sourceData = Object.entries(sourceCount).map(([name, value]) => ({ name, value }));
const SOURCE_COLORS = ["#3b82f6", "#a855f7", "#f59e0b", "#10b981"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15, 15, 20, 0.95)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10,
      padding: "10px 14px",
      backdropFilter: "blur(12px)",
    }}>
      <p style={{ color: "#94a3b8", fontSize: 11, margin: 0, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, margin: "2px 0", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
          {p.name}: {typeof p.value === "number" && p.name !== "Conv %" ? `$${p.value.toLocaleString()}` : p.value}{p.name === "Conv %" ? "%" : ""}
        </p>
      ))}
    </div>
  );
};

function KpiCard({ label, value, sub, color, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(30,32,42,0.9) 0%, rgba(20,22,30,0.95) 100%)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: "22px 20px",
      flex: 1,
      minWidth: 155,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        borderRadius: "16px 16px 0 0",
      }} />
      <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, margin: 0, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      <p style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, margin: "8px 0 4px", fontFamily: "'Space Mono', monospace", letterSpacing: -1 }}>{value}</p>
      {sub && <p style={{ color: "#475569", fontSize: 11, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
    }}>
      <span style={{ color: "#64748b", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #07080d 0%, #0c0e16 40%, #0f1019 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
      padding: 0,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "24px 32px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700, color: "#fff",
            }}>M</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Store Analytics</h1>
              <p style={{ color: "#475569", fontSize: 11, margin: 0, marginTop: 2 }}>Sneaker & Clothing Resale · Dec 2023 – Dec 2024</p>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
          {["overview", "revenue", "traffic"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              textTransform: "capitalize", letterSpacing: 0.3,
              background: activeTab === tab ? "rgba(59,130,246,0.15)" : "transparent",
              color: activeTab === tab ? "#60a5fa" : "#64748b",
              transition: "all 0.2s",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* KPI Row */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <KpiCard label="Revenue" value={`$${totalRevenue.toLocaleString()}`} sub="13 months" color="#3b82f6" delay={0} />
          <KpiCard label="Orders" value={totalOrders} sub={`${totalReturns} returns`} color="#a855f7" delay={80} />
          <KpiCard label="Avg Conv Rate" value={`${avgConv}%`} sub={`${totalVisitors.toLocaleString()} visitors`} color="#10b981" delay={160} />
          <KpiCard label="Gross Profit" value={`$${totalProfit.toLocaleString()}`} sub={`${profitMargin}% margin`} color="#f59e0b" delay={240} />
          <KpiCard label="Avg Order Value" value={`$${avgAOV}`} sub="per transaction" color="#ef4444" delay={320} />
        </div>

        {activeTab === "overview" && (
          <>
            {/* Revenue + Profit Chart */}
            <div style={{
              background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16, padding: "20px 20px 12px", marginBottom: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Revenue vs Gross Profit</h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: 11, marginTop: 3 }}>Monthly breakdown</p>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 11, color: "#3b82f6", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: "#3b82f6", display: "inline-block" }}></span> Revenue
                  </span>
                  <span style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981", display: "inline-block" }}></span> Profit
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={enriched} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4,4,0,0]} />
                  <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Two column: Conversion + Source */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{
                flex: 2, minWidth: 300,
                background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16, padding: "20px 20px 12px",
              }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Conversion Rate Trend</h3>
                <p style={{ margin: 0, color: "#475569", fontSize: 11, marginTop: 3, marginBottom: 16 }}>Orders ÷ Website Visitors</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={enriched}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="convRate" name="Conv %" stroke="#a855f7" strokeWidth={2.5} fill="url(#convGrad)" dot={{ fill: "#a855f7", r: 3, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                flex: 1, minWidth: 220,
                background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16, padding: 20,
              }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Traffic Sources</h3>
                <p style={{ margin: 0, color: "#475569", fontSize: 11, marginTop: 3, marginBottom: 8 }}>Top source by month</p>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value" stroke="none">
                      {sourceData.map((_, i) => <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "rgba(15,15,20,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 4 }}>
                  {sourceData.map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: SOURCE_COLORS[i], display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{s.name}</span>
                      <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "revenue" && (
          <>
            <div style={{
              background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16, padding: "20px 20px 12px", marginBottom: 20,
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={enriched}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly breakdown table */}
            <div style={{
              background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16, padding: 20,
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Breakdown</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Month", "Revenue", "COGS", "Profit", "Margin", "AOV"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {enriched.map((d, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "10px 12px", color: "#94a3b8" }}>{d.month}</td>
                        <td style={{ padding: "10px 12px", color: "#e2e8f0", fontFamily: "'Space Mono', monospace" }}>${d.revenue.toLocaleString()}</td>
                        <td style={{ padding: "10px 12px", color: "#ef4444", fontFamily: "'Space Mono', monospace" }}>${d.cogs.toLocaleString()}</td>
                        <td style={{ padding: "10px 12px", color: "#10b981", fontFamily: "'Space Mono', monospace" }}>${d.profit.toLocaleString()}</td>
                        <td style={{ padding: "10px 12px", color: "#f59e0b", fontFamily: "'Space Mono', monospace" }}>{((d.profit / d.revenue) * 100).toFixed(0)}%</td>
                        <td style={{ padding: "10px 12px", color: "#94a3b8", fontFamily: "'Space Mono', monospace" }}>${d.aov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "traffic" && (
          <>
            <div style={{
              background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16, padding: "20px 20px 12px", marginBottom: 20,
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Visitors</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={enriched}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="visitors" name="Visitors" fill="#6366f1" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{
                flex: 1, minWidth: 260,
                background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16, padding: 20,
              }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Key Traffic Metrics</h3>
                <MiniStat label="Total Visitors" value={totalVisitors.toLocaleString()} />
                <MiniStat label="Avg Monthly Visitors" value={Math.round(totalVisitors / 13).toLocaleString()} />
                <MiniStat label="Best Month" value="Aug '24 (750)" />
                <MiniStat label="Worst Month" value="Jan '24 (310)" />
                <MiniStat label="Overall Conv Rate" value={`${avgConv}%`} />
              </div>

              <div style={{
                flex: 1, minWidth: 260,
                background: "linear-gradient(135deg, rgba(30,32,42,0.7) 0%, rgba(20,22,30,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16, padding: 20,
              }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Source Breakdown</h3>
                {sourceData.sort((a, b) => b.value - a.value).map((s, i) => {
                  const pct = ((s.value / 13) * 100).toFixed(0);
                  return (
                    <div key={s.name} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.name}</span>
                        <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 3, width: `${pct}%`,
                          background: SOURCE_COLORS[i % SOURCE_COLORS.length],
                          transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "32px 0 16px", color: "#334155", fontSize: 11 }}>
          Built by Matteo Conforti · E-Commerce Performance Tracking Dashboard
        </div>
      </div>
    </div>
  );
}
