import {
  FORM_OBJE_OPTIONS, URETIM_YERI_OPTIONS, TIP_OPTIONS,
  YAPIM_MALZEMESI_OPTIONS, DONEM_OPTIONS, BULUNTU_SEKLI_OPTIONS,
  RENK_OPTIONS,
  ARTIFACT_FORM_OPTIONS, PRODUCTION_SITE_OPTIONS, PROCESS_TYPE_OPTIONS,
  SURFACE_QUALITY_OPTIONS, BAKING_OPTIONS, TEXTURE_OPTIONS, DENSITY_OPTIONS
} from "../core/config.js";

import { resolveSchema } from "../core/formSchemas.js";
import { listRecords as listAnakodRecords } from "../core/anakodStore.js";
import {
  createBuluntuRecord, updateBuluntuRecord, existsBuluntuNo, getBuluntuById
} from "../core/buluntuStore.js";

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

const formType = document.getElementById("formType");
const isActive = document.getElementById("isActive");
const isInventory = document.getElementById("isInventory");
const processType = document.getElementById("processType");
const productionSite = document.getElementById("productionSite");
const findingShape = document.getElementById("findingShape");

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

const notes = document.getElementById("notes");
const sourceAndReference = document.getElementById("sourceAndReference");

// media
const buluntuGorsel = document.getElementById("buluntuGorsel");
const buluntuCizim = document.getElementById("buluntuCizim");
const gorselHint = document.getElementById("gorselHint");
const cizimHint = document.getElementById("cizimHint");

// sections + fields
const coinSection = document.getElementById("coinSection");
const ceramicSection = document.getElementById("ceramicSection");

const coinCondition = document.getElementById("coinCondition");
const coinUnit = document.getElementById("coinUnit");
const coinDiameterVal = document.getElementById("coinDiameterVal");
const coinDiameterUnit = document.getElementById("coinDiameterUnit");
const coinMoldDirection = document.getElementById("coinMoldDirection");
const coinEmperor = document.getElementById("coinEmperor");
const coinMintingYear = document.getElementById("coinMintingYear");
const coinFrontDef = document.getElementById("coinFrontDef");
const coinBackDef = document.getElementById("coinBackDef");
const coinFrontLegend = document.getElementById("coinFrontLegend");
const coinBackLegend = document.getElementById("coinBackLegend");
const coinMint = document.getElementById("coinMint");
const coinBranch = document.getElementById("coinBranch");
const coinReference = document.getElementById("coinReference");
const coinWeightVal = document.getElementById("coinWeightVal");
const coinWeightUnit = document.getElementById("coinWeightUnit");

const cerClayColor = document.getElementById("cerClayColor");
const cerUndercoatColor = document.getElementById("cerUndercoatColor");
const cerDipintoColor = document.getElementById("cerDipintoColor");
const cerOtherColor = document.getElementById("cerOtherColor");
const cerSurfaceColor = document.getElementById("cerSurfaceColor");
const cerGlazeColor = document.getElementById("cerGlazeColor");
const cerPatternColor = document.getElementById("cerPatternColor");
const cerSurfaceQuality = document.getElementById("cerSurfaceQuality");
const cerBaking = document.getElementById("cerBaking");
const cerTexture = document.getElementById("cerTexture");
const cerPore = document.getElementById("cerPore");
const cerClayDef = document.getElementById("cerClayDef");
const cerFormDef = document.getElementById("cerFormDef");
const cerMoreDef = document.getElementById("cerMoreDef");

// buttons
const btnSave = document.getElementById("btnSave");
const btnClear = document.getElementById("btnClear");
const msg = document.getElementById("msg");

const MAX_IMAGE_COUNT = 6;
const MAX_IMAGE_SIZE_BYTES = 800_000;

let editId = null;

function setMsg(text, isError = false) {
  msg.textContent = text || "";
  msg.classList.toggle("error", !!isError);
}

