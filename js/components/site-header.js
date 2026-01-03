class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <div class="brand">Arkeoloji | Anakod Prototip</div>
      </header>
    `;
  }
}
customElements.define("site-header", SiteHeader);
