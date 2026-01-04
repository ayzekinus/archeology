const A = "A".charCodeAt(0);
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

export function getNextUnusedCode(state) {
  const used = state.usedCodes || {};
  const start = Number.isInteger(state.lastIndex) ? state.lastIndex + 1 : 0;

  for (let i = start; i < TOTAL; i++) {
    const code = indexToCode(i);
    if (!used[code]) return { code, index: i };
  }
  throw new Error("Tüm anakodlar tüketildi (AAA–ZZZ).");
}
