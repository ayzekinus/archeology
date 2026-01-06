const KEY = "arkeoloji_buluntu_records_v5";

function nowISO() {
  return new Date().toISOString();
}

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveAll(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function listBuluntuRecords() {
  const arr = loadAll();
  return arr.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

export function getBuluntuById(id) {
  return loadAll().find(x => x.id === id) || null;
}

export function existsBuluntuNo(fullBuluntuNo, excludeId = null) {
  const target = String(fullBuluntuNo || "").toUpperCase();
  if (!target) return false;
  return loadAll().some(r => String(r.fullBuluntuNo || "").toUpperCase() === target && r.id !== excludeId);
}

function normalizeRecord(payload, prev = null) {
  const base = prev || {};
  return {
    id: base.id || crypto.randomUUID(),
    createdAt: base.createdAt || nowISO(),
    updatedAt: nowISO(),

    anakod: payload.anakod ?? base.anakod ?? "",
    anakodId: payload.anakodId ?? base.anakodId ?? "",
    fullBuluntuNo: payload.fullBuluntuNo ?? base.fullBuluntuNo ?? "",
    buluntuNoRaw: payload.buluntuNoRaw ?? base.buluntuNoRaw ?? "",

    buluntuTarihi: payload.buluntuTarihi ?? base.buluntuTarihi ?? "",
    formType: payload.formType ?? base.formType ?? "GENEL",

    isActive: payload.isActive ?? base.isActive ?? true,
    isInventory: payload.isInventory ?? base.isInventory ?? false,

    processType: payload.processType ?? base.processType ?? "",
    productionSite: payload.productionSite ?? base.productionSite ?? "",
    findingShape: payload.findingShape ?? base.findingShape ?? "",

    // prototype & general
    kaziEnvanterNo: payload.kaziEnvanterNo ?? base.kaziEnvanterNo ?? "",
    muzeEnvanterNo: payload.muzeEnvanterNo ?? base.muzeEnvanterNo ?? "",
    formObje: payload.formObje ?? base.formObje ?? "",
    uretimYeri: payload.uretimYeri ?? base.uretimYeri ?? "",
    tip: payload.tip ?? base.tip ?? "",

    buluntuYeri: payload.buluntuYeri ?? base.buluntuYeri ?? "",
    planKare: payload.planKare ?? base.planKare ?? "",
    seviye: payload.seviye ?? base.seviye ?? "",
    eserTarihi: payload.eserTarihi ?? base.eserTarihi ?? "",
    sube: payload.sube ?? base.sube ?? "",
    yapimMalzemesi: payload.yapimMalzemesi ?? base.yapimMalzemesi ?? "",
    donem: payload.donem ?? base.donem ?? "",
    buluntuSekli: payload.buluntuSekli ?? base.buluntuSekli ?? "",
    tabaka: payload.tabaka ?? base.tabaka ?? "",
    mezarNo: payload.mezarNo ?? base.mezarNo ?? "",
    buluntuYeriDiger: payload.buluntuYeriDiger ?? base.buluntuYeriDiger ?? "",

    olcuRenk: payload.olcuRenk ?? base.olcuRenk ?? {},

    kalipYonu: payload.kalipYonu ?? base.kalipYonu ?? "",
    digerRenk: payload.digerRenk ?? base.digerRenk ?? "",
    tanimBezeme: payload.tanimBezeme ?? base.tanimBezeme ?? "",
    kaynakReferans: payload.kaynakReferans ?? base.kaynakReferans ?? "",

    notes: payload.notes ?? base.notes ?? "",
    sourceAndReference: payload.sourceAndReference ?? base.sourceAndReference ?? "",

    coin: payload.coin ?? base.coin ?? {},
    ceramic: payload.ceramic ?? base.ceramic ?? {},
    grave: payload.grave ?? base.grave ?? {},

    gorsel: payload.gorsel ?? base.gorsel ?? [],
    cizim: payload.cizim ?? base.cizim ?? [],
  };
}

export function createBuluntuRecord(payload) {
  const arr = loadAll();
  const rec = normalizeRecord(payload);
  arr.push(rec);
  saveAll(arr);
  return rec;
}

export function updateBuluntuRecord(id, payload) {
  const arr = loadAll();
  const idx = arr.findIndex(x => x.id === id);
  if (idx === -1) throw new Error("Kayıt bulunamadı.");
  const rec = normalizeRecord(payload, arr[idx]);
  arr[idx] = rec;
  saveAll(arr);
  return rec;
}

export function deleteBuluntuRecord(id) {
  const arr = loadAll();
  saveAll(arr.filter(x => x.id !== id));
}

export function resetBuluntuForDemo() {
  localStorage.removeItem(KEY);
}
