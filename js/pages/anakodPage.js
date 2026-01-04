import { BULUNTU_YERI_OPTIONS } from "../core/config.js";
import { createAnakodRecord, listRecords, exportAsJSON, resetStoreForDemo } from "../core/anakodStore.js";

const anakodOut = document.getElementById("anakodOut");
const buluntuYeri = document.getElementById("buluntuYeri");
const planKare = document.getElementById("planKare");
const aciklama = document.getElementById("aciklama");

const btnSave = document.getElementById("btnSave");
const btnClear = document.getElementById("btnClear");
const btnExport = document.getElementById("btnExport");
const btnResetDemo = document.getElementById("btnResetDemo");

const msg = document.getElementById("msg");
const list = document.getElementById("list");

function setMsg(text, isError = false) {
  msg.textContent = text || "";
  msg.classList.toggle("error", !!isError);
}

function renderBuluntuYeriOptions() {
  buluntuYeri.innerHTML = "";
  for (const opt of BULUNTU_YERI_OPTIONS) {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.label;
    buluntuYeri.appendChild(o);
  }
}

function clearForm() {
  anakodOut.value = "";
  buluntuYeri.value = "";
  planKare.value = "";
  aciklama.value = "";
  setMsg("");
}

function renderList() {
  const rows = listRecords();

  const header = `
    <div class="tr">
      <div class="td">ANAKOD</div>
      <div class="td">Buluntu Yeri</div>
      <div class="td">PlanKare</div>
      <div class="td">Açıklama</div>
      <div class="td">Tarih</div>
    </div>
  `;

  const body = rows.map(r => `
    <div class="tr">
      <div class="td code">${escapeHtml(r.anakod)}</div>
      <div class="td">${escapeHtml(r.buluntuYeri)}</div>
      <div class="td">${escapeHtml(r.planKare)}</div>
      <div class="td">${escapeHtml(r.aciklama)}</div>
      <div class="td">${escapeHtml(formatDate(r.createdAt))}</div>
    </div>
  `).join("");

  list.innerHTML = header + (body || `<div class="tr"><div class="td" style="grid-column:1/-1;">Kayıt yok.</div></div>`);
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("tr-TR");
  } catch {
    return iso;
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

btnSave.addEventListener("click", () => {
  setMsg("");

  const payload = {
    buluntuYeri: (buluntuYeri.value || "").trim(),
    planKare: (planKare.value || "").trim(),
    aciklama: (aciklama.value || "").trim()
  };

  if (!payload.buluntuYeri) return setMsg("Buluntu Yeri seçiniz.", true);
  if (!payload.planKare) return setMsg("PlanKare boş olamaz.", true);

  try {
    const rec = createAnakodRecord(payload);
    anakodOut.value = rec.anakod;
    setMsg(`Kayıt oluşturuldu. Anakod: ${rec.anakod}`);
    renderList();
  } catch (e) {
    setMsg(e.message || "Kayıt oluşturulamadı.", true);
  }
});

btnClear.addEventListener("click", () => clearForm());

btnExport.addEventListener("click", () => {
  const data = exportAsJSON();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "anakod-export.json";
  a.click();

  URL.revokeObjectURL(url);
});

btnResetDemo.addEventListener("click", () => {
  resetStoreForDemo();
  clearForm();
  renderList();
  setMsg("Demo verisi sıfırlandı.");
});

renderBuluntuYeriOptions();
renderList();
