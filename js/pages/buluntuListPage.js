import {
  DONEM_OPTIONS, FORM_OBJE_OPTIONS, YAPIM_MALZEMESI_OPTIONS, BULUNTU_YERI_OPTIONS
} from "../core/config.js";

import { listRecords as listAnakodRecords } from "../core/anakodStore.js";
import {
  listBuluntuRecords, resetBuluntuForDemo,
  getBuluntuById, deleteBuluntuRecord
} from "../core/buluntuStore.js";

const fAnakod = document.getElementById("fAnakod");
const fBuluntuNo = document.getElementById("fBuluntuNo");
const fBuluntuYeri = document.getElementById("fBuluntuYeri");
const fYapim = document.getElementById("fYapim");
const fTarihFrom = document.getElementById("fTarihFrom");
const fTarihTo = document.getElementById("fTarihTo");
const fDonem = document.getElementById("fDonem");
const fForm = document.getElementById("fForm");

const btnClearFilters = document.getElementById("btnClearFilters");
const btnResetDemo = document.getElementById("btnResetDemo");

const btnCsv = document.getElementById("btnCsv");
const btnExcel = document.getElementById("btnExcel");
const btnPdf = document.getElementById("btnPdf");
const msg = document.getElementById("msg");

const list = document.getElementById("list");

// modal
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const btnModalClose = document.getElementById("btnModalClose");
const btnModalEdit = document.getElementById("btnModalEdit");
const btnModalDelete = document.getElementById("btnModalDelete");

let modalId = null;

function setMsg(text, isError = false) {
  msg.textContent = text || "";
  msg.classList.toggle("error", !!isError);
}

function fillOptions(selectEl, options) {
  selectEl.innerHTML = "";
  for (const opt of options) {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.label;
    selectEl.appendChild(o);
  }
}

function fillAnakodFilter() {
  fAnakod.innerHTML = "";
  const oAll = document.createElement("option");
  oAll.value = "";
  oAll.textContent = "Tümü";
  fAnakod.appendChild(oAll);

  for (const r of listAnakodRecords()) {
    const o = document.createElement("option");
    o.value = r.anakod;
    o.textContent = r.anakod;
    fAnakod.appendChild(o);
  }
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toDateOnly(isoOrDate) {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0,10);
  } catch {
    return "";
  }
}

function isBetweenDates(dateStr, fromStr, toStr) {
  if (!fromStr && !toStr) return true;
  const d = toDateOnly(dateStr);
  if (!d) return false;
  if (fromStr && d < fromStr) return false;
  if (toStr && d > toStr) return false;
  return true;
}

function getFilteredRows() {
  const anakod = (fAnakod.value || "").trim();
  const qNo = (fBuluntuNo.value || "").trim().toUpperCase();
  const by = (fBuluntuYeri.value || "").trim();
  const ym = (fYapim.value || "").trim();
  const dn = (fDonem.value || "").trim();
  const fo = (fForm.value || "").trim();
  const df = (fTarihFrom.value || "").trim();
  const dt = (fTarihTo.value || "").trim();

  let rows = listBuluntuRecords();

  if (anakod) rows = rows.filter(r => r.anakod === anakod);
  if (by) rows = rows.filter(r => (r.buluntuYeri || "") === by);
  if (ym) rows = rows.filter(r => (r.yapimMalzemesi || "") === ym);
  if (dn) rows = rows.filter(r => (r.donem || "") === dn);
  if (fo) rows = rows.filter(r => (r.formObje || "") === fo);

  if (qNo) {
    rows = rows.filter(r => {
      const full = String(r.fullBuluntuNo || "").toUpperCase();
      if (full.includes(qNo)) return true;
      const suffix = full.slice(3);
      return suffix && suffix.includes(qNo.replace(/\D/g, ""));
    });
  }

  if (df || dt) rows = rows.filter(r => isBetweenDates(r.buluntuTarihi, df, dt));

  return rows;
}

