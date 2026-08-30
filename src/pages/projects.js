import { renderProjectCard } from "../components/project-card.js";
import { getTopicTags, projectLanguageTags, projects } from "../data/projects.js";
import { projectFilterUrl } from "../router.js";
import { githubSnapshot, projectStats } from "../data/github-stats.js";
import { siteConfig } from "../../site.config.js";

export function renderProjectsPage(i18n, route) {
  return `
    <section class="projects-hero container">
      <p class="eyebrow reveal">${i18n.t("projects.eyebrow")}</p>
      <h1 class="reveal reveal-delay-1">${i18n.t("projects.title")}</h1>
    </section>
    ${renderGithubSnapshot(i18n)}
    ${renderProjectIndex(i18n, route)}
  `;
}

export function renderProjectIndex(i18n, route) {
  const { t } = i18n;
  const tags = getTopicTags();
  const activeTag = tags.includes(route.tag) ? route.tag : "all";
  const activeLanguage = projectLanguageTags.includes(route.language) ? route.language : "all";
  const activeVisibility = ["public", "private"].includes(route.visibility) ? route.visibility : "all";
  const matchesTag = (project) => activeTag === "all" || project.tags.includes(activeTag);
  const matchesLanguage = (project) => activeLanguage === "all" || project.tags.includes(activeLanguage);
  const matchesVisibility = (project) => activeVisibility === "all"
    || (activeVisibility === "public" ? project.repository.access === "public" : project.repository.access !== "public");
  const visibleProjects = projects.filter((project) => matchesTag(project) && matchesLanguage(project) && matchesVisibility(project));
  const filtersAreClear = activeTag === "all" && activeLanguage === "all" && activeVisibility === "all";
  const totalSourceLines = visibleProjects.reduce((total, project) => total + (projectStats[project.id]?.codebaseLines ?? 0), 0);

  return `
    <section class="project-index container">
      <div class="filter-header reveal">
        <div>
          <p class="section-kicker">${t("projects.filter")}</p>
          <p class="result-count" aria-live="polite"><span>${t("projects.count")(visibleProjects.length)}</span><i>·</i><span title="${t("projects.sourceLinesNote")}">${t("projects.sourceLines")(totalSourceLines)}</span></p>
        </div>
        <a data-project-filter class="clear-filter ${filtersAreClear ? "disabled" : ""}" href="${projectFilterUrl()}">× ${t("projects.clearFilters")}</a>
      </div>
      <div class="visibility-filter reveal" role="group" aria-label="${t("projects.visibility")}">
        ${renderVisibilityFilter("all", t("projects.allRepositories"), projects, activeTag, activeLanguage, activeVisibility)}
        ${renderVisibilityFilter("public", t("projects.publicRepositories"), projects, activeTag, activeLanguage, activeVisibility)}
        ${renderVisibilityFilter("private", t("projects.privateRepositories"), projects, activeTag, activeLanguage, activeVisibility)}
      </div>
      <div class="project-filter-group reveal">
        <p>${t("projects.programmingLanguage")}</p>
        <div class="filter-list" role="list" aria-label="${t("projects.programmingLanguage")}">
          <a data-project-filter href="${projectFilterUrl(activeTag, activeVisibility)}" class="filter-chip ${activeLanguage === "all" ? "active" : ""}" aria-current="${activeLanguage === "all"}">${t("projects.allLanguages")}<span>${projects.filter((project) => matchesTag(project) && matchesVisibility(project)).length}</span></a>
          ${projectLanguageTags.map((language) => {
            const count = projects.filter((project) => project.tags.includes(language) && matchesTag(project) && matchesVisibility(project)).length;
            return `<a data-project-filter href="${projectFilterUrl(activeTag, activeVisibility, language)}" class="filter-chip ${activeLanguage === language ? "active" : ""}" aria-current="${activeLanguage === language}">${t(`tags.${language}`)}<span>${count}</span></a>`;
          }).join("")}
        </div>
      </div>
      <div class="project-filter-group reveal">
        <p>${t("projects.topics")}</p>
        <div class="filter-list" role="list" aria-label="${t("projects.topics")}">
          <a data-project-filter href="${projectFilterUrl("all", activeVisibility, activeLanguage)}" class="filter-chip ${activeTag === "all" ? "active" : ""}" aria-current="${activeTag === "all"}">${t("projects.allTopics")}<span>${projects.filter((project) => matchesLanguage(project) && matchesVisibility(project)).length}</span></a>
          ${tags.map((tag) => {
            const count = projects.filter((project) => project.tags.includes(tag) && matchesLanguage(project) && matchesVisibility(project)).length;
            return `<a data-project-filter href="${projectFilterUrl(tag, activeVisibility, activeLanguage)}" class="filter-chip ${activeTag === tag ? "active" : ""}" aria-current="${activeTag === tag}">${t(`tags.${tag}`)}<span>${count}</span></a>`;
          }).join("")}
        </div>
      </div>
      <div class="all-projects">
        ${visibleProjects.length
          ? visibleProjects.map((project) => renderProjectCard(project, i18n, {
            filterVisibility: activeVisibility,
            filterTag: activeTag,
            filterLanguage: activeLanguage,
          })).join("")
          : `<p class="empty-state">${t("projects.empty")}</p>`}
      </div>
    </section>
  `;
}

function renderVisibilityFilter(visibility, label, allProjects, activeTag, activeLanguage, activeVisibility) {
  const count = allProjects.filter((project) => {
    const tagMatches = activeTag === "all" || project.tags.includes(activeTag);
    const languageMatches = activeLanguage === "all" || project.tags.includes(activeLanguage);
    const visibilityMatches = visibility === "all"
      || (visibility === "public" ? project.repository.access === "public" : project.repository.access !== "public");
    return tagMatches && languageMatches && visibilityMatches;
  }).length;

  return `<a data-project-filter href="${projectFilterUrl(activeTag, visibility, activeLanguage)}" class="visibility-option ${activeVisibility === visibility ? "active" : ""}" aria-current="${activeVisibility === visibility}">${label}<span>${count}</span></a>`;
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

      const href = link.getAttribute("href");
      const route = parseProjectFilterHref(href);
      const currentIndex = document.querySelector(".project-index");
      if (!currentIndex) return;

      window.history.pushState({ projectFilters: true }, "", href);
      const template = document.createElement("template");
      template.innerHTML = renderProjectIndex(i18n, route).trim();
      const nextIndex = template.content.firstElementChild;
      currentIndex.replaceWith(nextIndex);
      bindProjectFilters(nextIndex, i18n, setupIndexInteractions);
      setupIndexInteractions(nextIndex);
    });
  });
}

function parseProjectFilterHref(href) {
  const query = href.split("?")[1] ?? "";
  const params = new URLSearchParams(query);
  return {
    page: "projects",
    tag: params.get("tag") || "all",
    language: params.get("language") || "all",
    visibility: params.get("visibility") || "all",
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
