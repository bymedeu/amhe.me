import { getLocalized, getProjectName, isProjectLanguageTag } from "../data/projects.js";
import { projectDetailUrl, projectFilterUrl } from "../router.js";
import { icons } from "./icons.js";
import { formatProjectPeriod } from "../data/project-dates.js";

export function renderProjectCard(project, i18n, options = {}) {
  const { language, t } = i18n;
  const name = getProjectName(project, language);
  const description = getLocalized(project.description, language);
  const featured = options.featured ? " project-card-featured" : "";
  const filterVisibility = options.filterVisibility ?? "all";
  const filterTag = options.filterTag ?? "all";
  const filterLanguage = options.filterLanguage ?? "all";
  const status = project.status === "planned"
    ? `<span class="status-label">${t("projects.planned")}</span>`
    : "";
  const period = formatProjectPeriod(project.id, language);

  return `
    <div class="project-card-shell${featured} reveal">
      <article class="project-card" data-project="${project.id}" data-project-href="${projectDetailUrl(project.id)}" tabindex="0" role="link" aria-label="${name}">
        <div class="project-visual art-${project.art}" aria-hidden="true">
          ${renderProjectArt(project.art)}
          <span class="visual-code">${project.id.toUpperCase()}</span>
        </div>
        <div class="project-content">
          <div class="project-topline">
            <p class="project-type">${t(`projects.${project.type}`)}</p>
            <div class="project-card-meta">${status}${period ? `<time>${period}</time>` : ""}</div>
          </div>
          <div class="project-title-row">
            <h3>${name}</h3>
            <span class="card-arrow" aria-hidden="true">${icons.chevron}</span>
          </div>
          <p class="project-description">${description}</p>
          <div class="tag-row">
            ${project.tags.map((tag) => {
              const href = isProjectLanguageTag(tag)
                ? projectFilterUrl(filterTag, filterVisibility, tag)
                : projectFilterUrl(tag, filterVisibility, filterLanguage);
              return `<a href="${href}" data-project-filter data-project-tag="${tag}">${t(`tags.${tag}`)}</a>`;
            }).join("")}
          </div>
        </div>
      </article>
    </div>
  `;
}

export function setupProjectCards(root) {
  root.querySelectorAll("[data-project-href]").forEach((card) => {
    const open = () => { window.location.hash = card.dataset.projectHref.slice(1); };
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      open();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open();
    });
  });
}

function renderProjectArt(art) {
  const glyphs = {
    stars: '<span class="art-glyph star-glyph">✶</span><span class="star-orbit"></span>',
    aurora: '<span class="art-glyph">Σ</span><span class="art-ring"></span>',
    route: '<span class="art-glyph">⌘</span><span class="route-line"></span>',
    terminal: '<span class="terminal-prompt">$ <i>_</i></span>',
    compiler: '<span class="art-glyph">{ }</span>',
    pixels: '<span class="pixel-cluster"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>',
    service: '<span class="art-glyph">↔</span>', network: '<span class="art-glyph">◇</span>',
    memory: '<span class="art-glyph">0x</span>', build: '<span class="art-glyph">//</span>',
    math: '<span class="art-glyph">f(x)</span>', graph: '<span class="art-glyph">◌</span>',
    game: '<span class="art-glyph">× ○</span>', logic: '<span class="art-glyph">⊢</span>',
    probability: '<span class="art-glyph">P</span>', grid: '<span class="art-glyph">▦</span>',
    data: '<span class="art-glyph">∿</span>', vision: '<span class="art-glyph">◉</span>',
    attention: '<span class="art-glyph">∷</span>', language: '<span class="art-glyph">Aa</span>',
    containers: '<span class="container-stack"><i></i><i></i><i></i></span>',
  };
  return glyphs[art] ?? '<span class="art-glyph">·</span>';
}
