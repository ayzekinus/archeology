function getBasePath() {
  const p = new URL(import.meta.url).pathname;
  const parts = p.split("/js/");
  const base = parts[0] || "";
  return base || "/archeology";
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    const base = getBasePath();
    this.innerHTML = `
      <nav class="nav">
        <a href="${base}/">Ana Sayfa</a>
        <a href="${base}/pages/anakod.html">Anakod</a>
      </nav>
    `;
  }
}
customElements.define("site-nav", SiteNav);
