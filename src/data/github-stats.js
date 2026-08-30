/**
 * Fallback snapshot used before github-metrics.svg is parsed in the browser.
 * The profile SVG is generated daily by the existing GitHub Actions workflow.
 * Project line counts describe the local codebase, including tests and any
 * supplied academic scaffolding; they do not claim sole authorship.
 */
export const githubSnapshot = {
  commits: 545,
  pullRequests: 46,
  contributedRepositories: 15,
  languages: 21,
  topLanguages: [
    { name: "C++", percentage: 57.89, color: "#f34b7d" },
    { name: "C", percentage: 17.49, color: "#8f8f8f" },
    { name: "Java", percentage: 13.28, color: "#b07219" },
    { name: "Python", percentage: 4.91, color: "#3572a5" },
    { name: "Shell", percentage: 3.26, color: "#89e051" },
    { name: "TypeScript", percentage: 2.65, color: "#3178c6" },
  ],
};

export const projectStats = {
  aurora: { codebaseLines: 138, stars: 0, visibility: "public" },
  mystarceiling: { codebaseLines: null, stars: null, visibility: "private" },
  "word-search-ocr": { codebaseLines: null, stars: null, visibility: "private" },
  "c-piscine": { codebaseLines: 10896, stars: null, visibility: "private" },
  tinyprintf: { codebaseLines: 233, stars: null, visibility: "private" },
  evalexpr: { codebaseLines: 782, stars: null, visibility: "private" },
  minimake: { codebaseLines: 2092, stars: null, visibility: "private" },
  "memory-allocator": { codebaseLines: 369, stars: null, visibility: "private" },
  "http-server": { codebaseLines: 1855, stars: null, visibility: "private" },
  "21sh": { codebaseLines: 227, stars: null, visibility: "private" },
  "42sh": { codebaseLines: 8253, stars: null, visibility: "private" },
  "cpp-piscine": { codebaseLines: 9313, stars: null, visibility: "private" },
  "image-library": { codebaseLines: 816, stars: null, visibility: "private" },
  tiger: { codebaseLines: 39936, stars: null, visibility: "private" },
  "java-piscine": { codebaseLines: 4821, stars: null, visibility: "private" },
  "rush-creeps": { codebaseLines: 443, stars: null, visibility: "private" },
  jws: { codebaseLines: 3750, stars: null, visibility: "private" },
  ping: { codebaseLines: 21216, stars: null, visibility: "private" },
  "javascript-piscine": { codebaseLines: 3097, stars: null, visibility: "private" },
  eplace: { codebaseLines: 1511, stars: null, visibility: "private" },
  libzork: { codebaseLines: 1445, stars: null, visibility: "private" },
  "snow-plow": { codebaseLines: 1377, stars: null, visibility: "private" },
  "comments-platform": { codebaseLines: null, stars: null, visibility: "private" },
  "cs50-ai": { codebaseLines: 2989, stars: null, visibility: "private" },
  leetcode: { codebaseLines: null, stars: 0, visibility: "public" },
};
