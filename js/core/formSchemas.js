export const FORM_SCHEMAS = {
  GENEL: { show: ["common"] },
  SIKKE: { show: ["common", "coin"] },
  SERAMIK: { show: ["common", "ceramic"] },
  MEZAR: { show: ["common", "grave"] }
};

export function resolveSchema(formType) {
  const k = (formType || "GENEL").toUpperCase();
  return FORM_SCHEMAS[k] || FORM_SCHEMAS.GENEL;
}
