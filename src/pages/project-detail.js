import { icons } from "../components/icons.js";
import { getLocalized, getProjectById, getProjectName, isProjectLanguageTag } from "../data/projects.js";
import { projectFilterUrl } from "../router.js";
import { siteConfig } from "../../site.config.js";
import { projectStats } from "../data/github-stats.js";
import { formatProjectPeriod } from "../data/project-dates.js";

const MIN_VISIBLE_SOURCE_LINES = 1000;

export function renderProjectDetailPage(i18n, route) {
  const project = getProjectById(route.projectId);
  if (!project) return renderNotFound(i18n);

  const { language, t } = i18n;
  const name = getProjectName(project, language);
  const description = getLocalized(project.description, language);
  const context = getLocalized(project.context, language);
  const contribution = getLocalized(project.contribution, language);
  const implementation = getLocalized(project.implementation, language) ?? [];
  const duration = getLocalized(project.duration, language);
  const stats = projectStats[project.id];
  const period = formatProjectPeriod(project.id, language);

  document.title = `${name} — ${siteConfig.identity.name}`;

  return `
    <article class="project-detail container"${project.repository.access === "public" ? ` data-public-repository="${project.repository.url}"` : ""}>
      <a class="back-link reveal" href="#/projects">← ${t("detail.back")}</a>
      <header class="detail-hero">
        <div class="detail-heading reveal reveal-delay-1">
          <p class="section-kicker">${t(`projects.${project.type}`)}${project.status === "planned" ? ` · ${t("projects.planned")}` : ""}</p>
          <h1>${name}</h1>
          <p>${description}</p>
        </div>
        <div class="detail-art project-visual art-${project.art} reveal reveal-delay-2" aria-hidden="true">
          <span class="detail-monogram">${project.monogram ?? getMonogram(name)}</span>
          <span class="visual-code">${project.id.toUpperCase()}</span>
        </div>
      </header>

      <div class="detail-tag-row reveal">
        ${project.tags.map((tag) => {
          const href = isProjectLanguageTag(tag) ? projectFilterUrl("all", "all", tag) : projectFilterUrl(tag);
          return `<a href="${href}">${t(`tags.${tag}`)}</a>`;
        }).join("")}
        ${project.linkedinUrl ? `<a class="linkedin-project-link" href="${project.linkedinUrl}" target="_blank" rel="noreferrer">${t("detail.linkedinProject")} ${icons.arrowUpRight}</a>` : ""}
      </div>

      <section class="detail-grid border-section">
        <div class="detail-facts reveal">
          ${period ? renderFact(t("detail.date"), period) : ""}
          ${duration ? renderFact(t("detail.duration"), duration) : ""}
          ${project.teamSize ? renderFact(t("detail.team"), t("detail.people")(project.teamSize)) : ""}
          ${stats?.codebaseLines >= MIN_VISIBLE_SOURCE_LINES ? renderFact(t("detail.codebaseSize"), t("detail.lines")(stats.codebaseLines), t("detail.codebaseNote")) : ""}
          ${stats?.stars != null ? renderFact(t("detail.githubStars"), `<span data-github-stars>${new Intl.NumberFormat(language).format(stats.stars)}</span>`) : ""}
          ${renderFact(t("detail.status"), getStatusLabel(project, t))}
        </div>
        <div class="detail-copy reveal reveal-delay-1">
          <p class="section-kicker">${t("detail.context")}</p>
          <p class="detail-lead">${context}</p>
          ${contribution ? `<div class="detail-contribution"><span>${t("detail.contribution")}</span><p>${contribution}</p></div>` : ""}
        </div>
      </section>

      <section class="implementation-section border-section">
        <p class="section-kicker reveal">${t("detail.implementation")}</p>
        <div class="implementation-list">
          ${implementation.map((item, index) => `<div class="implementation-item reveal"><span>${String(index + 1).padStart(2, "0")}</span><p>${item}</p></div>`).join("")}
        </div>
      </section>

      ${renderRepositorySection(project, name, i18n)}
      ${renderResources(project, i18n)}
    </article>
  `;
}

