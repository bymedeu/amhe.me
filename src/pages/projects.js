import { renderProjectCard } from "../components/project-card.js";
import { getTopicTags, projectLanguageTags, projects } from "../data/projects.js";
import { projectFilterUrl, parseProjectFilters } from "../router.js";
import { githubSnapshot } from "../data/github-stats.js";
import { siteConfig } from "../../site.config.js";

import { normalizeFilters, matchingProjects, toggleFilter } from "../data/project-filters.js";

export function renderProjectsPage(i18n, route) {
  return `
    <section class="projects-hero container">
      <p class="eyebrow reveal">${i18n.t("projects.eyebrow")}</p>
      <h1 class="reveal reveal-delay-1">${i18n.t("projects.title")}</h1>
    </section>
    ${renderGithubSnapshot(i18n)}
    <p class="sr-only" data-filter-announcement role="status" aria-live="polite" aria-atomic="true"></p>
    ${renderProjectIndex(i18n, route)}
  `;
}

export function renderProjectIndex(i18n, route) {
  const { t } = i18n;
  const filters = normalizeFilters(route);
  const visibleProjects = matchingProjects(filters);
  const control = (key, label, next, active, count, disabled = false, className = "filter-chip") =>
    `<button type="button" data-project-filter data-filter-key="${key}" data-filter-href="${projectFilterUrl(next)}"
      class="${className} ${active ? "active" : ""}" aria-pressed="${active}" ${disabled ? "disabled" : ""}>${label}<span>${count}</span></button>`;
  const group = (key, values, label, allLabel) => `
    <div class="project-filter-group reveal">
      <p>${label}</p><div class="filter-list" role="group" aria-label="${label}">
        ${control(key + "-all", allLabel, { ...filters, [key]: [] }, !filters[key].length, matchingProjects({ ...filters, [key]: [] }).length)}
        ${values.map((value) => {
          const selected = filters[key].includes(value);
          const next = toggleFilter(filters, key, value);
          const count = selected ? visibleProjects.length : matchingProjects(next).length;
          return control(key + "-" + value, t(`tags.${value}`), next, selected, count, !selected && count === 0);
        }).join("")}
      </div>
    </div>`;
  return `
    <section class="project-index container">
      <div class="filter-header reveal">
        <div><p class="section-kicker">${t("projects.filter")}</p>
          <p class="result-count">${t("projects.count")(visibleProjects.length)}</p>
        </div>
        <button type="button" data-project-filter data-filter-key="clear" data-filter-href="${projectFilterUrl()}" class="clear-filter">× ${t("projects.clearFilters")}</button>
      </div>
      <div class="visibility-filter reveal" role="group" aria-label="${t("projects.visibility")}">
        ${["all", "public", "private"].map((visibility) => {
          const next = { ...filters, visibility };
          const count = matchingProjects(next).length;
          return control("visibility-" + visibility, t(`projects.${visibility === "all" ? "all" : visibility}Repositories`), next, filters.visibility === visibility, count,
            count === 0 && visibility !== filters.visibility, "visibility-option");
        }).join("")}
      </div>
      ${group("languages", projectLanguageTags, t("projects.programmingLanguage"), t("projects.allLanguages"))}
      ${group("tags", getTopicTags(), t("projects.topics"), t("projects.allTopics"))}
      <div class="all-projects">
        ${visibleProjects.length ? visibleProjects.map((project) => renderProjectCard(project, i18n, { filters })).join("")
          : `<p class="empty-state">${t("projects.empty")}</p>`}
      </div>
    </section>`;
}

export function setupProjectsPage(root, i18n, setupIndexInteractions = () => {}) {
  refreshGithubSnapshot(root).catch(() => {
    // The checked-in fallback remains visible if the SVG cannot be fetched.
  });

  bindProjectFilters(root, i18n, setupIndexInteractions);
}

