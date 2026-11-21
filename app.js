const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

function setMenu(open) {
  if (!menuToggle || !nav) return;
  nav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.querySelectorAll("[data-email]").forEach((button) => {
  const label = button.querySelector("[data-copy-label]");
  if (!label) return;
  const original = label.textContent;
  let timer;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.email);
    } catch {
      window.prompt("Copia el correo:", button.dataset.email);
      return;
    }
    label.textContent = "Copiado";
    button.classList.add("is-copied");
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = original;
      button.classList.remove("is-copied");
    }, 2000);
  });
});

const printButton = document.getElementById("print-cv");
if (printButton) printButton.addEventListener("click", () => window.print());

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const out = document.getElementById("term-out");
const form = document.getElementById("term-form");
const input = document.getElementById("term-input");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.dataset.tab;
    });
    if (tab.dataset.tab === "panel-bash" && input) input.focus({ preventScroll: true });
  });
});

const commands = {
  help: [
    "Comandos disponibles:",
    "  help       lista de comandos",
    "  whoami     quién soy",
    "  stack      tecnologías que uso",
    "  proyectos  proyectos del portfolio",
    "  nmap       escaneo de puertos públicos",
    "  ping       latencia del edge",
    "  clear      limpia la pantalla",
  ],
  whoami: [
    "[Nicolás Casado Viúdez]",
    "2º ASIR · Futuro estudiante de Ingeniería Informática",
    "[Granada, ESPAÑA] · Disponible para prácticas FCT",
  ],
  stack: [
    "redes   Linux, Windows Server, TCP/IP, DNS/DHCP, Nginx, Cloudflare, nftables/UFW",
    "ops     Docker, Docker Compose, Git, GitHub Actions, Bash, PowerShell",
    "dev     Python, FastAPI, SQL/SQLite, HTML/CSS, APIs REST",
  ],
  proyectos: [
    "1. Asistente Personal y Centro de Mando Zero-Trust (en desarrollo)",
    "   iPhone Shortcuts -> Cloudflare Tunnel/Access -> FastAPI -> SQLite",
    "2. [NOMBRE DE TU PRÁCTICA O PROYECTO DE ASIR]",
    "   [Cliente] -> [Nginx] -> [Docker Compose] -> [Servicios]",
  ],
  sudo: ["Permiso denegado: este incidente será reportado al administrador."],
  nmap: ["Escaneando puertos públicos... 0 puertos abiertos (protegido por Cloudflare Zero Trust)."],
  ping: ["PONG — latencia edge Cloudflare < 15ms."],
};

if (out && form && input) {
  const history = [];
  let cursor = 0;

  function print(text, className) {
    const line = document.createElement("div");
    if (className) line.className = className;
    line.textContent = text;
    out.appendChild(line);
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const name = cmd.split(/\s+/)[0];

    if (name === "clear") {
      out.replaceChildren();
      return;
    }

    const echo = document.createElement("div");
    const prompt = document.createElement("span");
    prompt.className = "ps";
    prompt.textContent = "$ ";
    const typed = document.createElement("span");
    typed.className = "cmd";
    typed.textContent = cmd;
    echo.append(prompt, typed);
    out.appendChild(echo);

    if (Object.hasOwn(commands, name)) {
      commands[name].forEach((line) => print(line, "hl"));
    } else {
      print(`${cmd}: comando no encontrado. Prueba con help.`, "err");
    }
    out.scrollTop = out.scrollHeight;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value.trim()) {
      history.push(input.value);
      cursor = history.length;
    }
    run(input.value);
    input.value = "";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && cursor > 0) {
      event.preventDefault();
      input.value = history[--cursor];
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      cursor = Math.min(cursor + 1, history.length);
      input.value = history[cursor] ?? "";
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => run(chip.dataset.cmd));
  });

  print("Escribe help para ver los comandos.");
}

document.querySelectorAll(".project-visual").forEach((figure) => {
  const nodes = figure.querySelectorAll(".node");
  const inspector = figure.querySelector(".node-inspector");
  if (!inspector) return;
  const hint = inspector.textContent.trim();

  function reset() {
    const text = document.createElement("p");
    text.className = "inspector-hint";
    text.textContent = hint;
    inspector.replaceChildren(text);
  }

  function select(node) {
    const wasActive = node.classList.contains("is-active");
    nodes.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });

    if (wasActive) {
      reset();
      return;
    }

    node.classList.add("is-active");
    node.setAttribute("aria-pressed", "true");

    const title = document.createElement("p");
    title.className = "inspector-title";
    title.textContent = node.dataset.title;
    const spec = document.createElement("p");
    spec.className = "inspector-spec";
    spec.textContent = node.dataset.spec;
    inspector.replaceChildren(title, spec);
  }

  nodes.forEach((node) => {
    node.addEventListener("click", () => select(node));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select(node);
      }
    });
  });
});

function spyKey(link) {
  const href = link.getAttribute("href");
  if (href.startsWith("#")) return href.slice(1);
  if (link.classList.contains("is-active") && document.getElementById("inicio")) return "inicio";
  if (href === "proyectos.html" && document.getElementById("proyectos")) return "proyectos";
  return null;
}

const spyLinks = new Map(
  [...document.querySelectorAll(".nav a")].map((link) => [spyKey(link), link]).filter(([key]) => key)
);

if (spyLinks.size && "IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const current = spyLinks.get(entry.target.id);
        spyLinks.forEach((link) => link.classList.toggle("is-active", link === current));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document
    .querySelectorAll("#inicio, #proyectos, #stack, #formacion")
    .forEach((section) => spy.observe(section));
}

const activity = document.getElementById("gh-activity");
const activityText = document.getElementById("gh-text");

function timeAgo(iso) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(iso)) / 60000));
  if (minutes < 60) return `hace ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
}

async function loadActivity(user) {
  if (!user || !/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i.test(user)) return;
  const key = `gh-activity:${user}`;

  function show(data) {
    const { name, at } = data ?? {};
    if (typeof name !== "string" || !name || typeof at !== "string" || !Number.isFinite(Date.parse(at))) {
      return false;
    }

    activityText.textContent = `Último push en GitHub: ${name} · ${timeAgo(at)}`;
    activity.classList.add("is-live");
    return true;
  }

  try {
    const cached = sessionStorage.getItem(key);
    if (cached && show(JSON.parse(cached))) return;
  } catch {}

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/events/public`);
    if (!response.ok) return;
    const events = await response.json();
    if (!Array.isArray(events)) return;
    const push = events.find((event) =>
      event?.type === "PushEvent" &&
      typeof event.repo?.name === "string" &&
      typeof event.created_at === "string" &&
      Number.isFinite(Date.parse(event.created_at))
    );
    if (!push) return;
    const data = { name: push.repo.name.split("/").pop(), at: push.created_at };
    if (!show(data)) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch {}
  } catch {}
}

if (activity && activityText) loadActivity(activity.dataset.user);
