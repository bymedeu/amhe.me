export function setupRevealAnimations(root) {
  const elements = [...root.querySelectorAll(".reveal")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const reveal = (element) => {
    element.classList.remove("reveal-pending");
    element.classList.add("visible");
  };
  const viewportCutoff = window.innerHeight * 0.96;
  const pending = elements.filter((element) => {
    if (element.getBoundingClientRect().top <= viewportCutoff) {
      reveal(element);
      return false;
    }
    element.classList.add("reveal-pending");
    return true;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
        cleanupFallbackIfComplete();
      });
    },
    { threshold: 0.1 }
  );

  pending.forEach((element) => observer.observe(element));

  const revealVisibleFallback = () => {
    pending.forEach((element) => {
      if (!element.classList.contains("reveal-pending")) return;
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.96) reveal(element);
    });
    cleanupFallbackIfComplete();
  };

  function cleanupFallbackIfComplete() {
    if (pending.some((element) => element.classList.contains("reveal-pending"))) return;
    window.removeEventListener("scroll", revealVisibleFallback);
    window.removeEventListener("resize", revealVisibleFallback);
  }

  if (pending.length) {
    window.addEventListener("scroll", revealVisibleFallback, { passive: true });
    window.addEventListener("resize", revealVisibleFallback);
  }
}
