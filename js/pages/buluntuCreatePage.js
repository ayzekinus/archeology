import {
  FORM_OBJE_OPTIONS, URETIM_YERI_OPTIONS, TIP_OPTIONS,
  YAPIM_MALZEMESI_OPTIONS, DONEM_OPTIONS, BULUNTU_SEKLI_OPTIONS,
  RENK_OPTIONS
} from "../core/config.js";

import { listRecords as listAnakodRecords } from "../core/anakodStore.js";
import { createBuluntuRecord, updateBuluntuRecord, existsBuluntuNo, getBuluntuById } from "../core/buluntuStore.js";

const pageTitle = document.getElementById("pageTitle");
const editHint = document.getElementById("editHint");

const anakodSelect = document.getElementById("anakodSelect");
const anakodHint = document.getElementById("anakodHint");

const buluntuNo = document.getElementById("buluntuNo");
const buluntuNoHint = document.getElementById("buluntuNoHint");

const buluntuTarihi = document.getElementById("buluntuTarihi");
const kaziEnvanterNo = document.getElementById("kaziEnvanterNo");
const formObje = document.getElementById("formObje");
const uretimYeri = document.getElementById("uretimYeri");
const tip = document.getElementById("tip");

const buluntuYeriLocked = document.getElementById("buluntuYeriLocked");
const planKare = document.getElementById("planKare");
const seviye = document.getElementById("seviye");
const eserTarihi = document.getElementById("eserTarihi");
const sube = document.getElementById("sube");
const muzeEnvanterNo = document.getElementById("muzeEnvanterNo");
const yapimMalzemesi = document.getElementById("yapimMalzemesi");
const donem = document.getElementById("donem");
const buluntuSekli = document.getElementById("buluntuSekli");
const tabaka = document.getElementById("tabaka");
const mezarNo = document.getElementById("mezarNo");
const buluntuYeriDiger = document.getElementById("buluntuYeriDiger");

// measurements
const yukseklikVal = document.getElementById("yukseklikVal");
const yukseklikUnit = document.getElementById("yukseklikUnit");
const agizCapiVal = document.getElementById("agizCapiVal");
const agizCapiUnit = document.getElementById("agizCapiUnit");
const dipCapiVal = document.getElementById("dipCapiVal");
const dipCapiUnit = document.getElementById("dipCapiUnit");
const kalinlikVal = document.getElementById("kalinlikVal");
const kalinlikUnit = document.getElementById("kalinlikUnit");
const uzunlukVal = document.getElementById("uzunlukVal");
const uzunlukUnit = document.getElementById("uzunlukUnit");
const genislikVal = document.getElementById("genislikVal");
const genislikUnit = document.getElementById("genislikUnit");
const capVal = document.getElementById("capVal");
const capUnit = document.getElementById("capUnit");
const agirlikVal = document.getElementById("agirlikVal");
const agirlikUnit = document.getElementById("agirlikUnit");

const hamurRengi = document.getElementById("hamurRengi");
const astarRengi = document.getElementById("astarRengi");
const kalipYonu = document.getElementById("kalipYonu");
const digerRenk = document.getElementById("digerRenk");

const tanimBezeme = document.getElementById("tanimBezeme");
const kaynakReferans = document.getElementById("kaynakReferans");

const buluntuGorsel = document.getElementById("buluntuGorsel");
const buluntuCizim = document.getElementById("buluntuCizim");
const gorselHint = document.getElementById("gorselHint");
const cizimHint = document.getElementById("cizimHint");

const btnSave = document.getElementById("btnSave");
const btnClear = document.getElementById("btnClear");
const msg = document.getElementById("msg");

const MAX_IMAGE_COUNT = 6;
const MAX_IMAGE_SIZE_BYTES = 800_000; // ~0.8MB

let editId = null;

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

function fillAnakodOptions() {
  const anakodRecords = listAnakodRecords();
  anakodSelect.innerHTML = "";

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Seçiniz...";
  anakodSelect.appendChild(defaultOpt);

  for (const r of anakodRecords) {
    const o = document.createElement("option");
    o.value = r.id;
    o.textContent = `${r.anakod} — ${r.buluntuYeri}`;
    o.dataset.anakod = r.anakod;
    o.dataset.buluntuYeri = r.buluntuYeri || "";
    anakodSelect.appendChild(o);
  }

  if (anakodRecords.length === 0) {
    anakodHint.textContent = "Henüz anakod kaydı yok. Önce Anakod sayfasından kayıt oluşturun.";
  } else {
    anakodHint.textContent = "Anakod seçtiğinizde sadece Buluntu Yeri otomatik gelir (diğer alanlar gelmez).";
  }
}

