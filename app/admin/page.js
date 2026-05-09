"use client";
import { useState, useRef } from "react";
import Image from "next/image";

// ── Options ─────────────────────────────────────────────────────────────────
const MEDIUM_OPTIONS    = ["Acrylic on Canvas", "Oil on Canvas"];
const CATEGORY_OPTIONS  = [{ value:"calligraphy", label:"Kaligrafi (Calligraphy)" }, { value:"landscape", label:"Landscape" }];
const ARTIST_OPTIONS    = ["Raihan Mohammad", "Condro Puspitosari"];
const STATUS_OPTIONS    = [{ value:"available", label:"Available" }, { value:"collected", label:"Collected" }];
const FRAME_OPTIONS     = ["Not Framed", "Framed"];
const HANG_OPTIONS      = ["No", "Yes"];
const AUTH_OPTIONS      = ["Certificate is Included", "No Certificate"];
const ORIGIN_OPTIONS    = ["Indonesia", "Java", "Brebes, Jawa Tengah"];

// ── Helpers ──────────────────────────────────────────────────────────────────
function Select({ label, value, onChange, options, required }) {
  return (
    <div>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1.5">
          {label}{required && <span className="text-[#6B1C2A] ml-0.5">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors appearance-none cursor-pointer"
      >
        {options.map(o => (
          <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value}>
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, required, type = "text" }) {
  return (
    <div>
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1.5">
          {label}{required && <span className="text-[#6B1C2A] ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors"
      />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-sm border border-[#E8E0D6] p-6 space-y-5">
      <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-[#9C9588]">{title}</h3>
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed]     = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError]   = useState("");

  // artwork form
  const [files, setFiles]     = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const fileRef = useRef(null);

  // artist photo
  const [artistPhotoFile, setArtistPhotoFile]       = useState(null);
  const [artistPhotoPreview, setArtistPhotoPreview] = useState(null);
  const [artistKey, setArtistKey]   = useState("condro");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult, setPhotoResult]   = useState(null);

  const [form, setForm] = useState({
    title:"", category:"calligraphy", artist:"Raihan Mohammad",
    medium:"Acrylic on Canvas", sizeW:"", sizeH:"", sizeD:"",
    year: String(new Date().getFullYear()), status:"available",
    frame:"Not Framed", readyToHang:"No",
    authenticity:"Certificate is Included",
    packaging:"", handling:"", shipsFrom:"Indonesia",
    description:"", longDescription:"",
  });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ background:"linear-gradient(135deg,#FAFAF8,#F0EBE3)" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex flex-col items-center gap-1 mb-6">
              <span className="text-xs font-bold tracking-[0.35em] uppercase text-[#1A1A1A]">Artgallery</span>
              <span className="text-[9px] tracking-[0.3em] uppercase font-semibold text-[#6B1C2A]">by Raihan</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Admin Panel</h1>
            <p className="text-xs text-[#9C9588] mt-2">Upload dan kelola karya seni</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (password.length >= 4) { setAuthed(true); setPwError(""); } else setPwError("Password tidak valid."); }} className="space-y-4">
            <Input label="Password" value={password} onChange={setPassword} placeholder="Masukkan password" type="password" />
            {pwError && <p className="text-xs text-red-500">{pwError}</p>}
            <button type="submit" className="w-full py-3.5 bg-[#1A1A1A] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-[#6B1C2A] transition-colors">
              Masuk
            </button>
          </form>
          <p className="text-[10px] text-[#9C9588]/50 text-center mt-8">Hanya pemilik yang bisa mengakses halaman ini</p>
        </div>
      </div>
    );
  }

  // ── Artist Photo Upload ───────────────────────────────────────────────────
  const handleArtistPhoto = async e => {
    e.preventDefault();
    if (!artistPhotoFile) { setPhotoResult({ error:"Pilih foto terlebih dahulu." }); return; }
    setPhotoLoading(true); setPhotoResult(null);
    const fd = new FormData();
    fd.append("password", password);
    fd.append("artistKey", artistKey);
    fd.append("file", artistPhotoFile);
    try {
      const res  = await fetch("/api/admin/artist-photo", { method:"POST", body:fd });
      const data = await res.json();
      setPhotoResult(data);
      if (data.success) { setArtistPhotoFile(null); setArtistPhotoPreview(null); }
    } catch { setPhotoResult({ error:"Koneksi gagal." }); }
    finally { setPhotoLoading(false); }
  };

  // ── Artwork Submit ────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault();
    if (!files.length) { setResult({ error:"Tambahkan minimal 1 foto karya." }); return; }
    setLoading(true); setResult(null);
    const fd = new FormData();
    fd.append("password", password);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach(f => fd.append("files", f));
    try {
      const res  = await fetch("/api/admin/upload", { method:"POST", body:fd });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        setForm({ title:"", category:"calligraphy", artist:"Raihan Mohammad", medium:"Acrylic on Canvas",
          sizeW:"", sizeH:"", sizeD:"", year:String(new Date().getFullYear()), status:"available",
          frame:"Not Framed", readyToHang:"No", authenticity:"Certificate is Included",
          packaging:"", handling:"", shipsFrom:"Indonesia", description:"", longDescription:"" });
        setFiles([]); setPreviews([]);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch { setResult({ error:"Koneksi gagal. Pastikan dev server berjalan." }); }
    finally { setLoading(false); }
  };

  const addFiles = sel => {
    const arr = Array.from(sel);
    setFiles(prev => [...prev, ...arr]);
    setPreviews(prev => [...prev, ...arr.map(f => URL.createObjectURL(f))]);
    setResult(null);
  };
  const removeFile = i => { setFiles(p => p.filter((_,j) => j!==i)); setPreviews(p => p.filter((_,j) => j!==i)); };

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background:"#F5F0EB" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#1A1A1A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#6B1C2A]" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-white">Admin Panel</span>
          <span className="text-[10px] text-white/30">Artgallery by Raihan</span>
        </div>
        <button onClick={() => { setAuthed(false); setPassword(""); }}
          className="text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors">
          Keluar
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* ── SECTION: Foto Artis ─────────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Foto Profil Artis</h2>
          <p className="text-sm text-[#9C9588] mb-5">Ganti foto Raihan atau Ibu Condro yang tampil di website.</p>
          <Card title="Upload Foto Artis">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Select label="Pilih Artis" value={artistKey} onChange={setArtistKey}
                options={[{ value:"raihan", label:"Raihan Mohammad" }, { value:"condro", label:"Condro Puspitosari (Ibu)" }]} />
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1.5">Foto Baru</label>
                <label className="flex items-center gap-3 px-4 py-3 border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] cursor-pointer hover:border-[#6B1C2A] transition-colors">
                  <svg className="w-4 h-4 text-[#9C9588]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                  </svg>
                  <span className="text-sm text-[#9C9588]">{artistPhotoFile ? artistPhotoFile.name : "Pilih foto..."}</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files[0]; if (f) { setArtistPhotoFile(f); setArtistPhotoPreview(URL.createObjectURL(f)); setPhotoResult(null); } }} />
                </label>
              </div>
            </div>
            {artistPhotoPreview && (
              <div className="flex items-center gap-4 mt-2">
                <img src={artistPhotoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-sm border border-[#E8E0D6]" />
                <div>
                  <p className="text-xs text-[#9C9588]">Preview foto baru</p>
                  <p className="text-[10px] text-[#9C9588]/60 mt-0.5">Akan menggantikan foto {artistKey === "condro" ? "Ibu Condro" : "Raihan"} di website</p>
                </div>
              </div>
            )}
            {photoResult && (
              <div className={`p-3 rounded-sm text-sm ${photoResult.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {photoResult.success ? `✓ ${photoResult.message}` : `✗ ${photoResult.error}`}
              </div>
            )}
            <button onClick={handleArtistPhoto} disabled={photoLoading || !artistPhotoFile}
              className="w-full py-3 bg-[#1A1A1A] hover:bg-[#6B1C2A] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm transition-colors disabled:opacity-40">
              {photoLoading ? "Menyimpan..." : "Simpan Foto Artis"}
            </button>
          </Card>
        </div>

        {/* ── SECTION: Upload Karya ────────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Upload Karya Baru</h2>
          <p className="text-sm text-[#9C9588] mb-5">Isi semua detail karya. Foto pertama otomatis jadi foto utama.</p>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Foto */}
            <Card title="Foto Karya">
              {previews.length === 0 ? (
                <label htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#E8E0D6] rounded-sm py-14 cursor-pointer hover:border-[#6B1C2A]/50 transition-all">
                  <svg className="w-8 h-8 text-[#9C9588]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#1A1A1A]/60">Klik untuk memilih foto</p>
                    <p className="text-[11px] text-[#9C9588]/60 mt-1">JPG, PNG, WebP — bisa pilih banyak sekaligus</p>
                    <p className="text-[10px] text-[#6B1C2A]/60 mt-1 font-medium">Foto pertama = foto utama. File nama "mock..." = mock up</p>
                  </div>
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-[#E8E0D6]">
                        <img src={src} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <button type="button" onClick={() => removeFile(idx)}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        {idx === 0 && <div className="absolute top-1 left-1 bg-[#6B1C2A] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm">Utama</div>}
                      </div>
                    ))}
                    <label htmlFor="file-upload" className="aspect-square rounded-sm border-2 border-dashed border-[#E8E0D6] flex flex-col items-center justify-center cursor-pointer hover:border-[#6B1C2A]/40 transition-colors">
                      <svg className="w-5 h-5 text-[#9C9588]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[10px] text-[#9C9588]/60 mt-1">Tambah</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-[#9C9588]/50">{files.length} foto dipilih</p>
                </div>
              )}
              <input ref={fileRef} id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
            </Card>

            {/* Detail Karya */}
            <Card title="Detail Karya">
              <Input label="Judul Karya" value={form.title} onChange={v => f("title",v)} placeholder="Contoh: Al-Hayy Al-Qayyum" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Kategori" value={form.category} onChange={v => f("category",v)} options={CATEGORY_OPTIONS} required />
                <Select label="Seniman" value={form.artist} onChange={v => f("artist",v)} options={ARTIST_OPTIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Medium" value={form.medium} onChange={v => f("medium",v)} options={MEDIUM_OPTIONS} />
                <Select label="Status" value={form.status} onChange={v => f("status",v)} options={STATUS_OPTIONS} />
              </div>
              <Input label="Tahun" value={form.year} onChange={v => f("year",v)} type="number" />
            </Card>

            {/* Dimensi */}
            <Card title="Ukuran dan Dimensi">
              <p className="text-xs text-[#9C9588]/70 -mt-2">Masukkan ukuran dalam sentimeter (cm)</p>
              <div className="grid grid-cols-3 gap-4">
                <Input label="Lebar (W)" value={form.sizeW} onChange={v => f("sizeW",v)} placeholder="100" />
                <Input label="Tinggi (H)" value={form.sizeH} onChange={v => f("sizeH",v)} placeholder="150" />
                <Input label="Dalam (D)" value={form.sizeD} onChange={v => f("sizeD",v)} placeholder="3" />
              </div>
              {(form.sizeW || form.sizeH) && (
                <p className="text-xs text-[#6B1C2A]/70 font-medium">
                  Preview ukuran: {[form.sizeW, form.sizeH, form.sizeD].filter(Boolean).join(" x ")} cm
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <Select label="Bingkai (Frame)" value={form.frame} onChange={v => f("frame",v)} options={FRAME_OPTIONS} />
                <Select label="Ready to Hang" value={form.readyToHang} onChange={v => f("readyToHang",v)} options={HANG_OPTIONS} />
              </div>
            </Card>

            {/* Pengiriman */}
            <Card title="Pengiriman dan Keaslian">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Sertifikat Keaslian" value={form.authenticity} onChange={v => f("authenticity",v)} options={AUTH_OPTIONS} />
                <Select label="Dikirim Dari" value={form.shipsFrom} onChange={v => f("shipsFrom",v)} options={ORIGIN_OPTIONS} />
              </div>
              <Input label="Packaging / Packing" value={form.packaging} onChange={v => f("packaging",v)}
                placeholder="Contoh: Digulung dalam tabung (rolled tube), dilindungi bubble wrap" />
              <div>
                <Input label="Handling" value={form.handling} onChange={v => f("handling",v)}
                  placeholder="Contoh: Domestik dikirim framed. Internasional digulung dalam tube untuk keamanan." />
                <p className="text-[10px] text-[#9C9588]/50 mt-1">Info handling akan tampil di tab Shipping pada modal karya</p>
              </div>
            </Card>

            {/* Deskripsi */}
            <Card title="Deskripsi">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1.5">Deskripsi Singkat</label>
                <textarea value={form.description} onChange={e => f("description",e.target.value)} rows={2}
                  placeholder="Kalimat singkat yang tampil di card preview..."
                  className="w-full px-4 py-3 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors resize-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1.5">
                  Deskripsi Panjang
                  <span className="text-[#9C9588]/50 ml-2 normal-case tracking-normal">(akan tampil di tab "About the Artwork")</span>
                </label>
                <textarea value={form.longDescription} onChange={e => f("longDescription",e.target.value)} rows={8}
                  placeholder="Cerita mendalam di balik karya — makna, proses, inspirasi, dalil (jika kaligrafi)..."
                  className="w-full px-4 py-3 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] transition-colors resize-none leading-relaxed" />
                <p className="text-[10px] text-[#9C9588]/50 mt-1">{form.longDescription.length} karakter</p>
              </div>
            </Card>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-sm text-sm font-medium ${result.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {result.success ? (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold">Karya berhasil diupload!</p>
                      <p className="text-xs mt-0.5 font-normal opacity-80">{result.message}</p>
                      <p className="text-xs mt-1 font-normal opacity-60">Refresh halaman gallery untuk melihat karya baru.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{result.error}</span>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-[#6B1C2A] hover:bg-[#4A0F1C] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menyimpan...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload Karya ke Gallery</>
              )}
            </button>
            <p className="text-[10px] text-[#9C9588]/50 text-center pb-8">File disimpan otomatis di folder public/artworks dan langsung tampil di gallery</p>
          </form>
        </div>
      </div>
    </div>
  );
}
