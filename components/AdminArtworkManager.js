"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminArtworkManager({ password }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const imgRef = useRef(null);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/artworks?password=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (data.artworks) setArtworks(data.artworks);
      else if (data.error) showMsg({ error: data.error });
    } catch { showMsg({ error: "Gagal memuat data." }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArtworks(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(null), 5000); };

  const openDetail = (art) => {
    setSelected(art);
    setEditMode(false);
    setEditData(null);
    setDeleteConfirm(false);
  };

  const closeDetail = () => { setSelected(null); setEditMode(false); setEditData(null); setDeleteConfirm(false); };

  const startEdit = () => { setEditData({...selected}); setEditMode(true); };

  const handleEdit = async () => {
    setActionLoading(true);
    try {
      const body = { ...editData, password };
      const sizeParts = [editData.sizeW, editData.sizeH, editData.sizeD].filter(Boolean);
      body.size = sizeParts.length >= 2 ? sizeParts.join(" x ") + " cm" : "";
      const res = await fetch(`/api/admin/artworks/${encodeURIComponent(selected.id)}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { showMsg({ success: data.message }); closeDetail(); fetchArtworks(); }
      else showMsg({ error: data.error });
    } catch { showMsg({ error: "Gagal menyimpan." }); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/artworks/${encodeURIComponent(selected.id)}?password=${encodeURIComponent(password)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg({ success: data.message }); closeDetail(); fetchArtworks(); }
      else showMsg({ error: data.error });
    } catch { showMsg({ error: "Gagal menghapus." }); }
    finally { setActionLoading(false); }
  };

  const handleToggleDraft = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/artworks/${encodeURIComponent(selected.id)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) { showMsg({ success: data.message }); closeDetail(); fetchArtworks(); }
      else showMsg({ error: data.error });
    } catch { showMsg({ error: "Gagal mengubah visibilitas." }); }
    finally { setActionLoading(false); }
  };

  const handleStatusToggle = async () => {
    setActionLoading(true);
    const newStatus = selected.status === "collected" ? "available" : "collected";
    try {
      const res = await fetch(`/api/admin/artworks/${encodeURIComponent(selected.id)}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selected, status: newStatus, password }),
      });
      const data = await res.json();
      if (data.success) { showMsg({ success: `Status → ${newStatus}` }); closeDetail(); fetchArtworks(); }
      else showMsg({ error: data.error });
    } catch { showMsg({ error: "Gagal mengubah status." }); }
    finally { setActionLoading(false); }
  };

  const handleImgReplace = async () => {
    const files = imgRef.current?.files;
    if (!files?.length) return;
    setActionLoading(true);
    const fd = new FormData();
    fd.append("password", password);
    fd.append("replaceAll", "true");
    Array.from(files).forEach(f => fd.append("files", f));
    try {
      const res = await fetch(`/api/admin/artworks/${encodeURIComponent(selected.id)}/images`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { showMsg({ success: data.message }); closeDetail(); fetchArtworks(); }
      else showMsg({ error: data.error });
    } catch { showMsg({ error: "Gagal upload." }); }
    finally { setActionLoading(false); }
  };

  const filtered = artworks.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat !== "all" && a.category !== filterCat) return false;
    if (filterStatus === "draft" && !a.isDraft) return false;
    if (filterStatus === "available" && (a.status !== "available" || a.isDraft)) return false;
    if (filterStatus === "collected" && a.status !== "collected") return false;
    return true;
  });

  const ef = (k,v) => setEditData(p => ({...p,[k]:v}));

  return (
    <div>
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Kelola Karya</h2>
      <p className="text-sm text-[#9C9588] mb-5">Klik karya untuk mengedit, menghapus, atau mengubah pengaturan.</p>

      {msg && (
        <div className={`mb-4 p-3 rounded-sm text-sm font-medium ${msg.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.success ? `✓ ${msg.success}` : `✗ ${msg.error}`}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-sm border border-[#E8E0D6] p-4 mb-5 space-y-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul karya..."
          className="w-full px-4 py-2.5 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]" />
        <div className="flex gap-2 flex-wrap">
          {[["all","Semua"],["calligraphy","Kaligrafi"],["landscape","Landscape"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilterCat(v)} className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm border transition-colors ${filterCat===v?"bg-[#1A1A1A] text-white border-[#1A1A1A]":"border-[#E8E0D6] text-[#9C9588] hover:border-[#6B1C2A]"}`}>{l}</button>
          ))}
          <div className="w-px bg-[#E8E0D6] mx-1" />
          {[["all","Semua Status"],["available","Available"],["collected","Collected"],["draft","Draft"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilterStatus(v)} className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm border transition-colors ${filterStatus===v?"bg-[#6B1C2A] text-white border-[#6B1C2A]":"border-[#E8E0D6] text-[#9C9588] hover:border-[#6B1C2A]"}`}>{l}</button>
          ))}
        </div>
        <p className="text-[10px] text-[#9C9588]/60">{filtered.length} dari {artworks.length} karya</p>
      </div>

      {/* Grid — cards are clickable */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="aspect-square shimmer-loading rounded-sm" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#9C9588]"><p className="text-sm">Tidak ada karya ditemukan.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(art => (
            <button key={art.id} type="button" onClick={() => openDetail(art)}
              className={`text-left bg-white rounded-sm border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group ${art.isDraft?"border-amber-300 opacity-70":"border-[#E8E0D6]"}`}>
              <div className="relative aspect-square bg-[#F5F0EB] overflow-hidden">
                {art.images?.[0] ? (
                  <img src={art.images[0]} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#9C9588]/30">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#1A1A1A] text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-sm shadow">Kelola →</span>
                </div>
                <div className="absolute top-1.5 left-1.5 flex gap-1">
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-sm ${art.category==="calligraphy"?"bg-[#6B1C2A] text-white":"bg-[#1A1A1A] text-white"}`}>{art.category==="calligraphy"?"CAL":"LAN"}</span>
                  {art.isDraft && <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-sm bg-amber-400 text-amber-900">Draft</span>}
                  {art.status==="collected" && <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase rounded-sm bg-emerald-500 text-white">Sold</span>}
                </div>
              </div>
              <div className="p-2.5">
                <h4 className="text-xs font-semibold text-[#1A1A1A] truncate">{art.title}</h4>
                <p className="text-[10px] text-[#9C9588] mt-0.5 truncate">{art.artist} · {art.year}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Detail/Action Modal — opens when card is clicked ── */}
      {selected && !editMode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4" onClick={closeDetail}>
          <div className="bg-white rounded-sm max-w-md w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Image preview */}
            <div className="relative aspect-[4/3] bg-[#F5F0EB]">
              {selected.images?.[0] && <img src={selected.images[0]} alt={selected.title} className="w-full h-full object-cover" />}
              <button onClick={closeDetail} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm">✕</button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-lg font-bold text-white">{selected.title}</h3>
                <p className="text-xs text-white/60 mt-0.5">{selected.artist} · {selected.year} · {selected.medium}</p>
              </div>
            </div>
            {/* Info & quick badges */}
            <div className="p-4 border-b border-[#E8E0D6]">
              <div className="flex gap-2 flex-wrap">
                <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded-sm ${selected.category==="calligraphy"?"bg-[#6B1C2A]/10 text-[#6B1C2A]":"bg-[#1A1A1A]/10 text-[#1A1A1A]"}`}>{selected.category}</span>
                <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded-sm ${selected.status==="collected"?"bg-emerald-100 text-emerald-700":"bg-blue-50 text-blue-600"}`}>{selected.status==="collected"?"Collected / Sold":"Available"}</span>
                {selected.isDraft && <span className="px-2 py-1 text-[9px] font-bold uppercase rounded-sm bg-amber-100 text-amber-700">Tersembunyi (Draft)</span>}
                {selected.size && <span className="px-2 py-1 text-[9px] font-medium rounded-sm bg-[#F5F0EB] text-[#9C9588]">{selected.size}</span>}
                <span className="px-2 py-1 text-[9px] font-medium rounded-sm bg-[#F5F0EB] text-[#9C9588]">{selected.images?.length || 0} foto</span>
              </div>
              {selected.description && <p className="text-xs text-[#9C9588] mt-3 leading-relaxed">{selected.description}</p>}
            </div>
            {/* Action buttons */}
            <div className="p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium mb-2">Aksi</p>
              <button onClick={startEdit} disabled={actionLoading} className="w-full py-3 text-xs font-semibold tracking-[0.1em] uppercase bg-[#1A1A1A] text-white rounded-sm hover:bg-[#6B1C2A] transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit Detail Karya
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleStatusToggle} disabled={actionLoading} className={`py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase rounded-sm border transition-colors ${selected.status==="collected"?"border-emerald-300 text-emerald-700 hover:bg-emerald-50":"border-[#E8E0D6] text-[#9C9588] hover:border-emerald-400 hover:text-emerald-700"}`}>
                  {selected.status==="collected" ? "↩ Set Available" : "✓ Set Sold"}
                </button>
                <button onClick={handleToggleDraft} disabled={actionLoading} className={`py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase rounded-sm border transition-colors ${selected.isDraft?"border-amber-300 text-amber-700 hover:bg-amber-50":"border-[#E8E0D6] text-[#9C9588] hover:border-amber-400 hover:text-amber-700"}`}>
                  {selected.isDraft ? "👁 Tampilkan" : "🙈 Sembunyikan"}
                </button>
              </div>
              {/* Image replace */}
              <div className="border border-[#E8E0D6] rounded-sm p-3 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#9C9588] font-medium">Ganti Semua Foto</p>
                <div className="flex gap-2">
                  <input ref={imgRef} type="file" accept="image/*" multiple className="flex-1 text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:font-semibold file:bg-[#F5F0EB] file:text-[#1A1A1A] hover:file:bg-[#E8E0D6] file:cursor-pointer" />
                  <button onClick={handleImgReplace} disabled={actionLoading} className="px-4 py-1.5 text-[10px] font-semibold uppercase bg-[#6B1C2A] text-white rounded-sm hover:bg-[#4A0F1C] transition-colors">Upload</button>
                </div>
              </div>
              {/* Delete */}
              {!deleteConfirm ? (
                <button onClick={() => setDeleteConfirm(true)} disabled={actionLoading} className="w-full py-2.5 text-[10px] font-semibold tracking-[0.1em] uppercase rounded-sm border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                  🗑 Hapus Karya Ini
                </button>
              ) : (
                <div className="border border-red-300 rounded-sm p-3 bg-red-50 space-y-2">
                  <p className="text-xs text-red-700 font-medium">Yakin hapus "{selected.title}"? Ini tidak bisa dibatalkan.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2 text-[10px] font-semibold border border-[#E8E0D6] rounded-sm hover:bg-white transition-colors">Batal</button>
                    <button onClick={handleDelete} disabled={actionLoading} className="flex-1 py-2 text-[10px] font-semibold bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors">{actionLoading ? "Menghapus..." : "Ya, Hapus!"}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {selected && editMode && editData && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 py-6 overflow-y-auto" onClick={() => { setEditMode(false); setEditData(null); }}>
          <div className="bg-white rounded-sm max-w-lg w-full my-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E8E0D6] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1A1A1A]">Edit — {selected.title}</h3>
              <button onClick={() => { setEditMode(false); setEditData(null); }} className="text-[#9C9588] hover:text-[#1A1A1A] text-lg">✕</button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Judul</label><input value={editData.title} onChange={e=>ef("title",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Kategori</label><select value={editData.category} onChange={e=>ef("category",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]"><option value="calligraphy">Calligraphy</option><option value="landscape">Landscape</option></select></div>
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Status</label><select value={editData.status} onChange={e=>ef("status",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]"><option value="available">Available</option><option value="collected">Collected</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Seniman</label><select value={editData.artist} onChange={e=>ef("artist",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]"><option>Raihan Mohammad</option><option>Condro Puspitosari</option></select></div>
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Medium</label><select value={editData.medium} onChange={e=>ef("medium",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]"><option>Acrylic on Canvas</option><option>Oil on Canvas</option></select></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">W (cm)</label><input value={editData.sizeW} onChange={e=>ef("sizeW",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]" /></div>
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">H (cm)</label><input value={editData.sizeH} onChange={e=>ef("sizeH",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]" /></div>
                <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">D (cm)</label><input value={editData.sizeD} onChange={e=>ef("sizeD",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]" /></div>
              </div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Tahun</label><input type="number" value={editData.year} onChange={e=>ef("year",e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A]" /></div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Deskripsi Singkat</label><textarea value={editData.description} onChange={e=>ef("description",e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] resize-none" /></div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] text-[#9C9588] font-medium block mb-1">Deskripsi Panjang</label><textarea value={editData.longDescription} onChange={e=>ef("longDescription",e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-[#E8E0D6] rounded-sm bg-[#FAFAF8] focus:outline-none focus:border-[#6B1C2A] resize-none" /></div>
            </div>
            <div className="p-5 border-t border-[#E8E0D6] flex gap-2">
              <button onClick={() => { setEditMode(false); setEditData(null); }} className="flex-1 py-2.5 text-xs font-semibold border border-[#E8E0D6] rounded-sm hover:bg-[#F5F0EB] transition-colors">Batal</button>
              <button onClick={handleEdit} disabled={actionLoading} className="flex-1 py-2.5 text-xs font-semibold bg-[#6B1C2A] text-white rounded-sm hover:bg-[#4A0F1C] transition-colors">{actionLoading ? "Menyimpan..." : "Simpan Perubahan"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