function fillOptions(selectEl, options) {
  if (!selectEl) return;
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

  anakodHint.textContent = anakodRecords.length
    ? "Anakod seçtiğinizde sadece Buluntu Yeri otomatik gelir (diğer alanlar gelmez)."
    : "Henüz anakod kaydı yok. Önce Anakod sayfasından kayıt oluşturun.";
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
  return digits.length >= 4 ? digits : digits.padStart(4, "0");
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

function applyFormVisibility() {
  const schema = resolveSchema(formType?.value || "GENEL");
  const show = new Set(schema.show || ["common"]);
  if (coinSection) coinSection.style.display = show.has("coin") ? "" : "none";
  if (ceramicSection) ceramicSection.style.display = show.has("ceramic") ? "" : "none";
}

anakodSelect.addEventListener("change", () => {
  const meta = getSelectedAnakodMeta();
  buluntuYeriLocked.value = meta?.buluntuYeri || "";
  validateUniqHint();
});
buluntuNo.addEventListener("input", validateUniqHint);
formType?.addEventListener("change", applyFormVisibility);

function clearForm({ keepAnakod = true, keepMsg = false } = {}) {
  if (!keepAnakod) anakodSelect.value = "";
  buluntuNo.value = "";
  buluntuTarihi.value = "";
  kaziEnvanterNo.value = "";
  formObje.value = "";
  uretimYeri.value = "";
  tip.value = "";

  formType.value = formType.value || "GENEL";
  isActive.value = "true";
  isInventory.value = "false";
  processType.value = "";
  productionSite.value = "";
  findingShape.value = "";

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

  notes.value = "";
  sourceAndReference.value = "";

  if (coinCondition) {
    coinCondition.value = ""; coinUnit.value = ""; coinDiameterVal.value = ""; coinDiameterUnit.value = "";
    coinMoldDirection.value = ""; coinEmperor.value = ""; coinMintingYear.value = "";
    coinFrontDef.value = ""; coinBackDef.value = ""; coinFrontLegend.value = ""; coinBackLegend.value = "";
    coinMint.value = ""; coinBranch.value = ""; coinReference.value = "";
    coinWeightVal.value = ""; coinWeightUnit.value = "";
  }

  if (cerClayColor) {
    cerClayColor.value = ""; cerUndercoatColor.value = ""; cerDipintoColor.value = "";
    cerOtherColor.value = ""; cerSurfaceColor.value = ""; cerGlazeColor.value = "";
    cerPatternColor.value = ""; cerSurfaceQuality.value = ""; cerBaking.value = "";
    cerTexture.value = ""; cerPore.value = ""; cerClayDef.value = ""; cerFormDef.value = ""; cerMoreDef.value = "";
  }

  buluntuGorsel.value = "";
  buluntuCizim.value = "";
  gorselHint.textContent = "";
  cizimHint.textContent = "";

  if (!keepMsg) setMsg("");
  validateUniqHint();
  applyFormVisibility();
}

btnClear.addEventListener("click", () => clearForm({ keepAnakod: true }));

function filesToDataUrls(fileList, kindLabel) {
  const files = Array.from(fileList || []);
  if (files.length === 0) return Promise.resolve([]);
  if (files.length > MAX_IMAGE_COUNT) throw new Error(`${kindLabel}: En fazla ${MAX_IMAGE_COUNT} dosya yükleyebilirsiniz (prototip limiti).`);

  const tasks = files.map(f => new Promise((resolve, reject) => {
    if (f.size > MAX_IMAGE_SIZE_BYTES) return reject(new Error(`${kindLabel}: '${f.name}' çok büyük.`));
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
  editId = rec.id;
  pageTitle.textContent = "Buluntu Düzenle";
  editHint.textContent = `Düzenleme modu: ${rec.fullBuluntuNo}`;
  btnSave.textContent = "Güncelle";

  if (rec.anakodId) anakodSelect.value = rec.anakodId;
  const meta = getSelectedAnakodMeta();
  buluntuYeriLocked.value = meta?.buluntuYeri || rec.buluntuYeri || "";
  buluntuNo.value = rec.buluntuNoRaw || "";

  buluntuTarihi.value = rec.buluntuTarihi || "";
  kaziEnvanterNo.value = rec.kaziEnvanterNo || "";
  formObje.value = rec.formObje || "";
  uretimYeri.value = rec.uretimYeri || "";
  tip.value = rec.tip || "";

  formType.value = rec.formType || "GENEL";
  isActive.value = String(rec.isActive ?? true);
  isInventory.value = String(rec.isInventory ?? false);
  processType.value = rec.processType || "";
  productionSite.value = rec.productionSite || "";
  findingShape.value = rec.findingShape || "";

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

  notes.value = rec.notes || "";
  sourceAndReference.value = rec.sourceAndReference || "";

  const c = rec.coin || {};
  if (coinCondition) {
    coinCondition.value = c.condition || "";
    coinUnit.value = c.unit || "";
    coinDiameterVal.value = c.diameter || "";
    coinDiameterUnit.value = c.diameter_unit || "";
    coinMoldDirection.value = c.mold_direction || "";
    coinEmperor.value = c.emperor || "";
    coinMintingYear.value = c.minting_year || "";
    coinFrontDef.value = c.front_face_definition || "";
    coinBackDef.value = c.back_face_definition || "";
    coinFrontLegend.value = c.front_face_legend || "";
    coinBackLegend.value = c.back_face_legend || "";
    coinMint.value = c.mint || "";
    coinBranch.value = c.branch || "";
    coinReference.value = c.reference || "";
    coinWeightVal.value = c.weight || "";
    coinWeightUnit.value = c.weight_unit || "";
  }

  const s = rec.ceramic || {};
  if (cerClayColor) {
    cerClayColor.value = s.clay_color || "";
    cerUndercoatColor.value = s.undercoat_color || "";
    cerDipintoColor.value = s.dipinto_color || "";
    cerOtherColor.value = s.other_color || "";
    cerSurfaceColor.value = s.surface_color || "";
    cerGlazeColor.value = s.glaze_color || "";
    cerPatternColor.value = s.pattern_color || "";
    cerSurfaceQuality.value = s.surface_quality || "";
    cerBaking.value = s.baking || "";
    cerTexture.value = s.texture || "";
    cerPore.value = s.pore || "";
    cerClayDef.value = s.clay_definition || "";
    cerFormDef.value = s.form_definition || "";
    cerMoreDef.value = s.more_definition || "";
  }

  validateUniqHint();
  applyFormVisibility();
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

    const existing = editId ? getBuluntuById(editId) : null;

    const payload = {
      anakod: meta.anakod,
      anakodId: meta.anakodId,
      fullBuluntuNo: fullNo,
      buluntuNoRaw: numPad,

      buluntuTarihi: buluntuTarihi.value || "",
      formType: (formType.value || "GENEL").trim(),

      isActive: (isActive.value === "true"),
      isInventory: (isInventory.value === "true"),
      processType: (processType.value || "").trim(),
      productionSite: (productionSite.value || "").trim(),
      findingShape: (findingShape.value || "").trim(),

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

      notes: (notes.value || "").trim(),
      sourceAndReference: (sourceAndReference.value || "").trim(),

      coin: {
        condition: (coinCondition?.value || "").trim(),
        unit: (coinUnit?.value || "").trim(),
        diameter: (coinDiameterVal?.value || "").trim(),
        diameter_unit: (coinDiameterUnit?.value || "").trim(),
        mold_direction: (coinMoldDirection?.value || "").trim(),
        emperor: (coinEmperor?.value || "").trim(),
        minting_year: (coinMintingYear?.value || "").trim(),
        front_face_definition: (coinFrontDef?.value || "").trim(),
        back_face_definition: (coinBackDef?.value || "").trim(),
        front_face_legend: (coinFrontLegend?.value || "").trim(),
        back_face_legend: (coinBackLegend?.value || "").trim(),
        mint: (coinMint?.value || "").trim(),
        branch: (coinBranch?.value || "").trim(),
        reference: (coinReference?.value || "").trim(),
        weight: (coinWeightVal?.value || "").trim(),
        weight_unit: (coinWeightUnit?.value || "").trim()
      },

      ceramic: {
        clay_color: (cerClayColor?.value || "").trim(),
        undercoat_color: (cerUndercoatColor?.value || "").trim(),
        dipinto_color: (cerDipintoColor?.value || "").trim(),
        other_color: (cerOtherColor?.value || "").trim(),
        surface_color: (cerSurfaceColor?.value || "").trim(),
        glaze_color: (cerGlazeColor?.value || "").trim(),
        pattern_color: (cerPatternColor?.value || "").trim(),
        surface_quality: (cerSurfaceQuality?.value || "").trim(),
        baking: (cerBaking?.value || "").trim(),
        texture: (cerTexture?.value || "").trim(),
        pore: (cerPore?.value || "").trim(),
        clay_definition: (cerClayDef?.value || "").trim(),
        form_definition: (cerFormDef?.value || "").trim(),
        more_definition: (cerMoreDef?.value || "").trim()
      },

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

// init options
fillOptions(formObje, FORM_OBJE_OPTIONS);
fillOptions(uretimYeri, URETIM_YERI_OPTIONS);
fillOptions(tip, TIP_OPTIONS);
fillOptions(yapimMalzemesi, YAPIM_MALZEMESI_OPTIONS);
fillOptions(donem, DONEM_OPTIONS);
fillOptions(buluntuSekli, BULUNTU_SEKLI_OPTIONS);
fillOptions(hamurRengi, RENK_OPTIONS);
fillOptions(astarRengi, RENK_OPTIONS);

fillOptions(formType, ARTIFACT_FORM_OPTIONS);
fillOptions(processType, PROCESS_TYPE_OPTIONS);
fillOptions(productionSite, PRODUCTION_SITE_OPTIONS);

fillOptions(cerClayColor, RENK_OPTIONS);
fillOptions(cerUndercoatColor, RENK_OPTIONS);
fillOptions(cerDipintoColor, RENK_OPTIONS);
fillOptions(cerOtherColor, RENK_OPTIONS);
fillOptions(cerSurfaceColor, RENK_OPTIONS);
fillOptions(cerGlazeColor, RENK_OPTIONS);
fillOptions(cerPatternColor, RENK_OPTIONS);
fillOptions(cerSurfaceQuality, SURFACE_QUALITY_OPTIONS);
fillOptions(cerBaking, BAKING_OPTIONS);
fillOptions(cerTexture, TEXTURE_OPTIONS);
fillOptions(cerPore, DENSITY_OPTIONS);

fillAnakodOptions();
validateUniqHint();
applyFormVisibility();

const qid = getQueryEditId();
if (qid) {
  const rec = getBuluntuById(qid);
  if (rec) applyEditMode(rec);
  else setMsg("Düzenlenecek kayıt bulunamadı.", true);
}
