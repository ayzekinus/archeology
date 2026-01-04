class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <div class="brand">Archeology | Prototip</div>
      </header>
    `;
  }
}
customElements.define("site-header", SiteHeader);
