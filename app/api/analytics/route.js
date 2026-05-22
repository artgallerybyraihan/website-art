import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");

const EMPTY = () => ({
  pageViews: {},
  artworkClicks: {},
  trafficSources: {},
  devices: {},
  countries: {},
  exitPages: {},
  timeOnPage: {},
  events: [],
});

// Simple in-memory write lock to avoid race conditions
let writeLock = Promise.resolve();

async function loadData() {
  try {
    const raw = await readFile(ANALYTICS_FILE, "utf8");
    if (!raw || !raw.trim()) return EMPTY();
    return JSON.parse(raw);
  } catch {
    return EMPTY();
  }
}

async function saveData(data) {
  await mkdir(DATA_DIR, { recursive: true });
  const json = JSON.stringify(data, null, 2);
  // Write to temp file first, then rename to avoid partial writes
  const tmp = ANALYTICS_FILE + ".tmp";
  await writeFile(tmp, json, "utf8");
  const { rename } = await import("fs/promises");
  await rename(tmp, ANALYTICS_FILE);
}

// POST — record event
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, payload } = body;
    const now = new Date().toISOString();

    // Serialize writes using the lock chain
    writeLock = writeLock.then(async () => {
      const data = await loadData();

      if (type === "pageview") {
        const page = payload.page || "/";
        data.pageViews[page] = (data.pageViews[page] || 0) + 1;

        const ref = payload.referrer || "";
        let source = "direct";
        if (ref.includes("instagram")) source = "Instagram";
        else if (ref.includes("facebook")) source = "Facebook";
        else if (ref.includes("google")) source = "Google";
        else if (ref.includes("linkedin")) source = "LinkedIn";
        else if (ref.includes("whatsapp")) source = "WhatsApp";
        else if (ref) { try { source = new URL(ref).hostname; } catch { source = ref; } }
        data.trafficSources[source] = (data.trafficSources[source] || 0) + 1;

        const ua = payload.userAgent || "";
        const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
        const device = isMobile ? "Mobile" : "Desktop";
        data.devices[device] = (data.devices[device] || 0) + 1;

        const country = payload.country || "";
        if (country && country !== "Unknown") {
          data.countries[country] = (data.countries[country] || 0) + 1;
        }
      }

      if (type === "artwork_click") {
        const id = payload.artworkId;
        if (id) data.artworkClicks[id] = (data.artworkClicks[id] || 0) + 1;
      }

      if (type === "time_on_page") {
        const page = payload.page || "/";
        const seconds = Number(payload.seconds) || 0;
        if (!data.timeOnPage[page]) data.timeOnPage[page] = [];
        data.timeOnPage[page].push(seconds);
        if (data.timeOnPage[page].length > 100) data.timeOnPage[page] = data.timeOnPage[page].slice(-100);
      }

      if (type === "exit_page") {
        const page = payload.page || "/";
        data.exitPages[page] = (data.exitPages[page] || 0) + 1;
      }

      data.events.unshift({ type, payload, ts: now });
      if (data.events.length > 200) data.events = data.events.slice(0, 200);

      await saveData(data);
    }).catch(() => {}); // swallow lock errors silently

    await writeLock;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// GET — read analytics (admin only, no auth for simplicity — just don't publicize the URL)
export async function GET() {
  const data = await loadData();
  return NextResponse.json(data);
}
