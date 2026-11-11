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
  localStorage.setItem("portfolio-theme", theme);
};

const savedTheme = localStorage.getItem("portfolio-theme");
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
}, 2600);

heroCard?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = heroCard.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  heroCard.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-4px)`;
});

heroCard?.addEventListener("pointerleave", () => {
  heroCard.style.transform = "";
});
