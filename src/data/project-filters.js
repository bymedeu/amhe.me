import { projects, getTopicTags, projectLanguageTags } from "./projects.js";

const normalize = (values, allowed) => [...new Set(Array.isArray(values) ? values : [values])]
  .filter((value) => allowed.includes(value)).sort();

export function normalizeFilters(route = {}) {
  return {
    tags: normalize(route.tags ?? route.tag, getTopicTags()),
    languages: normalize(route.languages ?? route.language, projectLanguageTags),
    visibility: ["public", "private"].includes(route.visibility) ? route.visibility : "all",
  };
}

export function matchingProjects(filters) {
  const { tags, languages, visibility } = normalizeFilters(filters);
  return projects.filter((project) => [...tags, ...languages].every((tag) => project.tags.includes(tag))
    && (visibility === "all" || (visibility === "public"
      ? project.repository.access === "public" : project.repository.access !== "public")));
}

export function toggleFilter(filters, group, value) {
  const state = normalizeFilters(filters);
  state[group] = state[group].includes(value)
    ? state[group].filter((item) => item !== value) : [...state[group], value];
  return normalizeFilters(state);
}
