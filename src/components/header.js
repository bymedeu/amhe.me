import { icons } from "./icons.js";
import { siteConfig } from "../../site.config.js";

export function renderHeader(i18n, route) {
  const { t, language } = i18n;
  const isProjects = route.page === "projects" || route.page === "project";
  const isResume = route.page === "resume";
  const isHome = route.page === "home";

  document.documentElement.lang = language;

  return `
    <header class="nav-wrap" data-nav>
      <nav class="nav container" aria-label="Primary navigation">
        <a class="brand" href="#/" aria-label="${siteConfig.identity.name}, ${t("nav.home")}">
          <span class="brand-mark" aria-hidden="true"></span><span>${siteConfig.identity.name}</span>
        </a>
        <div class="nav-links" id="primary-menu">
          <a href="#/" ${isHome && !route.section ? 'aria-current="page"' : ""}>${t("nav.home")}</a>
          <a href="#/projects" ${isProjects ? 'aria-current="page"' : ""}>${t("nav.projects")}</a>
          <a href="#/resume" ${isResume ? 'aria-current="page"' : ""}>${t("nav.resume")}</a>
        </div>
        <div class="nav-actions">
          <div class="language-switch" role="group" aria-label="${t("nav.language")}">
            <button type="button" data-language="fr" class="${language === "fr" ? "active" : ""}" aria-pressed="${language === "fr"}">FR</button>
            <span>/</span>
            <button type="button" data-language="en" class="${language === "en" ? "active" : ""}" aria-pressed="${language === "en"}">EN</button>
          </div>
          <a class="nav-cta" href="${siteConfig.social.github}" target="_blank" rel="noreferrer">${t("nav.github")}${icons.arrowUpRight}</a>
          <button class="menu-toggle" type="button" aria-controls="primary-menu" aria-expanded="false">
            <span></span><span></span><span class="sr-only">${t("nav.menu")}</span>
          </button>
        </div>
      </nav>
    </header>
  `;
}

export function setupHeader(root, i18n, rerender) {
  const nav = root.querySelector("[data-nav]");
  const menuButton = root.querySelector(".menu-toggle");
  const menu = root.querySelector(".nav-links");
  const updateNav = () => nav?.classList.toggle("scrolled", window.scrollY > 16);

  updateNav();
  window.onscroll = updateNav;

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menu?.classList.toggle("open", !isOpen);
  });

  root.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.language === i18n.language) return;
      i18n.setLanguage(button.dataset.language);
      rerender();
    });
  });
}
