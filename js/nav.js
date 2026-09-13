function getNavElements() {
  const mobileNavToggle = document.querySelector("[data-nav-toggle]");
  const navLinksPanel = document.querySelector("[data-nav-links]");
  return { mobileNavToggle, navLinksPanel };
}

function closeMobileNav(mobileNavToggle, navLinksPanel) {
  navLinksPanel.classList.remove("is-open");
  mobileNavToggle.setAttribute("aria-expanded", "false");
  mobileNavToggle.setAttribute("aria-label", "Open menu");
}

function openMobileNav(mobileNavToggle, navLinksPanel) {
  navLinksPanel.classList.add("is-open");
  mobileNavToggle.setAttribute("aria-expanded", "true");
  mobileNavToggle.setAttribute("aria-label", "Close menu");
}

function toggleMobileNav(mobileNavToggle, navLinksPanel) {
  const isOpen = navLinksPanel.classList.contains("is-open");
  if (isOpen) {
    closeMobileNav(mobileNavToggle, navLinksPanel);
  } else {
    openMobileNav(mobileNavToggle, navLinksPanel);
  }
}

function bindMobileNav() {
  const { mobileNavToggle, navLinksPanel } = getNavElements();
  if (!mobileNavToggle || !navLinksPanel) {
    return;
  }

  mobileNavToggle.addEventListener("click", () => {
    toggleMobileNav(mobileNavToggle, navLinksPanel);
  });

  navLinksPanel.querySelectorAll("a").forEach((navLink) => {
    navLink.addEventListener("click", () => {
      closeMobileNav(mobileNavToggle, navLinksPanel);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav(mobileNavToggle, navLinksPanel);
    }
  });
}

document.addEventListener("DOMContentLoaded", bindMobileNav);