function render() {
  const rows = getFilteredRows();

  const header = `
    <div class="tr" style="grid-template-columns: 90px 120px 170px 160px 140px 140px 160px 220px; min-width: 1200px;">
      <div class="td">Anakod</div>
      <div class="td">Buluntu No</div>
      <div class="td">Buluntu Yeri</div>
      <div class="td">Yapım Malzemesi</div>
      <div class="td">Buluntu Tarihi</div>
      <div class="td">Dönem</div>
      <div class="td">Form/Obje</div>
      <div class="td">Detay</div>
    </div>
  `;

  const body = rows.map(r => `
    <div class="tr" style="grid-template-columns: 90px 120px 170px 160px 140px 140px 160px 220px; min-width: 1200px;">
      <div class="td code">${escapeHtml(r.anakod)}</div>
      <div class="td code">${escapeHtml(r.fullBuluntuNo)}</div>
      <div class="td">${escapeHtml(r.buluntuYeri)}</div>
      <div class="td">${escapeHtml(r.yapimMalzemesi)}</div>
      <div class="td">${escapeHtml(toDateOnly(r.buluntuTarihi))}</div>
      <div class="td">${escapeHtml(r.donem)}</div>
      <div class="td">${escapeHtml(r.formObje)}</div>
      <div class="td">
        <button class="button secondary small" data-act="view" data-id="${escapeHtml(r.id)}">Görüntüle</button>
        <button class="button secondary small" data-act="edit" data-id="${escapeHtml(r.id)}">Düzenle</button>
        <button class="button danger small" data-act="delete" data-id="${escapeHtml(r.id)}">Sil</button>
      </div>
    </div>
  `).join("");

  list.innerHTML = header + (body || `<div class="tr"><div class="td" style="grid-column:1/-1;">Kayıt yok.</div></div>`);
}

function openModal(id) {
  const rec = getBuluntuById(id);
  if (!rec) return setMsg("Detay bulunamadı.", true);

  modalId = id;
  modalTitle.textContent = `Buluntu Detay: ${rec.fullBuluntuNo}`;
  modalBody.innerHTML = renderDetailHtml(rec);
  modalBackdrop.style.display = "flex";
  modalBackdrop.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalId = null;
  modalBackdrop.style.display = "none";
  modalBackdrop.setAttribute("aria-hidden", "true");
}

function renderDetailHtml(r) {
  const o = r.olcuRenk || {};
  const measure = (m) => m && (m.value !== "" && m.value !== null && m.value !== undefined) ? `${escapeHtml(m.value)} ${escapeHtml(m.unit || "")}` : "";
  const thumbs = (arr) => (arr || []).slice(0, 12).map(x =>
    `<img class="thumb" src="${escapeHtml(x.dataUrl)}" alt="${escapeHtml(x.name)}" title="${escapeHtml(x.name)}" />`
  ).join("");

  return `
    <div class="kv">
      <div class="k">Anakod</div><div class="v code">${escapeHtml(r.anakod)}</div>
      <div class="k">Buluntu No</div><div class="v code">${escapeHtml(r.fullBuluntuNo)}</div>
      <div class="k">Buluntu Yeri</div><div class="v">${escapeHtml(r.buluntuYeri)}</div>
      <div class="k">Buluntu Tarihi</div><div class="v">${escapeHtml(toDateOnly(r.buluntuTarihi))}</div>

      <div class="k">Form/Obje</div><div class="v">${escapeHtml(r.formObje)}</div>
      <div class="k">Üretim Yeri</div><div class="v">${escapeHtml(r.uretimYeri)}</div>
      <div class="k">Tip</div><div class="v">${escapeHtml(r.tip)}</div>

      <div class="k">PlanKare</div><div class="v">${escapeHtml(r.planKare)}</div>
      <div class="k">Seviye</div><div class="v">${escapeHtml(r.seviye)}</div>
      <div class="k">Tabaka</div><div class="v">${escapeHtml(r.tabaka)}</div>
      <div class="k">Mezar No</div><div class="v">${escapeHtml(r.mezarNo)}</div>

      <div class="k">Eser Tarihi</div><div class="v">${escapeHtml(r.eserTarihi)}</div>
      <div class="k">Şube</div><div class="v">${escapeHtml(r.sube)}</div>

      <div class="k">Kazı Envanter No</div><div class="v">${escapeHtml(r.kaziEnvanterNo)}</div>
      <div class="k">Müze Envanter No</div><div class="v">${escapeHtml(r.muzeEnvanterNo)}</div>

      <div class="k">Yapım Malzemesi</div><div class="v">${escapeHtml(r.yapimMalzemesi)}</div>
      <div class="k">Dönem</div><div class="v">${escapeHtml(r.donem)}</div>
      <div class="k">Buluntu Şekli</div><div class="v">${escapeHtml(r.buluntuSekli)}</div>

      <div class="k">Buluntu Yeri Diğer Bilgi</div><div class="v">${escapeHtml(r.buluntuYeriDiger)}</div>

      <div class="k">Ölçüler</div>
      <div class="v">
        Yükseklik: ${measure(o.yukseklik)} | Ağız Çapı: ${measure(o.agizCapi)} | Dip Çapı: ${measure(o.dipCapi)}<br/>
        Kalınlık: ${measure(o.kalinlik)} | Uzunluk: ${measure(o.uzunluk)} | Genişlik: ${measure(o.genislik)} | Çap: ${measure(o.cap)}<br/>
        Ağırlık: ${measure(o.agirlik)}
      </div>

      <div class="k">Renkler</div>
      <div class="v">Hamur: ${escapeHtml(o.hamurRengi)} | Astar: ${escapeHtml(o.astarRengi)} | Diğer: ${escapeHtml(r.digerRenk)}</div>

      <div class="k">Kalıp Yönü</div><div class="v">${escapeHtml(r.kalipYonu)}</div>
      <div class="k">Tanım / Bezeme</div><div class="v">${escapeHtml(r.tanimBezeme)}</div>
      <div class="k">Kaynak / Referans</div><div class="v">${escapeHtml(r.kaynakReferans)}</div>

      <div class="k">Kayıt Tarihi</div><div class="v">${escapeHtml(r.createdAt || "")}</div>
      <div class="k">Güncelleme</div><div class="v">${escapeHtml(r.updatedAt || "")}</div>
    </div>

    <div style="margin-top:14px;">
      <div class="muted" style="font-weight:700;">Buluntu Görseli (${(r.gorsel || []).length})</div>
      <div class="thumbRow">${thumbs(r.gorsel)}</div>
    </div>

    <div style="margin-top:14px;">
      <div class="muted" style="font-weight:700;">Buluntu Çizim (${(r.cizim || []).length})</div>
      <div class="thumbRow">${thumbs(r.cizim)}</div>
    </div>
  `;
}

