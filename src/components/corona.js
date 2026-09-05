const STORAGE_KEY = "amadeo-portfolio-corona-mode";
const targets = new Map();
let frame = 0;

export function pointerLight(x, y, width, height) {
  const nx = (x - width / 2) / (width / 2);
  const ny = (y - height / 2) / (height / 2);
  const radius = Math.max(Math.abs(nx), Math.abs(ny));
  const strength = Math.min(1, Math.max(0, (radius - 0.5) * 2));
  // Project from the center onto the rectangular perimeter, including corners.
  return {
    x: radius ? (nx / radius + 1) * width / 2 : width / 2,
    y: radius ? (ny / radius + 1) * height / 2 : 0,
    strength: strength * strength * (3 - 2 * strength),
  };
}

export function setupCorona(root) {
  for (const target of targets.keys()) {
    if (!target.isConnected) targets.delete(target);
  }
  let mode = document.documentElement.dataset.coronaMode;
  if (!mode) {
    try { mode = localStorage.getItem(STORAGE_KEY); } catch {}
    setMode(mode === "white" ? "white" : "solar");
  }
  root.querySelectorAll(".project-card-shell, .resume-entry-shell").forEach((target) => {
    if (targets.has(target)) return;
    const aura = document.createElement("span");
    aura.className = "corona-aura";
    aura.setAttribute("aria-hidden", "true");
    aura.innerHTML = '<span class="corona-rim"></span><span class="corona-flare"></span>';
    target.prepend(aura);
    target.classList.add("corona-target");
    const state = { x: target.clientWidth / 2, y: 0, strength: 0, desired: 0, pointer: false };
    targets.set(target, state);
    const reset = () => {
      state.desired = target.contains(document.activeElement) ? 0.35 : 0;
      if (state.desired) { state.x = target.clientWidth / 2; state.y = 0; }
      animate();
    };
    target.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      state.pointer = true;
      const bounds = target.getBoundingClientRect();
      const light = pointerLight(event.clientX - bounds.left, event.clientY - bounds.top, bounds.width, bounds.height);
      state.x = light.x; state.y = light.y; state.desired = light.strength;
      animate();
    });
    target.addEventListener("pointerleave", () => { state.pointer = false; reset(); });
    target.addEventListener("pointercancel", () => { state.pointer = false; reset(); });
    target.addEventListener("focusin", () => { if (!state.pointer) reset(); });
    target.addEventListener("focusout", () => queueMicrotask(reset));
  });
  root.querySelectorAll("[data-corona-toggle]").forEach((toggle) => {
    updateToggle(toggle);
    if (toggle.dataset.coronaReady) return;
    toggle.dataset.coronaReady = "true";
    toggle.addEventListener("click", () => {
      const mode = document.documentElement.dataset.coronaMode === "solar" ? "white" : "solar";
      setMode(mode);
      try { localStorage.setItem(STORAGE_KEY, mode); } catch {}
      updateToggle(toggle);
    });
  });
}

function animate() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    let unsettled = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const [target, state] of targets) {
      if (!target.isConnected) { targets.delete(target); continue; }
      state.strength = reduced ? state.desired : state.strength + (state.desired - state.strength) * 0.25;
      if (Math.abs(state.strength - state.desired) < 0.001) state.strength = state.desired;
      else unsettled = true;
      target.style.setProperty("--corona-x", state.x + "px");
      target.style.setProperty("--corona-y", state.y + "px");
      target.style.setProperty("--corona-strength", state.strength);
    }
    if (unsettled) animate();
  });
}

function updateToggle(toggle) {
  const white = document.documentElement.dataset.coronaMode === "white";
  toggle.setAttribute("aria-pressed", String(white));
  toggle.setAttribute("aria-label", toggle.dataset[white ? "labelSolar" : "labelWhite"]);
  toggle.removeAttribute("title");
}
function setMode(mode) { document.documentElement.dataset.coronaMode = mode; }

export function stopCorona() {
  cancelAnimationFrame(frame);
  frame = 0;
  targets.clear();
}
