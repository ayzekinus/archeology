import { listRecords as listAnakodRecords } from "../core/anakodStore.js";
import { listBuluntuRecords, exportBuluntuAsJSON, resetBuluntuForDemo } from "../core/buluntuStore.js";

const filterAnakod = document.getElementById("filterAnakod");
const filterQ = document.getElementById("filterQ");
const list = document.getElementById("list");
const btnExport = document.getElementById("btnExport");
const btnResetDemo = document.getElementById("btnResetDemo");

function fillAnakodFilter() {
  filterAnakod.innerHTML = "";
  const oAll = document.createElement("option");
  oAll.value = "";
  oAll.textContent = "Tümü";
  filterAnakod.appendChild(oAll);

  for (const r of listAnakodRecords()) {
    const o = document.createElement("option");
    o.value = r.anakod;
    o.textContent = r.anakod;
    filterAnakod.appendChild(o);
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

function formatDate(isoOrDate) {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    return d.toLocaleString("tr-TR");
  } catch {
    return isoOrDate;
  }
}

function includesQ(rec, q) {
  if (!q) return true;
  const hay = [
    rec.fullBuluntuNo, rec.tip, rec.donem, rec.planKare, rec.buluntuYeri, rec.formObje,
    rec.yapimMalzemesi, rec.kaziEnvanterNo, rec.muzeEnvanterNo
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

function render() {
  const anakod = filterAnakod.value || "";
  const q = (filterQ.value || "").trim().toLowerCase();

  let rows = listBuluntuRecords();
  if (anakod) rows = rows.filter(r => r.anakod === anakod);
  if (q) rows = rows.filter(r => includesQ(r, q));

  const header = `
    <div class="tr" style="grid-template-columns: 120px 90px 160px 160px 160px 140px 120px 120px 90px 90px 120px;">
      <div class="td">Buluntu No</div>
      <div class="td">Anakod</div>
      <div class="td">Buluntu Yeri</div>
      <div class="td">PlanKare</div>
      <div class="td">Tip</div>
      <div class="td">Dönem</div>
      <div class="td">Kazı Env.</div>
      <div class="td">Müze Env.</div>
      <div class="td">Görsel</div>
      <div class="td">Çizim</div>
      <div class="td">Kayıt</div>
    </div>
  `;

  const body = rows.map(r => `
    <div class="tr" style="grid-template-columns: 120px 90px 160px 160px 160px 140px 120px 120px 90px 90px 120px;">
      <div class="td code">${escapeHtml(r.fullBuluntuNo)}</div>
      <div class="td code">${escapeHtml(r.anakod)}</div>
      <div class="td">${escapeHtml(r.buluntuYeri)}</div>
      <div class="td">${escapeHtml(r.planKare)}</div>
      <div class="td">${escapeHtml(r.tip)}</div>
      <div class="td">${escapeHtml(r.donem)}</div>
      <div class="td">${escapeHtml(r.kaziEnvanterNo)}</div>
      <div class="td">${escapeHtml(r.muzeEnvanterNo)}</div>
      <div class="td">${(r.gorsel?.length || 0)} adet</div>
      <div class="td">${(r.cizim?.length || 0)} adet</div>
      <div class="td">${escapeHtml(formatDate(r.createdAt))}</div>
    </div>
  `).join("");

  list.innerHTML = header + (body || `<div class="tr"><div class="td" style="grid-column:1/-1;">Kayıt yok.</div></div>`);
}

filterAnakod.addEventListener("change", render);
filterQ.addEventListener("input", render);

btnExport.addEventListener("click", () => {
  const data = exportBuluntuAsJSON();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "buluntu-export.json";
  a.click();
  URL.revokeObjectURL(url);
});

btnResetDemo.addEventListener("click", () => {
  resetBuluntuForDemo();
  render();
});

fillAnakodFilter();
render();
