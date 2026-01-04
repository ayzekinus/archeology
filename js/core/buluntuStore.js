import { getJSON, setJSON, removeKey } from "./storage.js";

const KEY = "ark_buluntu_store_v1";

function emptyStore() {
  return {
    records: []
  };
}

export function loadStore() {
  return getJSON(KEY, emptyStore());
}

function saveStore(store) {
  setJSON(KEY, store);
}

export function resetBuluntuForDemo() {
  removeKey(KEY);
}

function makeId() {
  return "id-" + crypto.getRandomValues(new Uint32Array(4)).join("-");
}

export function existsBuluntuNo(fullBuluntuNo) {
  const store = loadStore();
  const key = String(fullBuluntuNo || "").trim().toUpperCase();
  if (!key) return false;
  return (store.records || []).some(r => String(r.fullBuluntuNo).toUpperCase() === key);
}

export function createBuluntuRecord(payload) {
  const store = loadStore();

  const fullNo = String(payload.fullBuluntuNo || "").trim().toUpperCase();
  if (!fullNo) throw new Error("Buluntu numarası boş olamaz.");
  if (existsBuluntuNo(fullNo)) throw new Error(`Bu buluntu numarası zaten mevcut: ${fullNo}`);

  const rec = {
    id: makeId(),
    anakod: payload.anakod,
    anakodId: payload.anakodId || "",
    fullBuluntuNo: fullNo,
    buluntuNoRaw: payload.buluntuNoRaw || "",
    buluntuTarihi: payload.buluntuTarihi || "",
    kaziEnvanterNo: payload.kaziEnvanterNo || "",
    formObje: payload.formObje || "",
    uretimYeri: payload.uretimYeri || "",
    tip: payload.tip || "",
    buluntuYeri: payload.buluntuYeri || "",
    planKare: payload.planKare || "",
    seviye: payload.seviye || "",
    eserTarihi: payload.eserTarihi || "",
    sube: payload.sube || "",
    muzeEnvanterNo: payload.muzeEnvanterNo || "",
    yapimMalzemesi: payload.yapimMalzemesi || "",
    donem: payload.donem || "",
    buluntuSekli: payload.buluntuSekli || "",
    tabaka: payload.tabaka || "",
    mezarNo: payload.mezarNo || "",
    buluntuYeriDiger: payload.buluntuYeriDiger || "",

    olcuRenk: payload.olcuRenk || {},
    kalipYonu: payload.kalipYonu || "",
    digerRenk: payload.digerRenk || "",
    tanimBezeme: payload.tanimBezeme || "",
    kaynakReferans: payload.kaynakReferans || "",

    gorsel: payload.gorsel || [],
    cizim: payload.cizim || [],

    createdAt: new Date().toISOString()
  };

  store.records.unshift(rec);
  saveStore(store);
  return rec;
}

export function listBuluntuRecords() {
  return loadStore().records || [];
}

export function exportBuluntuAsJSON() {
  return loadStore();
}
