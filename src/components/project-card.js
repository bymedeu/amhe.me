import { getLocalized, getProjectName, isProjectLanguageTag } from "../data/projects.js";
import { projectDetailUrl, projectFilterUrl } from "../router.js";
import { getProjectPeriod, formatProjectPeriod } from "../data/project-dates.js";
import { isCurrent } from "../data/periods.js";
import { toggleFilter } from "../data/project-filters.js";

export function renderProjectCard(project, { language, t }, options = {}) {
  const name = getProjectName(project, language);
  const period = formatProjectPeriod(project.id, language);
  const current = isCurrent(getProjectPeriod(project.id));
  return `
    <div class="project-card-shell reveal">
      <details class="project-card" data-project="${project.id}">
        <summary>
          <span class="project-mark" aria-hidden="true">${project.id === "esa" ? '<img src="public/logos/esa.svg" alt="">' : name.slice(0, 2).toUpperCase()}</span>
          <span class="project-entry-copy"><strong>${name}</strong><span>${t(`projects.${project.type}`)}</span></span>
          <span class="project-entry-meta"><time datetime="${getProjectPeriod(project.id).start}">${period}</time>
            ${current ? `<em>${t("resume.current")}</em>` : project.status === "planned" ? `<em>${t("projects.planned")}</em>` : ""}
          </span>
          <i class="project-entry-toggle" aria-hidden="true">+</i>
        </summary>
        <div class="project-entry-expanded">
          <p>${getLocalized(project.description, language)}</p>
          <div class="tag-row">${project.tags.map((tag) => {
            const next = toggleFilter(options.filters, isProjectLanguageTag(tag) ? "languages" : "tags", tag);
            return `<a href="${projectFilterUrl(next)}" data-project-filter data-filter-key="project-${project.id}-${tag}">${t(`tags.${tag}`)}</a>`;
          }).join("")}</div>
          <a class="project-detail-link" href="${projectDetailUrl(project.id)}">${t("projects.viewDetails")} →</a>
        </div>
      </details>
    </div>`;
}

// Native details/summary provides pointer and keyboard disclosure behavior.
export function setupProjectCards() {}