list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const act = btn.dataset.act;
  const id = btn.dataset.id;
  if (!id) return;

  if (act === "view") return openModal(id);
  if (act === "edit") return (window.location.href = `./buluntu-create.html?id=${encodeURIComponent(id)}`);
  if (act === "delete") {
    const rec = getBuluntuById(id);
    const ok = window.confirm(`Silmek istediğinize emin misiniz?\n${rec?.fullBuluntuNo || id}`);
    if (!ok) return;
    try {
      deleteBuluntuRecord(id);
      setMsg("Kayıt silindi.");
      render();
      if (modalId === id) closeModal();
    } catch (err) {
      setMsg(err.message || "Silme başarısız.", true);
    }
  }
});

btnModalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

btnModalEdit.addEventListener("click", () => {
  if (!modalId) return;
  window.location.href = `./buluntu-create.html?id=${encodeURIComponent(modalId)}`;
});

btnModalDelete.addEventListener("click", () => {
  if (!modalId) return;
  const rec = getBuluntuById(modalId);
  const ok = window.confirm(`Silmek istediğinize emin misiniz?\n${rec?.fullBuluntuNo || modalId}`);
  if (!ok) return;
  try {
    deleteBuluntuRecord(modalId);
    setMsg("Kayıt silindi.");
    closeModal();
    render();
  } catch (err) {
    setMsg(err.message || "Silme başarısız.", true);
  }
});

function clearFilters() {
  fAnakod.value = "";
  fBuluntuNo.value = "";
  fBuluntuYeri.value = "";
  fYapim.value = "";
  fTarihFrom.value = "";
  fTarihTo.value = "";
  fDonem.value = "";
  fForm.value = "";
  setMsg("");
  render();
}

btnClearFilters.addEventListener("click", clearFilters);
btnResetDemo.addEventListener("click", () => {
  resetBuluntuForDemo();
  setMsg("Demo buluntu verisi sıfırlandı.");
  render();
});

[fAnakod, fBuluntuNo, fBuluntuYeri, fYapim, fTarihFrom, fTarihTo, fDonem, fForm].forEach(el => {
  el.addEventListener("change", render);
  el.addEventListener("input", render);
});

