import { getJSON, setJSON, removeKey } from "./storage.js";

const KEY = "ark_buluntu_store_v1";

function emptyStore() {
  return { records: [] };
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

export function existsBuluntuNo(fullBuluntuNo, excludeId = null) {
  const store = loadStore();
  const key = String(fullBuluntuNo || "").trim().toUpperCase();
  if (!key) return false;
  return (store.records || []).some(r =>
    String(r.fullBuluntuNo).toUpperCase() === key &&
    (!excludeId || r.id !== excludeId)
  );
}

export function createBuluntuRecord(payload) {
  const store = loadStore();
  const fullNo = String(payload.fullBuluntuNo || "").trim().toUpperCase();
  if (!fullNo) throw new Error("Buluntu numarası boş olamaz.");
  if (existsBuluntuNo(fullNo)) throw new Error(`Bu buluntu numarası zaten mevcut: ${fullNo}`);

  const rec = normalizeRecord({ ...payload, id: makeId(), fullBuluntuNo: fullNo, createdAt: new Date().toISOString() });
  store.records.unshift(rec);
  saveStore(store);
  return rec;
}

export function updateBuluntuRecord(id, payload) {
  const store = loadStore();
  const idx = (store.records || []).findIndex(r => r.id === id);
  if (idx < 0) throw new Error("Kayıt bulunamadı.");

  const existing = store.records[idx];
  const fullNo = String(payload.fullBuluntuNo || existing.fullBuluntuNo || "").trim().toUpperCase();
  if (!fullNo) throw new Error("Buluntu numarası boş olamaz.");
  if (existsBuluntuNo(fullNo, id)) throw new Error(`Bu buluntu numarası zaten mevcut: ${fullNo}`);

  const merged = {
    ...existing,
    ...payload,
    id,
    fullBuluntuNo: fullNo,
    updatedAt: new Date().toISOString()
  };
  store.records[idx] = normalizeRecord(merged);
  saveStore(store);
  return store.records[idx];
}

export function deleteBuluntuRecord(id) {
  const store = loadStore();
  const before = store.records.length;
  store.records = (store.records || []).filter(r => r.id !== id);
  if (store.records.length === before) throw new Error("Kayıt bulunamadı.");
  saveStore(store);
  return true;
}

export function getBuluntuById(id) {
  const store = loadStore();
  return (store.records || []).find(r => r.id === id) || null;
}

export function listBuluntuRecords() {
  return loadStore().records || [];
}

export function exportBuluntuAsJSON() {
  return loadStore();
}

function normalizeRecord(payload) {
  return {
    id: payload.id,
    anakod: payload.anakod || "",
    anakodId: payload.anakodId || "",
    fullBuluntuNo: payload.fullBuluntuNo || "",
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

    createdAt: payload.createdAt || "",
    updatedAt: payload.updatedAt || ""
  };
}
