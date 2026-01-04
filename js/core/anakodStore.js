import { getJSON, setJSON, removeKey } from "./storage.js";
import { getNextUnusedCode } from "./anakodSeq.js";

const KEY = "ark_anakod_store_v1";

function emptyStore() {
  return {
    lastIndex: null,
    usedCodes: {}, // verilen kod asla tekrar verilmez
    records: []
  };
}

export function loadStore() {
  return getJSON(KEY, emptyStore());
}

function saveStore(store) {
  setJSON(KEY, store);
}

export function resetStoreForDemo() {
  removeKey(KEY);
}

function makeId() {
  return "id-" + crypto.getRandomValues(new Uint32Array(4)).join("-");
}

export function createAnakodRecord(payload) {
  const store = loadStore();
  const { code, index } = getNextUnusedCode(store);

  const record = {
    id: makeId(),
    anakod: code,
    buluntuYeri: payload.buluntuYeri,
    planKare: payload.planKare,
    tabaka: payload.tabaka || "",
    seviye: payload.seviye || "",
    mezarNo: payload.mezarNo || "",
    aciklama: payload.aciklama || "",
    gis: payload.gis || "",
    createdAt: new Date().toISOString()
  };

  store.lastIndex = index;
  store.usedCodes[code] = true;
  store.records.unshift(record);

  saveStore(store);
  return record;
}

export function listRecords() {
  return loadStore().records || [];
}

export function exportAsJSON() {
  return loadStore();
}
