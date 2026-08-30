const STORAGE_KEY = "amadeo-portfolio-corona-mode";
const DEFAULT_MODE = "solar";
const ORBIT_DURATION_MS = 160_000;
const TARGET_SELECTOR = [
  ".project-card-shell",
  ".resume-entry-shell",
].join(",");

const targetStates = new WeakMap();
const activeTargets = new Set();
const sessionOffset = Math.random();
let animationFrame = 0;

export function setupCorona(root) {
  setMode(readMode());

  root.querySelectorAll(TARGET_SELECTOR).forEach((target) => {
    if (target.dataset.coronaReady === "true") return;

    const initialAngle = sharedOrbitAngle();
    const state = {
      currentAngle: initialAngle,
      targetAngle: initialAngle,
      currentProximity: 0,
      targetProximity: 0,
      pointerActive: false,
    };

    target.dataset.coronaReady = "true";
    target.classList.add("corona-target");
    target.prepend(createAura());
    targetStates.set(target, state);
    writeVisualState(target, state);

    target.addEventListener("pointerenter", (event) => {
      state.pointerActive = true;
      updatePointerFocus(target, state, event);
      activate(target);
    });
    target.addEventListener("pointermove", (event) => {
      state.pointerActive = true;
      updatePointerFocus(target, state, event);
      activate(target);
    });
    target.addEventListener("pointerleave", () => {
      state.pointerActive = false;
      state.targetProximity = 0;
      deactivateWhenIdle(target, state);
    });
    target.addEventListener("focusin", () => {
      state.targetAngle = sharedOrbitAngle();
      state.targetProximity = 0.82;
      activate(target);
    });
    target.addEventListener("focusout", () => {
      requestAnimationFrame(() => deactivateWhenIdle(target, state));
    });
  });

  root.querySelectorAll("[data-corona-toggle]").forEach((toggle) => {
    if (toggle.dataset.coronaReady === "true") return;

    toggle.dataset.coronaReady = "true";
    toggle.style.setProperty("--corona-delay", `${-performance.now()}ms`);
    toggle.addEventListener("click", () => {
      const nextMode = currentMode() === "solar" ? "white" : "solar";
      setMode(nextMode);
      writeMode(nextMode);
      updateToggleState(toggle, nextMode);
    });
    updateToggleState(toggle, currentMode());
  });
}

function createAura() {
  const aura = document.createElement("span");
  aura.className = "corona-aura";
  aura.setAttribute("aria-hidden", "true");
  aura.innerHTML = `
    <span class="corona-ambient"></span>
    <span class="corona-focus-window">
      <span class="corona-focus-haze"></span>
      <span class="corona-focus-rim"></span>
      <span class="corona-focus-filaments"></span>
    </span>
  `;
  return aura;
}

function updatePointerFocus(target, state, event) {
  const bounds = target.getBoundingClientRect();
  const pointerX = clamp(event.clientX - bounds.left, 0, bounds.width);
  const pointerY = clamp(event.clientY - bounds.top, 0, bounds.height);
  const offsetX = pointerX - bounds.width / 2;
  const offsetY = pointerY - bounds.height / 2;
  const angle = modulo(Math.atan2(offsetY, offsetX) * 180 / Math.PI + 90, 360);
  const edgeDistance = Math.min(pointerX, pointerY, bounds.width - pointerX, bounds.height - pointerY);
  const activationDepth = Math.max(22, Math.min(bounds.width, bounds.height) * 0.46);
  const proximity = clamp(1 - edgeDistance / activationDepth, 0.08, 1);

  state.targetAngle = angle;
  state.targetProximity = proximity;

  if (prefersReducedMotion()) {
    state.currentAngle = angle;
    state.currentProximity = proximity;
    writeVisualState(target, state);
  }
}

function activate(target) {
  activeTargets.add(target);
  startAnimation();
}

function deactivateWhenIdle(target, state) {
  if (state.pointerActive || target.contains(document.activeElement)) return;
  state.targetProximity = 0;

  window.setTimeout(() => {
    if (state.pointerActive || target.contains(document.activeElement)) return;
    activeTargets.delete(target);
  }, 420);
}

function startAnimation() {
  if (animationFrame || prefersReducedMotion()) return;

  const tick = () => {
    animationFrame = 0;

    activeTargets.forEach((target) => {
      if (!target.isConnected) {
        activeTargets.delete(target);
        return;
      }

      const state = targetStates.get(target);
      if (!state) return;

      if (!state.pointerActive && target.contains(document.activeElement)) {
        state.targetAngle = sharedOrbitAngle();
      }

      state.currentAngle = interpolateAngle(state.currentAngle, state.targetAngle, 0.18);
      state.currentProximity += (state.targetProximity - state.currentProximity) * 0.16;
      writeVisualState(target, state);
    });

    if (activeTargets.size) animationFrame = requestAnimationFrame(tick);
  };

  animationFrame = requestAnimationFrame(tick);
}

function writeVisualState(target, state) {
  target.style.setProperty("--corona-angle", `${state.currentAngle.toFixed(2)}deg`);
  target.style.setProperty("--corona-proximity", state.currentProximity.toFixed(3));
}

function sharedOrbitAngle() {
  if (prefersReducedMotion()) return sessionOffset * 360;
  return modulo((sessionOffset + performance.now() / ORBIT_DURATION_MS) * 360, 360);
}

function interpolateAngle(current, target, amount) {
  const difference = modulo(target - current + 180, 360) - 180;
  return modulo(current + difference * amount, 360);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function modulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function updateToggleState(toggle, mode) {
  const nextMode = mode === "solar" ? "white" : "solar";
  toggle.setAttribute("aria-pressed", String(mode === "white"));
  toggle.setAttribute("aria-label", toggle.dataset[`label${capitalize(nextMode)}`] ?? "");
  toggle.title = toggle.dataset[`label${capitalize(nextMode)}`] ?? "";
}

function readMode() {
  try {
    const savedMode = localStorage.getItem(STORAGE_KEY);
    return savedMode === "white" || savedMode === "solar" ? savedMode : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function writeMode(mode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // The visual switch still works when storage is unavailable.
  }
}

function currentMode() {
  return document.documentElement.dataset.coronaMode ?? DEFAULT_MODE;
}

function setMode(mode) {
  document.documentElement.dataset.coronaMode = mode;
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
