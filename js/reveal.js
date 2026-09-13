function revealVisibleEntries(revealEntries) {
  revealEntries.forEach((revealEntry) => {
    if (revealEntry.isIntersecting) {
      revealEntry.target.classList.add("is-visible");
    }
  });
}

function bindScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach((revealElement) => {
      revealElement.classList.add("is-visible");
    });
    return;
  }

  const revealObserver = new IntersectionObserver(revealVisibleEntries, {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  });

  revealElements.forEach((revealElement) => {
    revealObserver.observe(revealElement);
  });
}

document.addEventListener("DOMContentLoaded", bindScrollReveal);