export function setupProjectDetailPage(root) {
  refreshPublicRepositoryStats(root).catch(() => {
    // Keep the checked-in fallback when GitHub is unavailable or rate-limited.
  });
}

async function refreshPublicRepositoryStats(root) {
  const page = root.querySelector("[data-public-repository]");
  const stars = root.querySelector("[data-github-stars]");
  if (!page?.dataset.publicRepository || !stars) return;

  const repository = new URL(page.dataset.publicRepository);
  const response = await fetch(`https://api.github.com/repos${repository.pathname}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) return;

  const metadata = await response.json();
  if (Number.isInteger(metadata.stargazers_count)) {
    stars.textContent = new Intl.NumberFormat(document.documentElement.lang).format(metadata.stargazers_count);
  }
}

function renderRepositorySection(project, name, { t, language }) {
  if (project.repository.access === "public") {
    return `
      <section class="repository-panel reveal">
        <div><p class="section-kicker">${t("detail.repository")}</p><h2>${t("detail.openSource")}</h2></div>
        <a class="button button-light" href="${project.repository.url}" target="_blank" rel="noreferrer">${t("projects.public")}${icons.arrowUpRight}</a>
      </section>
    `;
  }

  const isSchool = project.repository.access === "school-restricted";
  const tooltip = isSchool ? t("detail.schoolRestriction") : t("detail.privateRepository");
  const subject = language === "fr" ? `Demande d'accès au projet ${name}` : `Repository access request — ${name}`;
  const body = language === "fr"
    ? `Bonjour ${siteConfig.identity.name},\n\nJe suis recruteur/recruteuse chez [entreprise] et je souhaiterais consulter le code du projet ${name} afin d'évaluer tes pratiques d'ingénierie et la qualité du code.\n\nMon profil LinkedIn ou adresse professionnelle : [lien]\n\nMerci,`
    : `Hello ${siteConfig.identity.name},\n\nI am a recruiter at [company] and would like to review the ${name} repository to assess your engineering practices and code quality.\n\nMy LinkedIn profile or professional email: [link]\n\nThank you,`;
  const mailto = `mailto:${siteConfig.contact.recruiterAccessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return `
    <section class="repository-panel restricted reveal">
      <div>
        <p class="section-kicker">${t("detail.repository")}</p>
        <h2>${t("detail.privateTitle")}</h2>
        <p>${t("detail.privateCopy")}${isSchool ? ` ${t("detail.schoolReason")}` : ""}</p>
      </div>
      <div class="repository-actions">
        <span class="repository-tooltip" data-tooltip="${tooltip}">
          <span class="button repository-disabled" aria-disabled="true" tabindex="0">${icons.lock}${t("detail.githubRestricted")}</span>
        </span>
        <a class="button button-secondary" href="${siteConfig.social.linkedin}" target="_blank" rel="noreferrer">${t("detail.requestAccess")}${icons.arrowUpRight}</a>
        <a class="repository-email-link" href="${mailto}">${t("detail.requestByEmail")}</a>
      </div>
    </section>
  `;
}

function renderResources(project, { language, t }) {
  const resources = siteConfig.projectResources[project.id] ?? [];
  if (!resources.length) return "";

  return `
    <section class="resource-section border-section reveal">
      <p class="section-kicker">${t("detail.resources")}</p>
      <div class="resource-links">
        ${resources.map((resource) => `<a href="${resource.url}" target="_blank" rel="noreferrer">${getLocalized(resource.label, language)} ${icons.arrowUpRight}</a>`).join("")}
      </div>
    </section>
  `;
}

function renderFact(label, value, tooltip = null) {
  return `<div class="detail-fact"><span${tooltip ? ` title="${tooltip}"` : ""}>${label}</span><strong>${value}</strong></div>`;
}

function getStatusLabel(project, t) {
  if (project.status === "planned") return t("projects.planned");
  if (project.status === "active") return t("detail.active");
  return t("detail.completed");
}

function getMonogram(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function renderNotFound({ t }) {
  return `<section class="not-found container"><p class="section-kicker">404</p><h1>${t("detail.notFound")}</h1><a class="button button-secondary" href="#/projects">${t("detail.back")}</a></section>`;
}
