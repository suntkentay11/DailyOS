function normalizePath(path) {
  if (!path) return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function setActiveSidebarLink() {
  const current = normalizePath(window.location.pathname);
  const links = document.querySelectorAll(".sidebar a.sidebar-button[href]");
  if (!links.length) return;

  links.forEach((a) => a.classList.remove("is-active"));

  let active = Array.from(links).find((a) => normalizePath(a.getAttribute("href")) === current);

  if (!active && current !== "/") {
    active = Array.from(links).find((a) => {
      const href = normalizePath(a.getAttribute("href"));
      return href !== "/" && current.startsWith(href);
    });
  }

  if (active) active.classList.add("is-active");
}

// IMPORTANT: relative path because you start Live Server from a subfolder
async function loadSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  const res = await fetch("../partials/sidebar.html");
  if (!res.ok) {
    console.error("Failed to load sidebar:", res.status, res.statusText);
    return;
  }

  mount.innerHTML = await res.text();

  if (typeof window.initAuth === "function") {
    window.initAuth();
  } else {
    console.error("initAuth is not defined. Did ../assets/auth.js load?");
  }

  setActiveSidebarLink();
}

loadSidebar();