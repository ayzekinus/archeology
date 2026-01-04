import { listBuluntuRecords, exportBuluntuAsJSON } from "../core/buluntuStore.js";

const list = document.getElementById("list");
const btnExport = document.getElementById("btnExport");

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("tr-TR");
  } catch {
    return iso;
  }
}

function render() {
  const rows = listBuluntuRecords().filter(r =>
    (r.kaziEnvanterNo && String(r.kaziEnvanterNo).trim()) ||
    (r.muzeEnvanterNo && String(r.muzeEnvanterNo).trim())
  );

  const header = `
    <div class="tr" style="grid-template-columns: 140px 90px 160px 160px 140px 140px 120px;">
      <div class="td">Buluntu No</div>
      <div class="td">Anakod</div>
      <div class="td">Kazı Env.</div>
      <div class="td">Müze Env.</div>
      <div class="td">Tip</div>
      <div class="td">Dönem</div>
      <div class="td">Kayıt</div>
    </div>
  `;

  const body = rows.map(r => `
    <div class="tr" style="grid-template-columns: 140px 90px 160px 160px 140px 140px 120px;">
      <div class="td code">${escapeHtml(r.fullBuluntuNo)}</div>
      <div class="td code">${escapeHtml(r.anakod)}</div>
      <div class="td">${escapeHtml(r.kaziEnvanterNo)}</div>
      <div class="td">${escapeHtml(r.muzeEnvanterNo)}</div>
      <div class="td">${escapeHtml(r.tip)}</div>
      <div class="td">${escapeHtml(r.donem)}</div>
      <div class="td">${escapeHtml(formatDate(r.createdAt))}</div>
    </div>
  `).join("");

  list.innerHTML = header + (body || `<div class="tr"><div class="td" style="grid-column:1/-1;">Kayıt yok.</div></div>`);
}

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

render();
