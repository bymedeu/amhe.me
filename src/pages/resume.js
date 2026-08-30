import { icons } from "../components/icons.js";
import { resume } from "../data/resume.js";
import { getLocalized, getProjectById, getProjectName } from "../data/projects.js";
import { projectDetailUrl } from "../router.js";
import { siteConfig } from "../../site.config.js";

export function renderResumePage(i18n) {
  const { t } = i18n;
  const groups = [
    { key: "education", entries: sortEntries(resume.education) },
    { key: "experience", entries: sortEntries(resume.experience) },
  ];
  const entryCount = groups.reduce((total, group) => total + group.entries.length, 0);

  return `
    <article class="resume-page resume-container container">
      <header class="resume-hero resume-hero-compact">
        <div class="reveal">
          <p class="eyebrow">${t("resume.eyebrow")}</p>
          <h1>${t("resume.title")}</h1>
        </div>
        <div class="resume-downloads reveal reveal-delay-1">
          <a class="button button-light" href="${siteConfig.cv.en}" target="_blank" rel="noreferrer">${t("contact.cvEn")}${icons.arrowUpRight}</a>
          <a class="button button-secondary" href="${siteConfig.cv.fr}" target="_blank" rel="noreferrer">${t("contact.cvFr")}${icons.arrowUpRight}</a>
        </div>
      </header>

      <section class="resume-directory border-section" data-resume-directory>
        <div class="resume-directory-heading reveal">
          <div>
            <p class="section-kicker">${t("resume.timelineKicker")}</p>
            <h2>${t("resume.timelineTitle")}</h2>
          </div>
          <div class="timeline-filters" role="group" aria-label="${t("resume.filterLabel")}">
            <button class="active" type="button" data-resume-filter="all" aria-pressed="true">${t("resume.filterAll")}<span>${entryCount}</span></button>
            <button type="button" data-resume-filter="education" aria-pressed="false">${t("resume.filterEducation")}<span>${resume.education.length}</span></button>
            <button type="button" data-resume-filter="experience" aria-pressed="false">${t("resume.filterJobs")}<span>${resume.experience.length}</span></button>
          </div>
        </div>

        <div class="resume-directory-grid">
          ${groups.map((group) => renderResumeGroup(group, i18n)).join("")}
        </div>
      </section>

      <section class="resume-interests resume-interests-compact border-section reveal">
        <p class="section-kicker">${t("resume.beyondCode")}</p>
        <div class="interest-grid">
          ${t("resume.interests").map((interest) => `<div><span>${interest.label}</span><p>${interest.copy}</p></div>`).join("")}
        </div>
      </section>
    </article>
  `;
}

export function setupResumePage(root) {
  setupResumeFilters(root);
  setupEntryPanels(root);
  setupEntryMotion(root);
}

function setupResumeFilters(root) {
  const directory = root.querySelector("[data-resume-directory]");
  const buttons = [...root.querySelectorAll("[data-resume-filter]")];
  const groups = [...root.querySelectorAll("[data-resume-group]")];
  if (!directory || !buttons.length || !groups.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.resumeFilter;
      if (button.classList.contains("active")) return;

      const firstRects = new Map(
        groups.filter((group) => !group.hidden).map((group) => [group, group.getBoundingClientRect()])
      );

      buttons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      groups.forEach((group) => {
        group.getAnimations().forEach((animation) => animation.cancel());
        group.hidden = filter !== "all" && group.dataset.resumeGroup !== filter;
      });
      directory.dataset.activeFilter = filter;

      if (prefersReducedMotion() || !Element.prototype.animate) return;

      groups.filter((group) => !group.hidden).forEach((group, index) => {
        const first = firstRects.get(group);
        const last = group.getBoundingClientRect();
        const translateX = first ? first.left - last.left : 0;
        const translateY = first ? first.top - last.top : 14;
        group.animate(
          [
            { opacity: first ? 1 : 0, transform: `translate3d(${translateX}px,${translateY}px,${first ? 0 : -30}px) scale(${first ? 1 : .985})` },
            { opacity: 1, transform: "translate3d(0,0,0) scale(1)" },
          ],
          { duration: 440, delay: index * 45, easing: "cubic-bezier(.16,1,.3,1)" }
        );
      });
    });
  });
}

