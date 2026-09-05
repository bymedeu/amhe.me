import { normalizeFilters } from "./data/project-filters.js";
export function getRoute() {
  const rawHash = window.location.hash.slice(1) || "/";
  const [path, query = ""] = rawHash.split("?");
  const params = new URLSearchParams(query);

  if (path === "/projects") {
    return {
      page: "projects",
      ...parseProjectFilters(params),
    };
  }

  if (path.startsWith("/projects/")) {
    return { page: "project", projectId: decodeURIComponent(path.slice("/projects/".length)) };
  }

  if (path === "/resume") {
    return { page: "resume" };
  }

  const section = ["work", "about", "contact"].includes(path.slice(1))
    ? path.slice(1)
    : null;

  return { page: "home", section };
}

export function parseProjectFilters(params) {
  return normalizeFilters({
    tags: params.getAll("tag"), languages: params.getAll("language"),
    visibility: params.get("visibility"),
  });
}

export function projectFilterUrl(tag = "all", visibility = "all", language = "all") {
  const state = normalizeFilters(typeof tag === "object" && !Array.isArray(tag)
    ? tag : { tags: tag, visibility, languages: language });
  const params = new URLSearchParams();
  state.tags.forEach((value) => params.append("tag", value));
  state.languages.forEach((value) => params.append("language", value));
  if (state.visibility !== "all") params.set("visibility", state.visibility);
  const query = params.toString();
  return `#/projects${query ? `?${query}` : ""}`;
}

export function projectDetailUrl(id) {
  return `#/projects/${encodeURIComponent(id)}`;
}

export function startRouter(onRouteChange) {
  window.addEventListener("hashchange", onRouteChange);
  window.addEventListener("popstate", onRouteChange);
  return () => {
    window.removeEventListener("hashchange", onRouteChange);
    window.removeEventListener("popstate", onRouteChange);
  };
}