function flattenRecord(rec) {
  const o = rec.olcuRenk || {};
  const getM = (m) => (m && m.value !== "" && m.value !== null && m.value !== undefined) ? `${m.value} ${m.unit || ""}` : "";
  return {
    id: rec.id,
    anakod: rec.anakod,
    fullBuluntuNo: rec.fullBuluntuNo,
    buluntuNoRaw: rec.buluntuNoRaw,
    buluntuYeri: rec.buluntuYeri,
    buluntuTarihi: rec.buluntuTarihi,
    kaziEnvanterNo: rec.kaziEnvanterNo,
    muzeEnvanterNo: rec.muzeEnvanterNo,
    formObje: rec.formObje,
    uretimYeri: rec.uretimYeri,
    tip: rec.tip,
    planKare: rec.planKare,
    seviye: rec.seviye,
    tabaka: rec.tabaka,
    mezarNo: rec.mezarNo,
    eserTarihi: rec.eserTarihi,
    sube: rec.sube,
    yapimMalzemesi: rec.yapimMalzemesi,
    donem: rec.donem,
    buluntuSekli: rec.buluntuSekli,
    buluntuYeriDiger: rec.buluntuYeriDiger,
    yukseklik: getM(o.yukseklik),
    agizCapi: getM(o.agizCapi),
    dipCapi: getM(o.dipCapi),
    kalinlik: getM(o.kalinlik),
    uzunluk: getM(o.uzunluk),
    genislik: getM(o.genislik),
    cap: getM(o.cap),
    agirlik: getM(o.agirlik),
    hamurRengi: o.hamurRengi || "",
    astarRengi: o.astarRengi || "",
    kalipYonu: rec.kalipYonu,
    digerRenk: rec.digerRenk,
    tanimBezeme: rec.tanimBezeme,
    kaynakReferans: rec.kaynakReferans,
    gorselCount: (rec.gorsel || []).length,
    cizimCount: (rec.cizim || []).length,
    createdAt: rec.createdAt,
    updatedAt: rec.updatedAt
  };
}

function toCsv(rows) {
  const cols = Object.keys(rows[0] || {});
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };
  const lines = [
    cols.join(","),
    ...rows.map(r => cols.map(c => esc(r[c])).join(","))
  ];
  return lines.join("\n");
}

function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportRows() {
  const rows = getFilteredRows();
  return rows.map(flattenRecord);
}

btnCsv.addEventListener("click", () => {
  const rows = exportRows();
  if (!rows.length) return setMsg("Export edilecek kayıt yok.", true);
  const csv = toCsv(rows);
  download("buluntu-export.csv", new Blob([csv], { type: "text/csv;charset=utf-8" }));
  setMsg(`CSV oluşturuldu (${rows.length} kayıt).`);
});

btnExcel.addEventListener("click", () => {
  const rows = exportRows();
  if (!rows.length) return setMsg("Export edilecek kayıt yok.", true);

  const cols = Object.keys(rows[0] || {});
  const tr = (cells) => `<tr>${cells.map(c => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`;
  const html = `
    <html><head><meta charset="utf-8" /></head><body>
    <table border="1">
      ${tr(cols)}
      ${rows.map(r => tr(cols.map(c => r[c]))).join("")}
    </table>
    </body></html>
  `;
  download("buluntu-export.xls", new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }));
  setMsg(`Excel oluşturuldu (${rows.length} kayıt).`);
});

btnPdf.addEventListener("click", () => {
  const rows = exportRows();
  if (!rows.length) return setMsg("Export edilecek kayıt yok.", true);

  const cols = Object.keys(rows[0] || {});
  const th = cols.map(c => `<th style="text-align:left;border:1px solid #ddd;padding:6px;">${escapeHtml(c)}</th>`).join("");
  const body = rows.map(r => {
    const td = cols.map(c => `<td style="border:1px solid #ddd;padding:6px;vertical-align:top;">${escapeHtml(r[c])}</td>`).join("");
    return `<tr>${td}</tr>`;
  }).join("");

  const w = window.open("", "_blank");
  if (!w) return setMsg("PDF için pencere açılamadı (popup engeli olabilir).", true);

  w.document.open();
  w.document.write(`
    <html><head><meta charset="utf-8" />
    <title>Buluntu Export</title>
    <style>body{font-family:system-ui,Arial,sans-serif} table{border-collapse:collapse;width:100%} th{background:#f3f3f3}</style>
    </head><body>
      <h2>Buluntu Export (${rows.length} kayıt)</h2>
      <p>Not: Tarayıcı yazdır menüsünden “PDF olarak kaydet” seçebilirsiniz.</p>
      <table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>
      <script>window.onload = () => window.print();<\/script>
    </body></html>
  `);
  w.document.close();
  setMsg(`PDF için yazdır penceresi açıldı (${rows.length} kayıt).`);
});

fillAnakodFilter();
fillOptions(fBuluntuYeri, [{ value: "", label: "Tümü" }, ...BULUNTU_YERI_OPTIONS.filter(x => x.value)]);
fillOptions(fYapim, [{ value: "", label: "Tümü" }, ...YAPIM_MALZEMESI_OPTIONS.filter(x => x.value)]);
fillOptions(fDonem, [{ value: "", label: "Tümü" }, ...DONEM_OPTIONS.filter(x => x.value)]);
fillOptions(fForm, [{ value: "", label: "Tümü" }, ...FORM_OBJE_OPTIONS.filter(x => x.value)]);

render();
