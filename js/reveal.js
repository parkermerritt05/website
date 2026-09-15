const MOBILE_BREAKPOINT = "(max-width: 700px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function revealVisibleEntries(revealEntries) {
  revealEntries.forEach((revealEntry) => {
    if (revealEntry.isIntersecting) {
      revealEntry.target.classList.add("is-visible");
    }
  });
}

function shouldSkipReveal() {
  return window.matchMedia(REDUCED_MOTION).matches ||
    window.matchMedia(MOBILE_BREAKPOINT).matches;
}

function revealAll(revealElements) {
  revealElements.forEach((revealElement) => {
    revealElement.classList.add("is-visible");
  });
}

function bindScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) {
    return;
  }

  if (shouldSkipReveal()) {
    revealAll(revealElements);
    return;
  }

  const revealObserver = new IntersectionObserver(revealVisibleEntries, {
    threshold: 0,
    rootMargin: "0px",
  });

  revealElements.forEach((revealElement) => {
    revealObserver.observe(revealElement);
  });
}

document.addEventListener("DOMContentLoaded", bindScrollReveal);
