import { renderHeader, setupHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { createI18n } from "./i18n/index.js";
import { renderHomePage, setupHomePage } from "./pages/home.js";
import { renderProjectsPage, setupProjectsPage } from "./pages/projects.js";
import { renderProjectDetailPage, setupProjectDetailPage } from "./pages/project-detail.js";
import { renderResumePage, setupResumePage } from "./pages/resume.js";
import { setupProjectCards } from "./components/project-card.js";
import { setupCorona } from "./components/corona.js";
import { getRoute, startRouter } from "./router.js";
import { setupRevealAnimations } from "./reveal.js";
import { siteConfig } from "../site.config.js";

export function createApp(root) {
  const i18n = createI18n();
  let stopRouter = () => {};

  function render(options = {}) {
    const previousScroll = options.preserveScroll ? window.scrollY : null;
    const route = getRoute();
    if (route.page !== "project") {
      document.title = route.page === "projects"
        ? `${i18n.t("nav.projects")} — ${siteConfig.identity.name}`
        : route.page === "resume"
          ? `${i18n.t("nav.resume")} — ${siteConfig.identity.name}`
          : i18n.t("meta.title");
    }
    const page = route.page === "projects"
      ? renderProjectsPage(i18n, route)
      : route.page === "project"
        ? renderProjectDetailPage(i18n, route)
        : route.page === "resume"
          ? renderResumePage(i18n)
          : renderHomePage(i18n);

    root.innerHTML = `
      <div class="site-shell">
        ${renderHeader(i18n, route)}
        <main id="main-content">${page}</main>
        ${renderFooter(i18n)}
      </div>
    `;

    setupHeader(root, i18n, () => render({ preserveScroll: true }));

    if (route.page === "projects") {
      setupProjectsPage(root, i18n, setupIndexInteractions);
    } else if (route.page === "project") {
      setupProjectDetailPage(root);
    } else if (route.page === "resume") {
      setupResumePage(root);
    } else {
      setupHomePage(root);
    }

    setupProjectCards(root);
    setupCorona(root);
    setupRevealAnimations(root);
    restoreScroll(route, previousScroll);
  }

  function setupIndexInteractions(index) {
    setupProjectCards(index);
    setupCorona(index);
    setupRevealAnimations(index);
  }

  return {
    start() {
      stopRouter = startRouter(render);
      render();
    },
    stop() {
      stopRouter();
    },
  };
}

function restoreScroll(route, previousScroll) {
  requestAnimationFrame(() => {
    if (previousScroll !== null) {
      window.scrollTo({ top: previousScroll, behavior: "instant" });
      return;
    }

    if (route.section) {
      document.querySelector(`#${route.section}`)?.scrollIntoView();
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  });
}
