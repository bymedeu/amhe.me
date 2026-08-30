import { renderProjectCard } from "../components/project-card.js";
import { isProjectLanguageTag, projects } from "../data/projects.js";
import { getLocalized } from "../data/projects.js";
import { resume } from "../data/resume.js";
import { icons } from "../components/icons.js";
import { siteConfig } from "../../site.config.js";
import { projectFilterUrl } from "../router.js";

const toolkit = [
  { label: { en: "Python", fr: "Python" }, tag: "python" },
  { label: { en: "C++", fr: "C++" }, tag: "cpp" },
  { label: { en: "C", fr: "C" }, tag: "c" },
  { label: { en: "Java", fr: "Java" }, tag: "java" },
  { label: { en: "Mathematics", fr: "Mathématiques" }, tag: "mathematics" },
  { label: { en: "Machine learning", fr: "Machine learning" }, tag: "ml" },
  { label: { en: "Linux", fr: "Linux" }, tag: "unix" },
  { label: { en: "Docker", fr: "Docker" }, tag: "docker" },
];

export function renderHomePage(i18n) {
  const { language, t } = i18n;
  const featured = siteConfig.home.featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);
  const currentEntries = [
    resume.education.find((entry) => entry.id === "epita"),
    resume.experience.find((entry) => entry.id === "teaching-assistant"),
    resume.experience.find((entry) => entry.id === "esa"),
  ].filter(Boolean);

  return `
    <section class="home-intro container">
      <div class="home-intro-grid">
        <div>
          <p class="eyebrow reveal">${siteConfig.identity.name} Héaulme</p>
          <h1 class="reveal reveal-delay-1">${t("home.title")}</h1>
          <p class="home-role reveal reveal-delay-1">${t("home.role")}</p>
          <p class="home-objective reveal reveal-delay-2">${t("home.objective")}</p>
          <nav class="home-links reveal reveal-delay-2" aria-label="${t("home.links")}">
            <a href="#/projects">${t("nav.projects")}${icons.chevron}</a>
            <a href="#/resume">${t("nav.resume")}${icons.chevron}</a>
            <a href="${siteConfig.social.github}" target="_blank" rel="noreferrer">GitHub${icons.arrowUpRight}</a>
            <a href="${siteConfig.social.linkedin}" target="_blank" rel="noreferrer">LinkedIn${icons.arrowUpRight}</a>
            <a href="mailto:${siteConfig.contact.recruiterAccessEmail}">${t("home.email")}${icons.arrowUpRight}</a>
            <a href="${siteConfig.cv.en}" target="_blank" rel="noreferrer">${t("contact.cvEn")}${icons.arrowUpRight}</a>
            <a href="${siteConfig.cv.fr}" target="_blank" rel="noreferrer">${t("contact.cvFr")}${icons.arrowUpRight}</a>
          </nav>
        </div>
        <div class="corona-switch-wrap reveal reveal-delay-2">
          <button
            class="corona-toggle"
            type="button"
            data-corona-toggle
            data-label-solar="${t("home.coronaSolar")}"
            data-label-white="${t("home.coronaWhite")}"
          >
            <span class="corona-star-aura" aria-hidden="true">
              <i class="corona-star-haze"></i>
              <i class="corona-star-plasma"></i>
              <i class="corona-star-rim"></i>
            </span>
            <span class="corona-star-shape" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </section>

    <section class="home-current border-section">
      <div class="container compact-section">
        <h2 class="compact-heading reveal">${t("home.current")}</h2>
        <div class="current-list">
          ${currentEntries.map((entry) => `
            <a class="current-row reveal" href="#/resume">
              <span>${entry.organization}</span>
              <strong>${getLocalized(entry.title, language)}</strong>
              <time>${getLocalized(entry.period, language)}</time>
            </a>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="home-work container compact-section">
      <div class="compact-heading-row reveal">
        <h2 class="compact-heading">${t("home.selectedProjects")}</h2>
        <a class="text-arrow-link" href="#/projects">${t("home.allProjects")}${icons.chevron}</a>
      </div>
      <div class="featured-projects">
        ${featured.map((project) => renderProjectCard(project, i18n)).join("")}
      </div>
    </section>

    <section class="home-toolkit border-section">
      <div class="container compact-section">
        <h2 class="compact-heading reveal">${t("home.toolkit")}</h2>
        <div class="skills-list reveal">
          ${toolkit.map((item) => {
            const href = isProjectLanguageTag(item.tag)
              ? projectFilterUrl("all", "all", item.tag)
              : projectFilterUrl(item.tag);
            return `<a href="${href}">${getLocalized(item.label, language)}</a>`;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

export function setupHomePage() {}
