const STORAGE_CURRENT = "tasks.current";
const STORAGE_PAST = "tasks.past";

function loadTasks(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
}

function saveTasks(key, tasks) {
  localStorage.setItem(key, JSON.stringify(tasks));
}

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.tab === tab);
  });

  document.getElementById("tab-current").classList.toggle("is-active", tab === "current");
  document.getElementById("tab-past").classList.toggle("is-active", tab === "past");
}

function render() {
  const current = loadTasks(STORAGE_CURRENT);
  const past = loadTasks(STORAGE_PAST);

  const currentList = document.getElementById("current-list");
  const pastList = document.getElementById("past-list");

  currentList.innerHTML = "";
  pastList.innerHTML = "";

  current.forEach((t, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.text}</span>
      <button type="button" data-action="complete" data-index="${idx}">Complete</button>
    `;
    currentList.appendChild(li);
  });

  past.forEach((t, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.text}</span>
      <button type="button" data-action="restore" data-index="${idx}">Restore</button>
      <button type="button" data-action="delete" data-index="${idx}">Delete</button>
    `;
    pastList.appendChild(li);
  });
}

function completeTask(index) {
  const current = loadTasks(STORAGE_CURRENT);
  const past = loadTasks(STORAGE_PAST);

  const [task] = current.splice(index, 1);
  if (!task) return;

  task.completedAt = new Date().toISOString();
  past.unshift(task);

  saveTasks(STORAGE_CURRENT, current);
  saveTasks(STORAGE_PAST, past);
  render();
}

function restoreTask(index) {
  const current = loadTasks(STORAGE_CURRENT);
  const past = loadTasks(STORAGE_PAST);

  const [task] = past.splice(index, 1);
  if (!task) return;

  delete task.completedAt;
  current.unshift(task);

  saveTasks(STORAGE_CURRENT, current);
  saveTasks(STORAGE_PAST, past);
  render();
}

function deletePastTask(index) {
  const past = loadTasks(STORAGE_PAST);
  past.splice(index, 1);
  saveTasks(STORAGE_PAST, past);
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  // tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // clicks in lists (event delegation)
  document.getElementById("current-list").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    if (btn.dataset.action === "complete") completeTask(Number(btn.dataset.index));
  });

  document.getElementById("past-list").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const idx = Number(btn.dataset.index);
    if (btn.dataset.action === "restore") restoreTask(idx);
    if (btn.dataset.action === "delete") deletePastTask(idx);
  });

  // initial
  switchTab("current");
  render();
});