async function loadSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  const res = await fetch("/partials/sidebar.html");
  mount.innerHTML = await res.text();

  if (typeof window.initAuth === "function") {
    window.initAuth();
  } else {
    console.error("initAuth is not defined. Did /assets/auth.js load?");
  }
}

loadSidebar();

function normalizePath(path) {
  // "/QOTD" and "/QOTD/" should be treated the same
  if (!path) return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function setActiveSidebarLink() {
  const current = normalizePath(window.location.pathname);

  const links = document.querySelectorAll(".sidebar a.sidebar-button[href]");
  if (!links.length) return;

  links.forEach((a) => a.classList.remove("is-active"));

  // exact match first (best)
  let active = Array.from(links).find((a) => normalizePath(a.getAttribute("href")) === current);

  // special case: Home should only be active when you're exactly on "/"
  if (!active && current !== "/") {
    // optional fallback: match by "startsWith" for nested routes later
    active = Array.from(links).find((a) => {
      const href = normalizePath(a.getAttribute("href"));
      return href !== "/" && current.startsWith(href);
    });
  }

  if (active) active.classList.add("is-active");
}

async function loadSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  const res = await fetch("/partials/sidebar.html");
  if (!res.ok) {
    console.error("Failed to load sidebar:", res.status);
    return;
  }

  mount.innerHTML = await res.text();

  // init login UI
  if (typeof window.initAuth === "function") window.initAuth();

  // set active nav item
  setActiveSidebarLink();
}

loadSidebar();

