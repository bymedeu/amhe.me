export function getRoute() {
  const rawHash = window.location.hash.slice(1) || "/";
  const [path, query = ""] = rawHash.split("?");
  const params = new URLSearchParams(query);

  if (path === "/projects") {
    return {
      page: "projects",
      tag: params.get("tag") || "all",
      language: params.get("language") || "all",
      visibility: params.get("visibility") || "all",
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

export function projectFilterUrl(tag = "all", visibility = "all", language = "all") {
  const params = new URLSearchParams();
  if (tag !== "all") params.set("tag", tag);
  if (language !== "all") params.set("language", language);
  if (visibility !== "all") params.set("visibility", visibility);
  const query = params.toString();
  return `#/projects${query ? `?${query}` : ""}`;
}

export function projectDetailUrl(id) {
  return `#/projects/${encodeURIComponent(id)}`;
}

export function startRouter(onRouteChange) {
  window.addEventListener("hashchange", onRouteChange);
  return () => window.removeEventListener("hashchange", onRouteChange);
}