function getSelectedAnakodMeta() {
  const opt = anakodSelect.selectedOptions?.[0];
  if (!opt || !opt.value) return null;
  return {
    anakodId: opt.value,
    anakod: opt.dataset.anakod,
    buluntuYeri: opt.dataset.buluntuYeri || ""
  };
}

function padBuluntuNo(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length >= 4) return digits;
  return digits.padStart(4, "0");
}

function computeFullNo() {
  const meta = getSelectedAnakodMeta();
  const num = padBuluntuNo(buluntuNo.value);
  if (!meta || !num) return "";
  return `${meta.anakod}${num}`;
}

function validateUniqHint() {
  const full = computeFullNo();
  if (!full) {
    buluntuNoHint.textContent = "Örnek: 0001. Sistem tam numarayı Anakod ile birleştirir (AAA0001).";
    buluntuNoHint.style.color = "#555";
    return;
  }
  const exists = existsBuluntuNo(full, editId);
  if (exists) {
    buluntuNoHint.textContent = `UYARI: Bu numara zaten var: ${full}`;
    buluntuNoHint.style.color = "#b00";
  } else {
    buluntuNoHint.textContent = `Tam Buluntu No: ${full}`;
    buluntuNoHint.style.color = "#0b6";
  }
}

anakodSelect.addEventListener("change", () => {
  const meta = getSelectedAnakodMeta();
  // İstenen: sadece Buluntu Yeri gelsin. PlanKare/Tabaka/Seviye/Mezar No otomatik dolmaz.
  buluntuYeriLocked.value = meta?.buluntuYeri || "";
  validateUniqHint();
});

buluntuNo.addEventListener("input", () => validateUniqHint());

function clearForm({ keepAnakod = true, keepMsg = false } = {}) {
  if (!keepAnakod) anakodSelect.value = "";
  buluntuNo.value = "";
  buluntuTarihi.value = "";
  kaziEnvanterNo.value = "";
  formObje.value = "";
  uretimYeri.value = "";
  tip.value = "";

  buluntuYeriLocked.value = keepAnakod ? (getSelectedAnakodMeta()?.buluntuYeri || "") : "";
  planKare.value = "";
  seviye.value = "";
  eserTarihi.value = "";
  sube.value = "";
  muzeEnvanterNo.value = "";
  yapimMalzemesi.value = "";
  donem.value = "";
  buluntuSekli.value = "";
  tabaka.value = "";
  mezarNo.value = "";
  buluntuYeriDiger.value = "";

  yukseklikVal.value = ""; agizCapiVal.value = ""; dipCapiVal.value = "";
  kalinlikVal.value = ""; uzunlukVal.value = ""; genislikVal.value = "";
  capVal.value = ""; agirlikVal.value = "";

  hamurRengi.value = ""; astarRengi.value = "";
  kalipYonu.value = ""; digerRenk.value = "";
  tanimBezeme.value = ""; kaynakReferans.value = "";

  buluntuGorsel.value = "";
  buluntuCizim.value = "";
  gorselHint.textContent = "";
  cizimHint.textContent = "";

  if (!keepMsg) setMsg("");
  validateUniqHint();
}

btnClear.addEventListener("click", () => clearForm({ keepAnakod: true }));

