"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// Country code → flag emoji
function countryFlag(code) {
  if (!code || code === "Unknown") return "🌐";
  return code
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(0x1F1E0 - 65 + c.charCodeAt(0)));
}

// Country code → name
const COUNTRY_NAMES = {
  ID: "Indonesia", SA: "Saudi Arabia", AE: "UAE", US: "USA", GB: "UK",
  MY: "Malaysia", SG: "Singapore", AU: "Australia", DE: "Germany",
  NL: "Netherlands", JP: "Japan", KR: "South Korea", IN: "India",
  QA: "Qatar", KW: "Kuwait", BH: "Bahrain", OM: "Oman",
};

// Mini bar chart
function MiniBar({ value, max, color = "#6B1C2A" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-[#E8E0D6] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// Metric card wrapper
function MetricCard({ icon, title, subtitle, children, accent = "#6B1C2A" }) {
  return (
    <div className="bg-white rounded-sm border border-[#E8E0D6] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0EBE3] flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
          style={{ background: accent }}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#1A1A1A]">{title}</p>
          <p className="text-[10px] text-[#9C9588] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Single ranked list item
function RankRow({ rank, label, value, max, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 text-[10px] text-[#9C9588] font-bold shrink-0">{rank}</span>
      <span className="flex-1 text-xs text-[#1A1A1A] truncate min-w-0">{label}</span>
      <MiniBar value={value} max={max} color={color} />
      <span className="w-8 text-right text-[11px] font-bold text-[#1A1A1A] shrink-0">{value}</span>
    </div>
  );
}

// Simple horizontal bar chart component (pure CSS, no dependencies)
function BarChart({ entries, color, maxItems = 6 }) {
  if (!entries || entries.length === 0) return null;
  const items = entries.slice(0, maxItems);
  const maxVal = items[0]?.[1] || 1;

  return (
    <div className="space-y-2.5 mt-3">
      {items.map(([label, count]) => {
        const pct = Math.max(4, Math.round((count / maxVal) * 100));
        return (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#1A1A1A] truncate">{label}</span>
              <span className="text-[11px] font-bold text-[#1A1A1A] ml-2 shrink-0">{count}</span>
            </div>
            <div className="h-2 bg-[#F0EBE3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function avgSeconds(arr) {
  if (!arr || arr.length === 0) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function formatDuration(sec) {
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

const PAGE_LABELS = {
  "/": "Home",
  "/products": "Collection",
  "/artist": "Artists",
  "/packaging": "Preview & Packaging",
  "/contact": "Contact",
};
function pageLabel(p) { return PAGE_LABELS[p] || p; }

// Helper: aggregate array of objects by a key
function aggregate(arr, key) {
  const map = {};
  arr.forEach((item) => {
    const val = item[key];
    if (!val) return;
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function InsightsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Date range filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Gagal memuat data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 animate-spin text-[#6B1C2A]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p className="text-xs text-[#9C9588]">Memuat data analitik...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-[#9C9588]">{error}</p>
        <p className="text-xs text-[#9C9588]/60">Kunjungi beberapa halaman terlebih dahulu agar data mulai terkumpul.</p>
        <button onClick={load} className="text-xs text-[#6B1C2A] font-semibold hover:underline">
          Coba lagi
        </button>
      </div>
    );
  }

  // ── Compute derived data ────────────────────────────────────────────────
  const totalViews = Object.values(data.pageViews || {}).reduce((a, b) => a + b, 0);
  const totalClicks = Object.values(data.artworkClicks || {}).reduce((a, b) => a + b, 0);

  const topPages = Object.entries(data.pageViews || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxPageViews = topPages[0]?.[1] || 1;

  const topArtworks = Object.entries(data.artworkClicks || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxArtClick = topArtworks[0]?.[1] || 1;

  const topSources = Object.entries(data.trafficSources || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxSource = topSources[0]?.[1] || 1;

  const devices = data.devices || {};
  const totalDevices = Object.values(devices).reduce((a, b) => a + b, 0);

  const topCountries = Object.entries(data.countries || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCountry = topCountries[0]?.[1] || 1;

  const topExit = Object.entries(data.exitPages || {})
    .sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxExit = topExit[0]?.[1] || 1;

  // Avg time per page
  const avgTimes = Object.entries(data.timeOnPage || {})
    .map(([page, arr]) => [page, avgSeconds(arr)])
    .sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxTime = avgTimes[0]?.[1] || 1;

  // Mobile vs Desktop ratio
  const mobileCount = devices["Mobile"] || 0;
  const desktopCount = devices["Desktop"] || 0;
  const mobilePct = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;
  const desktopPct = totalDevices > 0 ? 100 - mobilePct : 0;

  // ── Visitor Insights (from onboarding) ──────────────────────────────────
  const vi = data.visitorInsights || null;
  const allSubmissions = vi ? (vi.submissions || []) : [];

  // Filter submissions by date range
  const filteredSubmissions = allSubmissions.filter((sub) => {
    if (!sub.ts) return true;
    const ts = new Date(sub.ts);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (ts < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (ts > end) return false;
    }
    return true;
  });

  // Compute filtered aggregates
  const viIntents = aggregate(filteredSubmissions, "intent");
  const viCollections = aggregate(filteredSubmissions, "collection");
  const viRoles = aggregate(filteredSubmissions, "role");
  const viAges = aggregate(filteredSubmissions, "ageRange");
  const viCountries = aggregate(filteredSubmissions, "country");

  const isFiltered = startDate || endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A]">Website Insights</h2>
          <p className="text-sm text-[#9C9588] mt-0.5">
            Total <span className="font-semibold text-[#1A1A1A]">{totalViews.toLocaleString()}</span> page views ·{" "}
            <span className="font-semibold text-[#1A1A1A]">{totalClicks.toLocaleString()}</span> artwork clicks
          </p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold tracking-[0.15em] uppercase border border-[#E8E0D6] rounded-sm hover:border-[#6B1C2A] transition-colors disabled:opacity-40"
        >
          <svg className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Page Views", value: totalViews, icon: "👁" },
          { label: "Artwork Clicks", value: totalClicks, icon: "🖼" },
          { label: "Traffic Sources", value: Object.keys(data.trafficSources || {}).length, icon: "📡" },
          { label: "Countries", value: Object.keys(data.countries || {}).length, icon: "🌍" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white border border-[#E8E0D6] rounded-sm p-4 flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
              <p className="text-lg font-bold text-[#1A1A1A]">{value.toLocaleString()}</p>
              <p className="text-[10px] text-[#9C9588] leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* 1. Artwork clicks */}
        <MetricCard
          icon="🖼"
          title="Top Artwork Clicks"
          subtitle="Karya yang paling banyak diklik (Engagement)"
          accent="#6B1C2A"
        >
          {topArtworks.length === 0 ? (
            <p className="text-xs text-[#9C9588]/60 italic">Belum ada data. Klik beberapa karya terlebih dahulu.</p>
          ) : (
            <div className="space-y-3">
              {topArtworks.map(([id, count], i) => (
                <RankRow key={id} rank={i + 1} label={id} value={count} max={maxArtClick} color="#6B1C2A" />
              ))}
            </div>
          )}
        </MetricCard>

        {/* 2. Time on page */}
        <MetricCard
          icon="⏱"
          title="Time On Page"
          subtitle="Rata-rata waktu kunjungan per halaman (Duration)"
          accent="#0D6B4E"
        >
          {avgTimes.length === 0 ? (
            <p className="text-xs text-[#9C9588]/60 italic">Belum ada data waktu kunjungan.</p>
          ) : (
            <div className="space-y-3">
              {avgTimes.map(([page, sec], i) => (
                <RankRow
                  key={page}
                  rank={i + 1}
                  label={pageLabel(page)}
                  value={sec}
                  max={maxTime}
                  color="#0D6B4E"
                />
              ))}
            </div>
          )}
          {avgTimes.length > 0 && (
            <p className="text-[10px] text-[#9C9588] mt-3">
              Nilai dalam detik · Avg overall: {formatDuration(avgSeconds(avgTimes.map(([,v]) => v)))}
            </p>
          )}
        </MetricCard>

        {/* 3. Traffic source */}
        <MetricCard
          icon="📡"
          title="Traffic Source"
          subtitle="Dari mana pengunjung datang (Acquisition)"
          accent="#1A3A6B"
        >
          {topSources.length === 0 ? (
            <p className="text-xs text-[#9C9588]/60 italic">Belum ada data sumber traffic.</p>
          ) : (
            <div className="space-y-3">
              {topSources.map(([src, count], i) => (
                <RankRow key={src} rank={i + 1} label={src} value={count} max={maxSource} color="#1A3A6B" />
              ))}
            </div>
          )}
        </MetricCard>

        {/* 4. Countries */}
        <MetricCard
          icon="🌍"
          title="Lokasi Pengunjung"
          subtitle="Negara/kota asal pengunjung (Demographics)"
          accent="#7C3D0A"
        >
          {topCountries.length === 0 ? (
            <p className="text-xs text-[#9C9588]/60 italic">Belum ada data lokasi.</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([code, count], i) => (
                <RankRow
                  key={code}
                  rank={i + 1}
                  label={`${countryFlag(code)} ${COUNTRY_NAMES[code] || code}`}
                  value={count}
                  max={maxCountry}
                  color="#7C3D0A"
                />
              ))}
            </div>
          )}
        </MetricCard>

        {/* 5. Device */}
        <MetricCard
          icon="📱"
          title="Mobile vs Desktop"
          subtitle="Perangkat yang digunakan pengunjung (Device)"
          accent="#5B3A8E"
        >
          {totalDevices === 0 ? (
            <p className="text-xs text-[#9C9588]/60 italic">Belum ada data perangkat.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-[#1A1A1A]">{mobilePct}%</span>
                  <span className="text-xs text-[#9C9588]">📱 Mobile</span>
                  <span className="text-[10px] font-semibold text-[#5B3A8E]">{mobileCount} visits</span>
                </div>
                <div className="w-px h-12 bg-[#E8E0D6]" />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-[#1A1A1A]">{desktopPct}%</span>
                  <span className="text-xs text-[#9C9588]">🖥 Desktop</span>
                  <span className="text-[10px] font-semibold text-[#1A3A6B]">{desktopCount} visits</span>
                </div>
              </div>
              {/* Visual bar */}
              <div className="h-3 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#5B3A8E] transition-all duration-700" style={{ width: `${mobilePct}%` }} />
                <div className="h-full bg-[#1A3A6B] transition-all duration-700" style={{ flex: 1 }} />
              </div>
              <p className="text-[10px] text-[#9C9588] text-center">
                {mobilePct >= 60
                  ? "💡 Mayoritas pengunjung dari Mobile — pastikan tampilan mobile sudah optimal!"
                  : "💡 Pengunjung lebih banyak dari Desktop"}
              </p>
            </div>
          )}
        </MetricCard>

        {/* 6. Exit page */}
        <MetricCard
          icon="🚪"
          title="Exit Pages"
          subtitle="Halaman terakhir sebelum pengunjung pergi (Exit)"
          accent="#8E3A3A"
        >
          {topExit.length === 0 ? (
            <p className="text-xs text-[#9C9588]/60 italic">Belum ada data exit page.</p>
          ) : (
            <div className="space-y-3">
              {topExit.map(([page, count], i) => (
                <RankRow key={page} rank={i + 1} label={pageLabel(page)} value={count} max={maxExit} color="#8E3A3A" />
              ))}
            </div>
          )}
          {topExit.length > 0 && (
            <p className="text-[10px] text-[#9C9588] mt-3 leading-relaxed">
              💡 Exit yang tinggi di halaman detail karya bisa berarti perlu CTA yang lebih kuat.
            </p>
          )}
        </MetricCard>
      </div>

      {/* Page views full */}
      <MetricCard
        icon="📊"
        title="Page Views"
        subtitle="Halaman yang paling sering dikunjungi"
        accent="#1A1A1A"
      >
        {topPages.length === 0 ? (
          <p className="text-xs text-[#9C9588]/60 italic">Belum ada data page view.</p>
        ) : (
          <div className="space-y-3">
            {topPages.map(([page, count], i) => (
              <RankRow key={page} rank={i + 1} label={pageLabel(page)} value={count} max={maxPageViews} color="#1A1A1A" />
            ))}
          </div>
        )}
      </MetricCard>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* VISITOR INSIGHTS (from onboarding modal)                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {vi && vi.totalOnboarded > 0 && (
        <>
          <div className="pt-6 border-t border-[#E8E0D6] mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#1A1A1A]">Visitor Insights</h2>
                <p className="text-sm text-[#9C9588] mt-0.5">
                  {isFiltered ? (
                    <>Menampilkan <span className="font-semibold text-[#1A1A1A]">{filteredSubmissions.length}</span> dari {vi.totalOnboarded} pengunjung</>
                  ) : (
                    <>Data dari <span className="font-semibold text-[#1A1A1A]">{vi.totalOnboarded.toLocaleString()}</span> pengunjung yang mengisi onboarding</>
                  )}
                </p>
              </div>

              {/* Date filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2 py-1.5 text-xs border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors"
                />
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2 py-1.5 text-xs border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors"
                />
                {isFiltered && (
                  <button
                    onClick={() => { setStartDate(""); setEndDate(""); }}
                    className="text-[10px] uppercase tracking-[0.1em] text-[#6B1C2A] font-semibold hover:underline ml-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Onboarded", value: filteredSubmissions.length, icon: "👤" },
              { label: "Top Intent", value: viIntents[0]?.[0] || "—", icon: "🎯", isText: true },
              { label: "Top Collection", value: viCollections[0]?.[0] || "—", icon: "🖼", isText: true },
              { label: "Top Country", value: viCountries[0]?.[0] || "—", icon: "🌍", isText: true },
            ].map(({ label, value, icon, isText }) => (
              <div key={label} className="bg-white border border-[#E8E0D6] rounded-sm p-4 flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div className="min-w-0">
                  <p className={`font-bold text-[#1A1A1A] ${isText ? "text-xs truncate" : "text-lg"}`}>
                    {isText ? value : value.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#9C9588] leading-tight">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Insight cards grid — with bar charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Visitor Intent */}
            <MetricCard icon="🎯" title="Visitor Intent" subtitle="Alasan pengunjung datang ke gallery" accent="#6B1C2A">
              {viIntents.length === 0 ? (
                <p className="text-xs text-[#9C9588]/60 italic">Belum ada data.</p>
              ) : (
                <BarChart entries={viIntents} color="#6B1C2A" />
              )}
            </MetricCard>

            {/* Collection Preference */}
            <MetricCard icon="🖼" title="Collection Preference" subtitle="Koleksi yang paling diminati pengunjung" accent="#B8976A">
              {viCollections.length === 0 ? (
                <p className="text-xs text-[#9C9588]/60 italic">Belum ada data.</p>
              ) : (
                <BarChart entries={viCollections} color="#B8976A" />
              )}
            </MetricCard>

            {/* Visitor Roles */}
            <MetricCard icon="👤" title="Visitor Roles" subtitle="Profil pengunjung gallery" accent="#1A3A6B">
              {viRoles.length === 0 ? (
                <p className="text-xs text-[#9C9588]/60 italic">Belum ada data.</p>
              ) : (
                <BarChart entries={viRoles} color="#1A3A6B" maxItems={8} />
              )}
            </MetricCard>

            {/* Age Demographics */}
            <MetricCard icon="📊" title="Age Demographics" subtitle="Rentang usia pengunjung gallery" accent="#5B3A8E">
              {viAges.length === 0 ? (
                <p className="text-xs text-[#9C9588]/60 italic">Belum ada data.</p>
              ) : (
                <BarChart entries={viAges} color="#5B3A8E" />
              )}
            </MetricCard>

            {/* Countries (from onboarding) */}
            <MetricCard icon="🌍" title="Visitor Countries" subtitle="Negara asal pengunjung (dari onboarding)" accent="#7C3D0A">
              {viCountries.length === 0 ? (
                <p className="text-xs text-[#9C9588]/60 italic">Belum ada data.</p>
              ) : (
                <BarChart entries={viCountries} color="#7C3D0A" maxItems={8} />
              )}
            </MetricCard>

            {/* Recent Submissions */}
            <MetricCard icon="📝" title="Recent Submissions" subtitle="Pengunjung terakhir yang mengisi onboarding" accent="#0D6B4E">
              {filteredSubmissions.length === 0 ? (
                <p className="text-xs text-[#9C9588]/60 italic">Belum ada data.</p>
              ) : (
                <div className="space-y-3">
                  {filteredSubmissions.slice(0, 10).map((sub, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-[#F0EBE3] last:border-0">
                      <span className="w-5 text-[10px] text-[#9C9588] font-bold shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5">
                          {sub.intent && <span className="text-[10px] px-1.5 py-0.5 bg-[#6B1C2A]/8 text-[#6B1C2A] rounded-sm font-medium">{sub.intent}</span>}
                          {sub.role && <span className="text-[10px] px-1.5 py-0.5 bg-[#1A3A6B]/8 text-[#1A3A6B] rounded-sm font-medium">{sub.role}</span>}
                          {sub.collection && <span className="text-[10px] px-1.5 py-0.5 bg-[#B8976A]/15 text-[#7C3D0A] rounded-sm font-medium">{sub.collection}</span>}
                        </div>
                        <p className="text-[10px] text-[#9C9588] mt-1">
                          {[sub.city, sub.country].filter(Boolean).join(", ") || "—"}
                          {sub.ageRange && ` · ${sub.ageRange}`}
                        </p>
                      </div>
                      <span className="text-[9px] text-[#9C9588]/50 shrink-0">
                        {sub.ts ? new Date(sub.ts).toLocaleDateString() : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </MetricCard>

          </div>
        </>
      )}

      <p className="text-[10px] text-[#9C9588]/50 text-center pb-6">
        Data disimpan di <code className="bg-[#F5F0EB] px-1 py-0.5 rounded text-[9px]">data/analytics.json</code> ·
        Tracking otomatis aktif untuk semua pengunjung
      </p>
    </div>
  );
}
