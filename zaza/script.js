const revealItems = document.querySelectorAll(".reveal");
const navigationLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const projectModal = document.querySelector("#project-modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalCategory = document.querySelector("#modal-category");
const modalDescription = document.querySelector("#modal-description");
const modalYear = document.querySelector("#modal-year");
const projectFeatureCard = document.querySelector(".project-feature");

const projectDetails = {
  miniature: {
    title: "Miniature",
    category: "Arduino project",
    year: "2025",
    image: "pic/f30d4f28-4359-40f8-a48e-eefeae7d676c.jpg",
    description:
      "A miniature sampayan prototype designed with Arduino, combining the idea of a smart household utility with a hands-on electronics project that showcases creativity and technical problem-solving.",
  },
};

const setTheme = (isLight) => {
  document.body.classList.toggle("light-theme", isLight);
  document.body.style.setProperty(
    "background",
    isLight ? "#f4f1ff" : "#07070b",
    "important",
  );
  document.body.style.setProperty(
    "color",
    isLight ? "#211a31" : "#f5f2ff",
    "important",
  );
  themeToggle.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode",
  );
  themeToggle.setAttribute("aria-pressed", String(isLight));
};

setTheme(localStorage.getItem("navia-theme") === "light");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) =>
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`,
        ),
      );
    });
  },
  { rootMargin: "-35% 0px -55% 0px" },
);

sections.forEach((section) => sectionObserver.observe(section));

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
});

navigationLinks.forEach((link) =>
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }),
);

themeToggle.addEventListener("click", () => {
  const isLight = !document.body.classList.contains("light-theme");
  setTheme(isLight);
  localStorage.setItem("navia-theme", isLight ? "light" : "dark");
});

document.querySelectorAll(".project-visual").forEach((visual) => {
  visual.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = visual.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
    visual.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  visual.addEventListener("pointerleave", () => {
    visual.style.transform = "";
  });
});

const closeProjectModal = () => {
  if (!projectModal) return;
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

const openProjectModal = (projectKey) => {
  const project = projectDetails[projectKey];
  if (!project || !projectModal) return;

  modalImage.src = project.image;
  modalImage.alt = `${project.title} project preview`;
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalDescription.textContent = project.description;
  modalYear.textContent = project.year;

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelector(".modal-close").focus();
};

if (projectFeatureCard) {
  projectFeatureCard.addEventListener("click", () => {
    openProjectModal(projectFeatureCard.dataset.project);
  });
}

projectModal?.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("open")) {
    closeProjectModal();
  }
});