function setupEntryPanels(root) {
  root.querySelectorAll(".resume-entry-card").forEach((details) => {
    details.addEventListener("toggle", () => {
      const expanded = details.querySelector(".resume-entry-expanded");
      if (!details.open || !expanded || prefersReducedMotion() || !Element.prototype.animate) return;
      expanded.animate(
        [
          { opacity: 0, transform: "translateY(-10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }
      );
    });
  });
}

function setupEntryMotion(root) {
  const entries = [...root.querySelectorAll(".resume-entry-shell")];
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    entries.forEach((entry) => entry.classList.add("resume-entry-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (observed) => {
      observed.forEach(({ target, isIntersecting }) => {
        target.classList.toggle("resume-entry-visible", isIntersecting);
      });
    },
    { threshold: 0.08, rootMargin: "-3% 0px -5%" }
  );

  entries.forEach((entry, index) => {
    entry.style.setProperty("--resume-entry-delay", `${Math.min(index, 4) * 45}ms`);
    if (entry.getBoundingClientRect().top < window.innerHeight * 0.96) {
      entry.classList.add("resume-entry-visible");
    }
    entry.classList.add("resume-entry-motion-ready");
    observer.observe(entry);
  });
}

function renderResumeGroup(group, i18n) {
  const { t } = i18n;
  return `
    <section class="resume-group" data-resume-group="${group.key}">
      <header class="resume-group-heading">
        <h2>${t(`resume.${group.key}`)}</h2>
        <span>${String(group.entries.length).padStart(2, "0")}</span>
      </header>
      <div class="resume-entry-list">
        ${group.entries.map((entry) => renderResumeEntry({ ...entry, category: group.key }, i18n)).join("")}
      </div>
    </section>
  `;
}

function renderResumeEntry(entry, i18n) {
  const { language, t } = i18n;
  const location = getLocalized(entry.location, language);
  const linkedProjects = entry.projectIds.map(getProjectById).filter(Boolean);
  const highlights = getLocalized(entry.highlights, language) ?? [];

  return `
    <div class="resume-entry-shell${entry.secondary ? " resume-entry-secondary" : ""}" data-resume-entry>
      <details class="resume-entry-card${entry.current ? " resume-entry-current" : ""}">
        <summary>
          ${renderOrganizationMark(entry)}
          <span class="resume-entry-copy">
            <strong>${getLocalized(entry.title, language)}</strong>
            <span>${entry.organization}${location ? ` · ${location}` : ""}</span>
          </span>
          <span class="resume-entry-meta">
            <time>${getLocalized(entry.period, language)}</time>
            ${entry.current ? `<em>${t("resume.current")}</em>` : ""}
          </span>
          <i class="resume-entry-toggle" aria-hidden="true">+</i>
        </summary>
        <div class="resume-entry-expanded">
          ${highlights.length ? `
            <div class="resume-entry-achievements">
              <p>${t("resume.evidence")}</p>
              <ul>${highlights.map((highlight) => `<li>${highlight}</li>`).join("")}</ul>
            </div>
          ` : ""}
          ${entry.skills?.length ? `
            <div class="resume-entry-skills" aria-label="${t("resume.skills")}">
              ${entry.skills.map((skill) => `<span>${skill}</span>`).join("")}
            </div>
          ` : ""}
          ${renderProjectLinks(linkedProjects, i18n)}
        </div>
      </details>
    </div>
  `;
}

function renderOrganizationMark(entry) {
  if (entry.logo) {
    return `
      <span class="resume-organization-mark resume-organization-logo${entry.logo.tone === "dark" ? " resume-organization-logo-dark" : ""}" aria-hidden="true">
        <img src="${entry.logo.src}" alt="">
      </span>
    `;
  }

  return `<span class="resume-organization-mark" aria-hidden="true">${entry.mark ?? initials(entry.organization)}</span>`;
}

function renderProjectLinks(projects, { language, t }) {
  if (!projects.length) return "";
  const featured = projects.slice(0, 4);
  const additional = projects.slice(4);
  const renderLink = (project) => `<a href="${projectDetailUrl(project.id)}">${getProjectName(project, language)}${icons.chevron}</a>`;

  return `
    <div class="resume-entry-projects" aria-label="${t("resume.relatedProjects")}">
      <p>${t("resume.relatedProjects")}</p>
      <div class="resume-project-list">${featured.map(renderLink).join("")}</div>
      ${additional.length ? `
        <details class="project-more">
          <summary><span>+</span>${t("resume.moreProjectsCount")(additional.length)}</summary>
          <div>${additional.map(renderLink).join("")}</div>
        </details>
      ` : ""}
    </div>
  `;
}

function sortEntries(entries) {
  return [...entries].sort((left, right) => left.displayOrder - right.displayOrder);
}

function initials(name) {
  return name
    .split(/[\s-]+/)
    .filter((part) => part.length > 2)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
