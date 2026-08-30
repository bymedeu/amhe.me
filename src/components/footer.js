import { siteConfig } from "../../site.config.js";

export function renderFooter({ t }) {
  return `
    <footer class="footer border-section">
      <div class="container footer-inner">
        <a class="brand" href="#/"><span class="brand-mark" aria-hidden="true"></span><span>${siteConfig.identity.name}</span></a>
        <a href="mailto:${siteConfig.contact.recruiterAccessEmail}">${siteConfig.contact.recruiterAccessEmail}</a>
        <p>© ${new Date().getFullYear()} ${siteConfig.identity.name}</p>
      </div>
    </footer>
  `;
}
