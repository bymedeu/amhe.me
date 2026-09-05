import { test } from "node:test";
import assert from "node:assert/strict";
import { isCurrent, formatPeriod, calendarDay } from "../src/data/periods.js";
import { getProjectPeriod } from "../src/data/project-dates.js";
import { resume } from "../src/data/resume.js";
import { normalizeFilters, matchingProjects, toggleFilter } from "../src/data/project-filters.js";
import { parseProjectFilters, projectFilterUrl } from "../src/router.js";
import { pointerLight } from "../src/components/corona.js";
import { translations } from "../src/i18n/translations.js";
import { renderProjectIndex } from "../src/pages/projects.js";
import { renderResumePage } from "../src/pages/resume.js";
import { renderHomePage } from "../src/pages/home.js";

const at = (day) => new Date(day + "T12:00:00Z");
const i18n = (language) => ({ language, t: (key) => key.split(".").reduce((value, part) => value[part], translations[language]) });

test("ESA exact cutoff, inclusive months, future starts and open-ended roles", () => {
  const esa = getProjectPeriod("esa");
  assert.equal(isCurrent(esa, at("2026-12-15")), true);
  assert.equal(isCurrent(esa, at("2026-12-16")), false);
  assert.equal(isCurrent(esa, at("2026-06-30")), false);
  assert.equal(formatPeriod(esa, "en"), "Jul — Dec 2026");
  for (const [id, last, next] of [["teaching-assistant", "2026-08-31", "2026-09-01"], ["back-to-basics", "2026-09-30", "2026-10-01"]]) {
    const period = resume.experience.find((entry) => entry.id === id).period;
    assert.equal(isCurrent(period, at(last)), true);
    assert.equal(isCurrent(period, at(next)), false);
  }
  assert.equal(isCurrent({ start: "2026" }, at("2026-09-05")), false);
  assert.equal(isCurrent({ start: "2026", openEnded: true }, at("2035-01-01")), true);
  assert.equal(isCurrent({ start: "2027", openEnded: true }, at("2026-09-05")), false);
  assert.equal(isCurrent({ start: "2026", end: "2026" }, at("2027-01-01")), false);
  assert.equal(formatPeriod({ start: "2026", openEnded: true }, "fr"), "2026 — aujourd’hui");
  assert.equal(calendarDay(new Date("2026-12-15T23:00:00Z")), "2026-12-16");
});

test("AND filtering, prospective availability, deselection and URL normalization", () => {
  const filters = { tags: ["research", "mathematics"], languages: ["python"] };
  assert.deepEqual(matchingProjects(filters).map((p) => p.id), ["aurora"]);
  assert.equal(matchingProjects(toggleFilter(filters, "tags", "testing")).length, 0);
  assert.equal(matchingProjects(toggleFilter(filters, "tags", "research")).some((p) => p.id === "aurora"), true);
  const state = normalizeFilters(filters);
  assert.deepEqual(parseProjectFilters(new URLSearchParams(projectFilterUrl(state).split("?")[1])), state);
  assert.deepEqual(parseProjectFilters(new URLSearchParams("tag=research&tag=research&tag=bad&language=python")), {
    tags: ["research"], languages: ["python"], visibility: "all",
  });
  assert.equal(projectFilterUrl(), "#/projects");
  assert.equal(projectFilterUrl("research", "public", "python"), "#/projects?tag=research&language=python&visibility=public");
  assert.ok(matchingProjects({ languages: ["c", "cpp"] }).every((p) => p.tags.includes("c") && p.tags.includes("cpp")));
});

test("bilingual compact markup, disabled filters, and updated résumé", () => {
  for (const language of ["en", "fr"]) {
    const context = i18n(language);
    const html = renderProjectIndex(context, { languages: ["python"] });
    const testing = html.match(/<button[^>]*data-filter-key="tags-testing"[^>]*>/)[0];
    assert.match(testing, /disabled/);
    assert.match(html, /<details class="project-card"/);
    assert.doesNotMatch(html, /undefined/);
    const résumé = renderResumePage(context);
    assert.doesNotMatch(résumé, /data-resume-filter|Jan\. 2028|janv\. 2028|undefined/);
    const home = renderHomePage(context);
    assert.ok(home.indexOf('data-project="esa"') < home.indexOf('data-project="aurora"'));
    assert.doesNotMatch(home, /undefined/);
  }
});

test("eclipse center is quiet and edge intensity is smooth and bounded", () => {
  for (const [x, y] of [[200, 50], [100, 25], [300, 75]]) {
    assert.equal(pointerLight(x, y, 400, 100).strength, 0);
  }
  assert.equal(pointerLight(400, 50, 400, 100).strength, 1);
  assert.equal(pointerLight(200, 0, 400, 100).strength, 1);
  assert.equal(pointerLight(400, 100, 400, 100).strength, 1);
  assert.ok(pointerLight(350, 50, 400, 100).strength < pointerLight(390, 50, 400, 100).strength);
});
