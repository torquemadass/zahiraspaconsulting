window.dataLayer = window.dataLayer || [];
const WHATSAPP_NUMBER = "628170060996";
const DEFAULT_MESSAGE =
  "Hello! I'm interested in Zahira's spa setup & launch services.";

document.getElementById("year").textContent = new Date().getFullYear();

let lenis;
if (window.Lenis && window.innerWidth >= 992) {
  lenis = new Lenis({ 
    autoRaf: true,
    smoothTouch: false,
  });
}

// Toggle Lenis based on window resize
window.addEventListener('resize', () => {
  if (window.innerWidth < 992 && lenis) {
    lenis.destroy();
    lenis = null;
  } else if (window.innerWidth >= 992 && !lenis && window.Lenis) {
    lenis = new Lenis({ autoRaf: true, smoothTouch: false });
  }
});

function initWhatsAppLinks() {
  const waEls = document.querySelectorAll(".contact-wa");
  waEls.forEach((el) => {
    const msg = el.getAttribute("data-msg") || DEFAULT_MESSAGE;
    const encoded = encodeURIComponent(msg.trim());
    el.setAttribute(
      "href",
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
    );
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
    el.addEventListener("click", () => {
      window.dataLayer.push({
        event: "wa_click",
        label: msg.substring(0, 60),
      });
    });
  });

  const float = document.querySelector("#whatsapp-float .wa-float-btn");
  if (float) {
    const msg = float.getAttribute("data-msg") || DEFAULT_MESSAGE;
    float.setAttribute(
      "href",
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    );
    float.setAttribute("target", "_blank");
    float.setAttribute("rel", "noopener noreferrer");
    float.addEventListener("click", () => {
      window.dataLayer.push({ event: "wa_click", label: "float_button" });
    });
    float.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        float.click();
      }
    });
  }
}

function initFloatingNavbar() {
  const nav = document.getElementById("floating-navbar");
  const offsetShow = 50,
    offsetShrink = 120;
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY || window.pageYOffset;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (y > offsetShow) {
            nav.classList.add("show");
          } else {
            nav.classList.remove("show");
            nav.classList.remove("shrink");
          }
          if (y > offsetShrink) nav.classList.add("shrink");
          else nav.classList.remove("shrink");
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

function initWhatsAppFloat() {
  const container = document.getElementById("whatsapp-float");
  if (!container) return;
  const threshold = 200;
  window.addEventListener(
    "scroll",
    () => {
      if (window.pageYOffset > threshold) container.classList.add("show");
      else container.classList.remove("show");
    },
    { passive: true }
  );
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      if (this.classList.contains("contact-wa")) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - 92;
        if (prefersReduced) {
          window.scrollTo(0, top);
        } else {
          window.scrollTo({ top, behavior: "smooth" });
        }
        setTimeout(() => {
          target.setAttribute("tabindex", "-1");
          target.focus();
        }, 600);
      }
    });
  });
}

(function enhanceDropdownAccessibility() {
  function focusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) =>
        el.offsetWidth || el.offsetHeight || el.getClientRects().length
    );
  }

  function bootstrapToggleDropdown(toggle) {
    if (window.bootstrap && bootstrap.Dropdown) {
      const inst = bootstrap.Dropdown.getOrCreateInstance(toggle);
      inst.toggle();
    } else {
      const parent = toggle.closest(".dropdown");
      if (!parent) return;
      parent.classList.toggle("show");
      const menu = parent.querySelector(".dropdown-menu");
      menu && menu.classList.toggle("show");
      toggle.setAttribute(
        "aria-expanded",
        parent.classList.contains("show") ? "true" : "false"
      );
    }
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown.show").forEach((parent) => {
      const toggle = parent.querySelector('[data-bs-toggle="dropdown"]');
      if (toggle && window.bootstrap && bootstrap.Dropdown)
        bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
      else {
        parent.classList.remove("show");
        parent
          .querySelectorAll(".dropdown-menu")
          .forEach((m) => m.classList.remove("show"));
        toggle && toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
      closeAllDropdowns();
      document
        .querySelectorAll(".navbar-collapse.show")
        .forEach((col) => {
          if (window.bootstrap && bootstrap.Collapse)
            bootstrap.Collapse.getOrCreateInstance(col).hide();
          else col.classList.remove("show");
        });
    }
  });

  document.addEventListener(
    "click",
    (ev) => {
      document.querySelectorAll(".dropdown.show").forEach((parent) => {
        if (!parent.contains(ev.target)) {
          const toggle = parent.querySelector(
            '[data-bs-toggle="dropdown"]'
          );
          if (toggle && window.bootstrap && bootstrap.Dropdown)
            bootstrap.Dropdown.getOrCreateInstance(toggle).hide();
          else {
            parent.classList.remove("show");
            parent
              .querySelectorAll(".dropdown-menu")
              .forEach((m) => m.classList.remove("show"));
            toggle && toggle.setAttribute("aria-expanded", "false");
          }
        }
      });
    },
    true
  );

  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll('[data-bs-toggle="dropdown"]')
      .forEach((toggle) => {
        const parent = toggle.closest(".dropdown");
        const menu = parent && parent.querySelector(".dropdown-menu");
        toggle.setAttribute("aria-haspopup", "true");
        toggle.addEventListener("keydown", (e) => {
          if (
            ["Enter", " ", "Spacebar", "ArrowDown", "ArrowUp"].includes(
              e.key
            )
          ) {
            e.preventDefault();
            bootstrapToggleDropdown(toggle);
            setTimeout(() => {
              const items = menu ? focusable(menu) : [];
              if (!items.length) return;
              if (e.key === "ArrowUp") items[items.length - 1].focus();
              else items[0].focus();
            }, 140);
          }
        });

        if (menu) {
          menu.addEventListener("keydown", (e) => {
            const items = focusable(menu);
            if (!items.length) return;
            const idx = items.indexOf(document.activeElement);
            if (e.key === "ArrowDown") {
              e.preventDefault();
              items[(idx + 1) % items.length].focus();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              items[(idx - 1 + items.length) % items.length].focus();
            } else if (e.key === "Home") {
              e.preventDefault();
              items[0].focus();
            } else if (e.key === "End") {
              e.preventDefault();
              items[items.length - 1].focus();
            } else if (e.key === "Tab") {
              e.preventDefault();
              if (e.shiftKey)
                items[(idx - 1 + items.length) % items.length].focus();
              else items[(idx + 1) % items.length].focus();
            } else if (e.key === "Escape" || e.key === "Esc") {
              e.preventDefault();
              closeAllDropdowns();
              toggle.focus();
            }
          });
        }
      });
  });
})();
function initAboutCollapse() {
  const collapseEl = document.getElementById("aboutTextCollapse");
  if (!collapseEl) return;
  const btnText = document.querySelector(".read-story-btn .btn-text");

  collapseEl.addEventListener("show.bs.collapse", () => {
    if (btnText) btnText.textContent = "Show Less";
  });

  collapseEl.addEventListener("hide.bs.collapse", () => {
    if (btnText) btnText.textContent = "Read Full Story";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initWhatsAppLinks();
  initFloatingNavbar();
  initWhatsAppFloat();
  initSmoothAnchors();
  initAboutCollapse();

  const ann = document.createElement("div");
  ann.setAttribute("role", "status");
  ann.setAttribute("aria-live", "polite");
  ann.className = "visually-hidden";
  ann.textContent = "Zahira Spa Consulting site loaded";
  document.body.appendChild(ann);
});