function filesToDataUrls(fileList, kindLabel) {
  const files = Array.from(fileList || []);
  if (files.length === 0) return Promise.resolve([]);
  if (files.length > MAX_IMAGE_COUNT) {
    throw new Error(`${kindLabel}: En fazla ${MAX_IMAGE_COUNT} dosya yükleyebilirsiniz (prototip limiti).`);
  }

  const tasks = files.map(f => new Promise((resolve, reject) => {
    if (f.size > MAX_IMAGE_SIZE_BYTES) {
      reject(new Error(`${kindLabel}: '${f.name}' dosyası çok büyük (${Math.round(f.size/1024)} KB). Limit ~${Math.round(MAX_IMAGE_SIZE_BYTES/1024)} KB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve({ name: f.name, type: f.type, size: f.size, dataUrl: reader.result });
    reader.onerror = () => reject(new Error(`${kindLabel}: '${f.name}' okunamadı.`));
    reader.readAsDataURL(f);
  }));

  return Promise.all(tasks);
}

buluntuGorsel.addEventListener("change", () => {
  const count = buluntuGorsel.files?.length || 0;
  gorselHint.textContent = count ? `${count} dosya seçildi.` : "";
});
buluntuCizim.addEventListener("change", () => {
  const count = buluntuCizim.files?.length || 0;
  cizimHint.textContent = count ? `${count} dosya seçildi.` : "";
});

function getQueryEditId() {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("id");
  } catch {
    return null;
  }
}

function applyEditMode(rec) {
  if (!rec) return;
  editId = rec.id;
  pageTitle.textContent = "Buluntu Düzenle";
  editHint.textContent = `Düzenleme modu: ${rec.fullBuluntuNo}`;
  btnSave.textContent = "Güncelle";

  if (rec.anakodId) anakodSelect.value = rec.anakodId;

  const meta = getSelectedAnakodMeta();
  buluntuYeriLocked.value = meta?.buluntuYeri || rec.buluntuYeri || "";
  buluntuNo.value = rec.buluntuNoRaw || rec.fullBuluntuNo?.slice(3) || "";

  buluntuTarihi.value = rec.buluntuTarihi || "";
  kaziEnvanterNo.value = rec.kaziEnvanterNo || "";
  formObje.value = rec.formObje || "";
  uretimYeri.value = rec.uretimYeri || "";
  tip.value = rec.tip || "";

  planKare.value = rec.planKare || "";
  seviye.value = rec.seviye || "";
  eserTarihi.value = rec.eserTarihi || "";
  sube.value = rec.sube || "";
  muzeEnvanterNo.value = rec.muzeEnvanterNo || "";
  yapimMalzemesi.value = rec.yapimMalzemesi || "";
  donem.value = rec.donem || "";
  buluntuSekli.value = rec.buluntuSekli || "";
  tabaka.value = rec.tabaka || "";
  mezarNo.value = rec.mezarNo || "";
  buluntuYeriDiger.value = rec.buluntuYeriDiger || "";

  const o = rec.olcuRenk || {};
  if (o.yukseklik) { yukseklikVal.value = o.yukseklik.value || ""; yukseklikUnit.value = o.yukseklik.unit || "mm"; }
  if (o.agizCapi) { agizCapiVal.value = o.agizCapi.value || ""; agizCapiUnit.value = o.agizCapi.unit || "mm"; }
  if (o.dipCapi) { dipCapiVal.value = o.dipCapi.value || ""; dipCapiUnit.value = o.dipCapi.unit || "mm"; }
  if (o.kalinlik) { kalinlikVal.value = o.kalinlik.value || ""; kalinlikUnit.value = o.kalinlik.unit || "mm"; }
  if (o.uzunluk) { uzunlukVal.value = o.uzunluk.value || ""; uzunlukUnit.value = o.uzunluk.unit || "mm"; }
  if (o.genislik) { genislikVal.value = o.genislik.value || ""; genislikUnit.value = o.genislik.unit || "mm"; }
  if (o.cap) { capVal.value = o.cap.value || ""; capUnit.value = o.cap.unit || "mm"; }
  if (o.agirlik) { agirlikVal.value = o.agirlik.value || ""; agirlikUnit.value = o.agirlik.unit || "g"; }
  hamurRengi.value = o.hamurRengi || "";
  astarRengi.value = o.astarRengi || "";

  kalipYonu.value = rec.kalipYonu || "";
  digerRenk.value = rec.digerRenk || "";
  tanimBezeme.value = rec.tanimBezeme || "";
  kaynakReferans.value = rec.kaynakReferans || "";

  validateUniqHint();
}

btnSave.addEventListener("click", async () => {
  setMsg("");

  const meta = getSelectedAnakodMeta();
  if (!meta) return setMsg("Anakod seçiniz.", true);

  const numPad = padBuluntuNo(buluntuNo.value);
  if (!numPad) return setMsg("Buluntu Numarası boş olamaz (örn: 0001).", true);

  const fullNo = `${meta.anakod}${numPad}`;
  if (existsBuluntuNo(fullNo, editId)) return setMsg(`Bu buluntu numarası zaten mevcut: ${fullNo}`, true);

  try {
    btnSave.disabled = true;
    btnSave.textContent = editId ? "Güncelleniyor..." : "Kaydediliyor...";

    const newGorsel = await filesToDataUrls(buluntuGorsel.files, "Buluntu Görseli");
    const newCizim = await filesToDataUrls(buluntuCizim.files, "Buluntu Çizim");

    let existing = null;
    if (editId) existing = getBuluntuById(editId);

    const payload = {
      anakod: meta.anakod,
      anakodId: meta.anakodId,
      fullBuluntuNo: fullNo,
      buluntuNoRaw: numPad,

      buluntuTarihi: buluntuTarihi.value || "",
      kaziEnvanterNo: (kaziEnvanterNo.value || "").trim(),
      formObje: (formObje.value || "").trim(),
      uretimYeri: (uretimYeri.value || "").trim(),
      tip: (tip.value || "").trim(),
      buluntuYeri: meta.buluntuYeri,

      planKare: (planKare.value || "").trim(),
      seviye: (seviye.value || "").trim(),
      eserTarihi: (eserTarihi.value || "").trim(),
      sube: (sube.value || "").trim(),
      muzeEnvanterNo: (muzeEnvanterNo.value || "").trim(),
      yapimMalzemesi: (yapimMalzemesi.value || "").trim(),
      donem: (donem.value || "").trim(),
      buluntuSekli: (buluntuSekli.value || "").trim(),
      tabaka: (tabaka.value || "").trim(),
      mezarNo: (mezarNo.value || "").trim(),
      buluntuYeriDiger: (buluntuYeriDiger.value || "").trim(),

      olcuRenk: {
        yukseklik: { value: yukseklikVal.value, unit: yukseklikUnit.value },
        agizCapi: { value: agizCapiVal.value, unit: agizCapiUnit.value },
        dipCapi: { value: dipCapiVal.value, unit: dipCapiUnit.value },
        kalinlik: { value: kalinlikVal.value, unit: kalinlikUnit.value },
        uzunluk: { value: uzunlukVal.value, unit: uzunlukUnit.value },
        genislik: { value: genislikVal.value, unit: genislikUnit.value },
        cap: { value: capVal.value, unit: capUnit.value },
        agirlik: { value: agirlikVal.value, unit: agirlikUnit.value },
        hamurRengi: (hamurRengi.value || "").trim(),
        astarRengi: (astarRengi.value || "").trim()
      },
      kalipYonu: (kalipYonu.value || "").trim(),
      digerRenk: (digerRenk.value || "").trim(),
      tanimBezeme: (tanimBezeme.value || "").trim(),
      kaynakReferans: (kaynakReferans.value || "").trim(),

      gorsel: (newGorsel.length ? newGorsel : (existing?.gorsel || [])),
      cizim: (newCizim.length ? newCizim : (existing?.cizim || []))
    };

    let rec;
    if (editId) {
      rec = updateBuluntuRecord(editId, payload);
      setMsg(`${rec.fullBuluntuNo} buluntu numarası başarı ile güncellendi.`);
    } else {
      rec = createBuluntuRecord(payload);
      setMsg(`${rec.fullBuluntuNo} buluntu numarası başarı ile kayıt edildi.`);
      clearForm({ keepAnakod: true, keepMsg: true });
      buluntuNo.focus();
    }
  } catch (e) {
    setMsg(e.message || "İşlem başarısız oldu.", true);
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = editId ? "Güncelle" : "Kaydet";
  }
});

fillOptions(formObje, FORM_OBJE_OPTIONS);
fillOptions(uretimYeri, URETIM_YERI_OPTIONS);
fillOptions(tip, TIP_OPTIONS);
fillOptions(yapimMalzemesi, YAPIM_MALZEMESI_OPTIONS);
fillOptions(donem, DONEM_OPTIONS);
fillOptions(buluntuSekli, BULUNTU_SEKLI_OPTIONS);
fillOptions(hamurRengi, RENK_OPTIONS);
fillOptions(astarRengi, RENK_OPTIONS);

fillAnakodOptions();
validateUniqHint();

const qid = getQueryEditId();
if (qid) {
  const rec = getBuluntuById(qid);
  if (rec) applyEditMode(rec);
  else setMsg("Düzenlenecek kayıt bulunamadı.", true);
}
