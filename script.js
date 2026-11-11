          const menuToggle = document.querySelector(".menu-toggle");
          const siteNav = document.querySelector("#site-nav");
          const loader = document.querySelector(".page-loader");
          const resumeModal = document.querySelector(".resume-modal");
          const resumeFrame = resumeModal?.querySelector("iframe");
          const resumeTitle = resumeModal?.querySelector("#resume-modal-title");
          const resumeDownload = resumeModal?.querySelector(".modal-download");
          const themeToggle = document.querySelector(".theme-toggle");
          const progressBar = document.querySelector(".scroll-progress span");
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

          const reduceMotion = true;
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

          document.querySelectorAll(".capability, .timeline article").forEach((element, index) => {
            element.style.setProperty("--i", index);
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
