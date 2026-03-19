const AUTH_KEY = "wellnessUser";

function initAuth() {
  const loggedOutEl = document.getElementById("auth-logged-out");
  const loggedInEl = document.getElementById("auth-logged-in");
  const authForm = document.getElementById("auth-form");
  const authNameInput = document.getElementById("auth-name");
  const authEmailInput = document.getElementById("auth-email");
  const profileNameEl = document.getElementById("profile-name");
  const profileEmailEl = document.getElementById("profile-email");
  const logoutBtn = document.getElementById("logout-button");

  // If any are missing, stop and tell you in console
  if (!loggedOutEl || !loggedInEl || !authForm || !authEmailInput || !profileNameEl || !profileEmailEl || !logoutBtn) {
    console.error("Auth elements missing. Check IDs in partials/sidebar.html");
    console.log({ loggedOutEl, loggedInEl, authForm, authNameInput, authEmailInput, profileNameEl, profileEmailEl, logoutBtn });
    return;
  }

  function getUser() {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  function setUser(user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
  function clearUser() {
    localStorage.removeItem(AUTH_KEY);
  }

  function render() {
    const user = getUser();
    if (!user) {
      loggedOutEl.style.display = "block";
      loggedInEl.style.display = "none";
      return;
    }
    loggedOutEl.style.display = "none";
    loggedInEl.style.display = "block";
    profileNameEl.textContent = user.name || "User";
    profileEmailEl.textContent = user.email || "";
  }

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = authEmailInput.value.trim();
    const name = authNameInput?.value.trim();
    if (!email) return;

    setUser({ email, name: name || email.split("@")[0] });
    authForm.reset();
    render();
  });

  logoutBtn.addEventListener("click", () => {
    clearUser();
    render();
  });

  render();
}

window.initAuth = initAuth;


