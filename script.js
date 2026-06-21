const revealElements = document.querySelectorAll("[data-reveal]");
const glow = document.querySelector(".cursor-glow");

const icons = {
  sparkles: [
    '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/>',
    '<path d="m5 3 .8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8L5 3Z"/>',
    '<path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  ],
  "arrow-down": ['<path d="M12 5v14"/>', '<path d="m19 12-7 7-7-7"/>'],
  armchair: [
    '<path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    '<path d="M5 11h14a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2Z"/>',
    '<path d="M5 17v4"/>',
    '<path d="M19 17v4"/>',
  ],
  wind: [
    '<path d="M3 8h12a3 3 0 1 0-3-3"/>',
    '<path d="M4 12h15a3 3 0 1 1-3 3"/>',
    '<path d="M3 16h9"/>',
  ],
  gauge: [
    '<path d="M20.4 14.2A9 9 0 1 0 3.6 14.2"/>',
    '<path d="M12 13 16 9"/>',
    '<path d="M8 21h8"/>',
  ],
  "shield-check": [
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    '<path d="m9 12 2 2 4-5"/>',
  ],
  send: ['<path d="m22 2-7 20-4-9-9-4Z"/>', '<path d="M22 2 11 13"/>'],
  check: ['<path d="M20 6 9 17l-5-5"/>'],
};

function createIcon(name) {
  const paths = icons[name];
  if (!paths) return "";
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.join("")}</svg>`;
}

function createIcons() {
  document.querySelectorAll("[data-lucide]").forEach((node) => {
    const icon = createIcon(node.getAttribute("data-lucide"));
    if (icon) node.outerHTML = icon;
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => observer.observe(element));

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.transform = `translate3d(${event.clientX - 144}px, ${event.clientY - 144}px, 0)`;
});

document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    const packageSelect = document.querySelector('select[name="package"]');
    if (!packageSelect) return;
    packageSelect.value = link.dataset.package;
  });
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const details = [
    `Name: ${data.get("name") || ""}`,
    `Kontakt: ${data.get("contact") || ""}`,
    `Fahrzeug: ${data.get("car") || ""}`,
    `Paket: ${data.get("package") || ""}`,
    `Wunschdatum: ${data.get("date") || "nicht angegeben"}`,
    `Wunschzeit: ${data.get("time") || "nicht angegeben"}`,
    `Ort: ${data.get("place") || "nicht angegeben"}`,
    "",
    "Nachricht:",
    data.get("message") || "Keine weitere Nachricht.",
  ].join("\n");
  const subject = `Terminanfrage RTXN AutoLuxe - ${data.get("package") || "Aufbereitung"}`;
  const mailto = `mailto:rtxn.autoluxe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  const button = form.querySelector("button");
  const original = button.innerHTML;
  window.location.href = mailto;
  button.innerHTML = `${createIcon("check")} Mail vorbereitet`;
  button.disabled = true;

  window.setTimeout(() => {
    button.innerHTML = original;
    button.disabled = false;
    createIcons();
  }, 2600);
});

createIcons();