function bindProjectFilters(scope, i18n, setupIndexInteractions) {
  scope.querySelectorAll("[data-project-filter]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();

      if (link.disabled) return;
      const focusKey = link.dataset.filterKey;
      const openIds = [...scope.querySelectorAll(".project-card[open]")].map((entry) => entry.dataset.project);
      const href = link.dataset.filterHref ?? link.getAttribute("href");
      const route = parseProjectFilterHref(href);
      const currentIndex = document.querySelector(".project-index");
      if (!currentIndex) return;

      window.history.pushState({ projectFilters: true }, "", href);
      const template = document.createElement("template");
      template.innerHTML = renderProjectIndex(i18n, route).trim();
      const nextIndex = template.content.firstElementChild;
      currentIndex.replaceWith(nextIndex);
      const announcement = document.querySelector("[data-filter-announcement]");
      if (announcement) announcement.textContent = i18n.t("projects.count")(matchingProjects(route).length);
      bindProjectFilters(nextIndex, i18n, setupIndexInteractions);
      setupIndexInteractions(nextIndex);
      nextIndex.querySelectorAll(".project-card").forEach((entry) => { entry.open = openIds.includes(entry.dataset.project); });
      const focusTarget = [...nextIndex.querySelectorAll("[data-filter-key]")].find((item) => item.dataset.filterKey === focusKey);
      (focusTarget ?? nextIndex.querySelector("[data-filter-key=clear]"))?.focus({ preventScroll: true });
    });
  });
}

function parseProjectFilterHref(href) {
  const query = href.split("?")[1] ?? "";
  const params = new URLSearchParams(query);
  return {
    page: "projects",
    ...parseProjectFilters(params),
  };
}

function renderGithubSnapshot({ language, t }) {
  const format = new Intl.NumberFormat(language);

  return `
    <section class="github-snapshot border-section">
      <div class="container github-snapshot-grid">
        <div class="github-snapshot-intro reveal">
          <p class="section-kicker">${t("projects.githubKicker")}</p>
          <h2>${t("projects.githubTitle")}</h2>
        </div>
        <div class="github-metrics reveal reveal-delay-1">
          ${renderMetric("commits", githubSnapshot.commits, t("projects.commits"), format)}
          ${renderMetric("pullRequests", githubSnapshot.pullRequests, t("projects.pullRequests"), format)}
          ${renderMetric("contributedRepositories", githubSnapshot.contributedRepositories, t("projects.repositories"), format)}
          ${renderMetric("languages", githubSnapshot.languages, t("projects.languagesUsed"), format)}
        </div>
        <div class="github-languages reveal reveal-delay-2">
          <p class="section-kicker">${t("projects.languageMix")}</p>
          <div data-language-mix>${renderLanguageMix(githubSnapshot.topLanguages, format)}</div>
        </div>
      </div>
    </section>
  `;
}

function renderMetric(key, value, label, format) {
  return `<div class="github-metric"><strong data-github-metric="${key}">${format.format(value)}</strong><span>${label}</span></div>`;
}

function renderLanguageMix(languages, format) {
  return `
    <div class="language-bar" aria-hidden="true">
      ${languages.map((item) => `<i style="--share:${item.percentage};--language-color:${item.color}"></i>`).join("")}
    </div>
    <div class="language-legend">
      ${languages.map((item) => `<div><i style="--language-color:${item.color}"></i><span>${item.name}</span><strong>${format.format(item.percentage)}%</strong></div>`).join("")}
    </div>
  `;
}

async function refreshGithubSnapshot(root) {
  const response = await fetch(siteConfig.githubMetricsUrl, { cache: "no-cache" });
  if (!response.ok) return;

  const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
  const text = svg.documentElement.textContent.replace(/\s+/g, " ");
  const metrics = {
    commits: readNumber(text, /([\d,]+) Commits/),
    pullRequests: readNumber(text, /([\d,]+) Pull requests opened/),
    contributedRepositories: readNumber(text, /Contributed to ([\d,]+) repositories/),
    languages: readNumber(text, /([\d,]+) Languages/),
  };

  for (const [key, value] of Object.entries(metrics)) {
    if (value == null) continue;
    const target = root.querySelector(`[data-github-metric="${key}"]`);
    if (target) target.textContent = new Intl.NumberFormat(document.documentElement.lang).format(value);
  }

  const languages = [...svg.querySelectorAll(".language.details")].map((entry) => {
    const label = entry.querySelector("div.field")?.textContent.trim();
    const detail = entry.querySelector("small")?.textContent.replace(/\s+/g, " ").trim();
    const percentage = Number(detail?.match(/([\d.]+)%/)?.[1]);
    const color = entry.querySelector("path")?.getAttribute("fill");
    return label && Number.isFinite(percentage) && color ? { name: label, percentage, color } : null;
  }).filter(Boolean).sort((left, right) => right.percentage - left.percentage).slice(0, 6);

  const languageMix = root.querySelector("[data-language-mix]");
  if (languageMix && languages.length) {
    languageMix.innerHTML = renderLanguageMix(languages, new Intl.NumberFormat(document.documentElement.lang));
  }
}

function readNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? Number(match[1].replaceAll(",", "")) : null;
}
