import { readFile } from "node:fs/promises";
import { projects } from "../src/data/projects.js";
import { translations } from "../src/i18n/translations.js";
import { siteConfig } from "../site.config.js";
import { resume } from "../src/data/resume.js";
import { projectStats } from "../src/data/github-stats.js";
import { getProjectPeriod, getProjectPeriodIds } from "../src/data/project-dates.js";

const errors = [];
const ids = new Set();

if (!/^\S+@\S+\.\S+$/.test(siteConfig.contact.recruiterAccessEmail)) {
  errors.push("site.config.js has an invalid recruiter access email");
}

if (siteConfig.social.portfolio !== "https://amhe.me/") {
  errors.push("site.config.js must use https://amhe.me/ as the canonical portfolio URL");
}

if (siteConfig.githubMetricsUrl !== "https://raw.githubusercontent.com/bymedeu/bymedeu/main/github-metrics.svg") {
  errors.push("site.config.js must read metrics from the preserved bymedeu workflow output");
}

for (const project of projects) {
  if (ids.has(project.id)) errors.push(`Duplicate project id: ${project.id}`);
  ids.add(project.id);

  for (const language of ["en", "fr"]) {
    const name = typeof project.name === "string" ? project.name : project.name[language];
    if (!name) errors.push(`${project.id} is missing a ${language} name`);
    if (!project.description[language]) errors.push(`${project.id} is missing a ${language} description`);
    if (!project.context[language]) errors.push(`${project.id} is missing ${language} context`);
    if (!project.implementation[language]?.length) errors.push(`${project.id} is missing ${language} implementation details`);
    if (project.contribution && !project.contribution[language]) errors.push(`${project.id} is missing a ${language} contribution`);
  }

  if (project.type === "academic" && project.repository.access !== "school-restricted") {
    errors.push(`${project.id} does not enforce school-restricted repository access`);
  }

  if (project.type === "academic" && project.repository.access === "public") {
    errors.push(`${project.id} exposes academic source publicly`);
  }

  for (const tag of project.tags) {
    for (const language of ["en", "fr"]) {
      if (!translations[language].tags[tag]) errors.push(`Missing ${language} translation for tag: ${tag}`);
    }
  }

  if (!getProjectPeriod(project.id)) errors.push(`${project.id} is missing a project date`);
}

for (const projectId of getProjectPeriodIds()) {
  if (!ids.has(projectId)) errors.push(`Project date configured for unknown project: ${projectId}`);
}

for (const [projectId, stats] of Object.entries(projectStats)) {
  if (!ids.has(projectId)) errors.push(`Statistics configured for unknown project: ${projectId}`);
  if (stats.codebaseLines != null && (!Number.isInteger(stats.codebaseLines) || stats.codebaseLines <= 0)) {
    errors.push(`Invalid source-line count for project: ${projectId}`);
  }
  if (stats.visibility === "private" && stats.stars != null) {
    errors.push(`Private GitHub stars must not be published for project: ${projectId}`);
  }
}

for (const projectId of siteConfig.home.featuredProjectIds) {
  if (!ids.has(projectId)) errors.push(`Unknown featured project in site.config.js: ${projectId}`);
}

const resumeDisplayOrders = new Set();
for (const section of [resume.experience, resume.education]) {
  for (const entry of section) {
    if (!/^\d{4}-\d{2}$/.test(entry.sortDate)) {
      errors.push(`Invalid résumé sort date: ${entry.id}`);
    }
    if (!Number.isInteger(entry.displayOrder) || resumeDisplayOrders.has(entry.displayOrder)) {
      errors.push(`Invalid or duplicate résumé display order: ${entry.id}`);
    }
    resumeDisplayOrders.add(entry.displayOrder);
    if (!Array.isArray(entry.skills) || !entry.skills.length) {
      errors.push(`Résumé entry has no skills: ${entry.id}`);
    }
    for (const language of ["en", "fr"]) {
      if (!entry.period[language] || !entry.title[language]) {
        errors.push(`Incomplete ${language} résumé entry: ${entry.id}`);
      }
      const highlights = entry.highlights[language];
      if (!highlights || highlights.length < 3 || highlights.length > 4) {
        errors.push(`Résumé entry needs 3–4 ${language} evidence bullets: ${entry.id}`);
      }
    }
    for (const projectId of entry.projectIds) {
      if (!ids.has(projectId)) errors.push(`Résumé entry links to unknown project: ${projectId}`);
    }
  }
}

for (const [projectId, resources] of Object.entries(siteConfig.projectResources)) {
  if (!ids.has(projectId)) errors.push(`Resource configured for unknown project: ${projectId}`);
  for (const resource of resources) {
    if (!resource.url || !resource.label?.en || !resource.label?.fr) {
      errors.push(`Invalid resource configured for project: ${projectId}`);
    }
  }
}

const [index, llms, robots, sitemap] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../llms.txt", import.meta.url), "utf8"),
  readFile(new URL("../robots.txt", import.meta.url), "utf8"),
  readFile(new URL("../sitemap.xml", import.meta.url), "utf8"),
]);
const forbiddenPortfolioTerms = ["libbistro", "scrooge", "epita-ing1/tree"];

if (!index.includes('<link rel="canonical" href="https://amhe.me/"')) {
  errors.push("index.html is missing the canonical amhe.me URL");
}

if (!index.includes("data-static-portfolio") || !index.includes('type="application/ld+json"')) {
  errors.push("index.html is missing its non-JavaScript or structured-data content");
}

if (!llms.includes("# Amadéo Héaulme") || !llms.includes("https://amhe.me/")) {
  errors.push("llms.txt is missing the portfolio identity or canonical URL");
}

if (!robots.includes("Sitemap: https://amhe.me/sitemap.xml")) {
  errors.push("robots.txt is missing the canonical sitemap URL");
}

if (!sitemap.includes("<loc>https://amhe.me/</loc>")) {
  errors.push("sitemap.xml is missing the canonical homepage URL");
}

for (const term of forbiddenPortfolioTerms) {
  if (index.toLowerCase().includes(term)) errors.push(`Forbidden term in index.html: ${term}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${projects.length} projects, bilingual metadata, tags, and academic privacy.`);
}
