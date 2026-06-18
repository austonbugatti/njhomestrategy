const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const tabButtons = document.querySelectorAll("[data-tab-button]");
const tabLinks = document.querySelectorAll("[data-tab-link]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const mapButtons = document.querySelectorAll("[data-map-button]");
const mapPanels = document.querySelectorAll("[data-map-panel]");

const defaultTab = "what-we-cover";

const setActiveTab = (tabId, updateHash = true) => {
  const currentScroll = window.scrollY;

  if (tabId === "home") {
    document.body.dataset.activeTab = "home";
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tabButton === defaultTab;
      button.classList.toggle("is-active", isActive);
      if (button.getAttribute("role") === "tab") {
        button.setAttribute("aria-selected", String(isActive));
      }
    });
    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === defaultTab;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
    if (updateHash) history.replaceState(null, "", "#home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const hasPanel = [...tabPanels].some((panel) => panel.dataset.tabPanel === tabId);
  const nextTab = hasPanel ? tabId : defaultTab;
  document.body.dataset.activeTab = nextTab;

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabButton === nextTab;
    button.classList.toggle("is-active", isActive);
    if (button.getAttribute("role") === "tab") {
      button.setAttribute("aria-selected", String(isActive));
    }
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === nextTab;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });

  if (updateHash) {
    history.replaceState(null, "", `#${nextTab}`);
    requestAnimationFrame(() => window.scrollTo(0, currentScroll));
    setTimeout(() => window.scrollTo(0, currentScroll), 80);
  }

  if (nextTab === "book") {
    const bookingFrame = document.querySelector("[data-tab-panel='book'] iframe[data-src]");
    if (bookingFrame && !bookingFrame.src) {
      bookingFrame.src = bookingFrame.dataset.src;
    }
  }
};

const setActiveMap = (mapId) => {
  mapButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mapButton === mapId);
  });

  mapPanels.forEach((panel) => {
    const isActive = panel.dataset.mapPanel === mapId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tabButton);
  });
});

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const tabId = link.dataset.tabLink;
    if (tabId) {
      event.preventDefault();
      setActiveTab(tabId);
    }

    nav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

mapButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveMap(button.dataset.mapButton);
  });
});

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

setActiveTab(window.location.hash.replace("#", "") || defaultTab, false);
window.scrollTo({ top: 0 });
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
