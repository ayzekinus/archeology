class SiteNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="nav">
        <a href="/index.html">Ana Sayfa</a>
        <a href="/pages/anakod.html">Anakod</a>
      </nav>
    `;
  }
}
customElements.define("site-nav", SiteNav);
