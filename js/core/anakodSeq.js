const A = "A".charCodeAt(0);
const Z = "Z".charCodeAt(0);
const TOTAL = 26 * 26 * 26; // 17576

export function indexToCode(index) {
  if (!Number.isInteger(index) || index < 0 || index >= TOTAL) {
    throw new Error("Anakod aralığı aşıldı (AAA–ZZZ).");
  }
  const d0 = Math.floor(index / (26 * 26));
  const d1 = Math.floor((index % (26 * 26)) / 26);
  const d2 = index % 26;

  return String.fromCharCode(A + d0, A + d1, A + d2);
}

export function codeToIndex(code) {
  if (typeof code !== "string" || code.length !== 3) throw new Error("Kod formatı AAA olmalı.");
  const c0 = code.charCodeAt(0), c1 = code.charCodeAt(1), c2 = code.charCodeAt(2);
  if (c0 < A || c0 > Z || c1 < A || c1 > Z || c2 < A || c2 > Z) throw new Error("Kod yalnızca A–Z olmalı.");
  return (c0 - A) * 26 * 26 + (c1 - A) * 26 + (c2 - A);
}

export function getNextUnusedCode(state) {
  // state: { lastIndex: number|null, usedCodes: Record<string,true> }
  const used = state.usedCodes || {};
  let start = Number.isInteger(state.lastIndex) ? state.lastIndex + 1 : 0;

  for (let i = start; i < TOTAL; i++) {
    const code = indexToCode(i);
    if (!used[code]) return { code, index: i };
  }
  throw new Error("Tüm anakodlar tüketildi (AAA–ZZZ).");
}
