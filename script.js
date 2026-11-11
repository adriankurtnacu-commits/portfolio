const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const loader = document.querySelector(".page-loader");
const resumeModal = document.querySelector(".resume-modal");
const resumeFrame = resumeModal?.querySelector("iframe");
const resumeTitle = resumeModal?.querySelector("#resume-modal-title");
const resumeDownload = resumeModal?.querySelector(".modal-download");
const themeToggle = document.querySelector(".theme-toggle");
const progressBar = document.querySelector(".scroll-progress span");
const rotatingWord = document.querySelector(".rotating-word");
const heroCard = document.querySelector(".hero-card");

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  const icon = themeToggle?.querySelector(".theme-icon");
  const label = themeToggle?.querySelector(".theme-label");
  if (icon) icon.textContent = isDark ? "☀" : "☾";
  if (label) label.textContent = isDark ? "Light" : "Dark";
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // Theme still works when storage is unavailable.
  }
};

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch {
  savedTheme = null;
}
setTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.body.classList.add("is-loading");
window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader?.classList.add("is-done");
    document.body.classList.remove("is-loading");
  }, 450);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".project-card, .capability, .about-copy, .about-facts, .resume-panel").forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});

const closeResume = () => {
  resumeModal?.classList.remove("is-open");
  resumeModal?.setAttribute("aria-hidden", "true");
  if (resumeFrame) resumeFrame.src = "about:blank";
};

document.querySelectorAll(".js-resume").forEach((button) => {
  button.addEventListener("click", () => {
    const file = button.dataset.resume;
    if (!file || !resumeModal || !resumeFrame) return;
    resumeTitle.textContent = button.dataset.title || "Resume";
    resumeFrame.src = file;
    resumeDownload.href = file;
    resumeModal.classList.add("is-open");
    resumeModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-loading");
  });
});

document.querySelectorAll(".js-close-resume").forEach((button) => {
  button.addEventListener("click", () => {
    closeResume();
    document.body.classList.remove("is-loading");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resumeModal?.classList.contains("is-open")) {
    closeResume();
    document.body.classList.remove("is-loading");
  }
});

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const words = ["calm", "useful", "reliable", "thoughtful"];
let wordIndex = 0;
window.setInterval(() => {
  if (!rotatingWord) return;
  wordIndex = (wordIndex + 1) % words.length;
  rotatingWord.animate(
    [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(8px)" }],
    { duration: 180, fill: "forwards" },
  ).finished.then(() => {
    rotatingWord.textContent = words[wordIndex];
    rotatingWord.animate(
      [{ opacity: 0, transform: "translateY(-8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 260, fill: "forwards" },
    );
  });
}, 5200);

heroCard?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = heroCard.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  heroCard.style.setProperty("--mx", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
  heroCard.style.setProperty("--my", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  heroCard.style.transform = `perspective(900px) rotateY(${x * 2}deg) rotateX(${y * -2}deg) translateY(-2px)`;
});

heroCard?.addEventListener("pointerleave", () => {
  heroCard.style.transform = "";
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hideLoader = () => {
  loader?.classList.add("is-done");
  document.body.classList.remove("is-loading");
};
window.setTimeout(hideLoader, 2500);

if (!reduceMotion && window.matchMedia("(pointer:fine)").matches) {
  const spotlight = Object.assign(document.createElement("div"), {
    className: "spotlight",
    ariaHidden: "true",
  });
  document.body.append(spotlight);
  window.addEventListener("pointermove", (event) => {
    spotlight.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
  }, { passive: true });

  document.querySelectorAll(".button, .nav-cta").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * .12}px, ${(event.clientY - bounds.top - bounds.height / 2) * .18}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

document.querySelectorAll(".capability").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  });
});

document.querySelectorAll(".capability, .timeline article").forEach((element, index) => {
  element.style.setProperty("--i", index);
});

document.querySelectorAll(".card-stat-row strong").forEach((element) => {
  const target = Number.parseInt(element.textContent, 10);
  if (!target || reduceMotion) return;
  let count = 0;
  element.textContent = "00";
  const timer = window.setInterval(() => {
    count += 1;
    element.textContent = String(count).padStart(2, "0");
    if (count >= target) window.clearInterval(timer);
  }, 760);
});

let lastFocus;
document.querySelectorAll(".js-resume").forEach((button) => {
  button.addEventListener("click", () => {
    lastFocus = button;
    window.setTimeout(() => resumeModal?.querySelector(".modal-close")?.focus(), 50);
    const fallbackLink = resumeModal?.querySelector(".modal-fallback a");
    if (fallbackLink) fallbackLink.href = button.dataset.resume || "#";
  });
});

resumeModal?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...resumeModal.querySelectorAll("a, button")].filter((element) => element.offsetParent);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

if (resumeModal) {
  new MutationObserver(() => {
    if (!resumeModal.classList.contains("is-open")) lastFocus?.focus();
  }).observe(resumeModal, { attributes: true, attributeFilter: ["class"] });
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
sections.forEach((section) => {
  new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    navLinks.forEach((link) => {
      link.style.color = link.getAttribute("href") === `#${section.id}` ? "var(--red)" : "";
    });
  }, { rootMargin: "-45% 0px -50% 0px" }).observe(section);
});
