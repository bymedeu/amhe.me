/**
 * Public portfolio configuration.
 *
 * Change contact details, social profiles, CV paths, and project resources here.
 * Components should import this file rather than duplicating these values.
 */
export const siteConfig = Object.freeze({
  identity: {
    name: "Amadéo",
  },
  contact: {
    recruiterAccessEmail: "amadeo.heaulme@epita.fr",
  },
  social: {
    portfolio: "https://amhe.me/",
    github: "https://github.com/bymedeu",
    linkedin: "https://www.linkedin.com/in/amadeoheaulme/",
  },
  githubMetricsUrl: "https://raw.githubusercontent.com/bymedeu/bymedeu/main/github-metrics.svg",
  cv: {
    fr: "public/cv/cv-amadeo-fr.pdf",
    en: "public/cv/cv-amadeo-en.pdf",
  },
  home: {
    featuredProjectIds: ["esa", "aurora", "ping"],
  },
  projectResources: {
    // Example for a future OCR report:
    // "word-search-ocr": [{ label: { en: "Project report", fr: "Rapport de projet" }, url: "public/reports/ocr.pdf" }],
  },
});

export function githubRepositoryUrl(repositoryName) {
  return `${siteConfig.social.github}/${repositoryName}`;
}

export function githubRepositoryPath(repositoryName, repositoryPath) {
  return `${githubRepositoryUrl(repositoryName)}/tree/main/${repositoryPath}`;
}
