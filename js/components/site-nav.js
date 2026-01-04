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

        <div class="groupTitle">Anakod</div>
        <a href="${base}/pages/anakod.html">Anakod</a>

        <div class="groupTitle">Buluntu</div>
        <a href="${base}/pages/buluntu-create.html">Buluntu Oluştur</a>
        <a href="${base}/pages/buluntu-list.html">Buluntu Listele</a>
        <a href="${base}/pages/envanterlik.html">Envanterlik Eser</a>
      </nav>
    `;
  }
}
customElements.define("site-nav", SiteNav);
