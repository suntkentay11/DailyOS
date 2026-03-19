// CALENDAR INPUT ENHANCEMENT

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ymdToMdy(ymd) {
  // ymd: "YYYY-MM-DD"
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return "";
  const [y, m, d] = ymd.split("-");
  return `${m}-${d}-${y}`; // "MM-DD-YYYY"
}

function mdyToYmd(mdy) {
  // mdy: "MM-DD-YYYY"
  if (!mdy || !/^\d{2}-\d{2}-\d{4}$/.test(mdy)) return "";
  const [m, d, y] = mdy.split("-");
  return `${y}-${m}-${d}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const displayInput = document.getElementById("taskDate");          // text field (MM-DD-YYYY)
  const pickerInput = document.getElementById("taskDatePicker");     // hidden type=date
  const calendarBtn = document.querySelector(".calendar-icon");

  if (!displayInput || !pickerInput || !calendarBtn) return;

  // default: today
  const now = new Date();
  const ymd = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  pickerInput.value = ymd;
  displayInput.value = ymdToMdy(ymd);

  // open picker when icon is clicked
  calendarBtn.addEventListener("click", () => {
    if (typeof pickerInput.showPicker === "function") pickerInput.showPicker();
    else pickerInput.click();
  });

  // whenever user picks a date, update visible formatted field
  pickerInput.addEventListener("change", () => {
    displayInput.value = ymdToMdy(pickerInput.value);
  });
});

// 

// Sample task data for initial display
const sampleTasks = [
  {
    id: 1,
    title: "Module 2: Build and Apply",
    description:
      "Go through all lessons in Module 2, ensuring you pause to take notes and code along actively. This module introduces real-world projects, so take the time to understand how the concepts from Module 1 are applied in practical scenarios.",
    priority: "Extreme",
    date: "05-20-2025",
    completed: false,
  },
  {
    id: 2,
    title: "Module 1: The Foundations",
    description:
      "Go through all lessons inside Module 1 at your own pace. As you progress, make detailed notes to reinforce your understanding and practice writing the code alongside the instructor.",
    priority: "Extreme",
    date: "01/05/2025",
    completed: true,
  },
];

// INITIAL SET UP AND DOM ELEMENTS

// Store tasks in memory
let tasks = [...sampleTasks];
let editingTaskId = null;
let activeTab = "inprogress"; // default tab

// DOM Elements
const taskModal = document.getElementById("taskModal");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const saveTaskBtn = document.getElementById("saveTaskBtn");
const tasksWrapper = document.querySelector(".tasks-wrapper");
const taskDetailsPanel = document.querySelector(".task-details");
const addTaskBtn = document.getElementById("addTaskBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const searchInput = document.querySelector(".nav__search");
const searchButton = document.querySelector(".nav__search-button");
const taskDateDisplayInput = document.getElementById("taskDate");      // MM-DD-YYYY
const taskDatePickerInput = document.getElementById("taskDatePicker"); // YYYY-MM-DD (hidden picker)

// DOMCONTENTLOADED EVENT
document.addEventListener("DOMContentLoaded", function () {
  renderTasks();
  if (tasks.length > 0) {
    selectTask(tasks[0].id);
  } else {
    showEmptyState();
  }

  // Event Listeners
  addTaskBtn.addEventListener("click", openAddTaskModal);
  closeModalBtn.addEventListener("click", closeModal);
  saveTaskBtn.addEventListener("click", saveTask);
  if (searchButton) searchButton.addEventListener("click", searchTasks);
  if (searchInput) searchInput.addEventListener("input", searchTasks);

  // TAB BUTTONS
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;

      // highlight active button
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      // re-render list
      renderTasks();

      // select first task in this tab so details show
      const visible = getVisibleTasks();
      if (visible.length > 0) selectTask(visible[0].id);
      else taskDetailsPanel.innerHTML = "";
    });
  });

  // Close modal on outside click
  window.addEventListener("click", function (event) {
    if (event.target === taskModal) {
      closeModal();
    }
  });
});

function getVisibleTasks() {
  if (activeTab === "completed") {
    return tasks.filter((t) => t.completed);
  }
  return tasks.filter((t) => !t.completed);
}

// CREATING AND RENDERING ELEMENTS
function renderTasks() {
  tasksWrapper.innerHTML = "";

  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    tasksWrapper.innerHTML = `
      <div class="empty-state">
        <p>No tasks in this tab yet.</p>
      </div>
    `;
    taskDetailsPanel.innerHTML = "";
    return;
  }

  visibleTasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    tasksWrapper.appendChild(taskCard);
  });
}

function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.dataset.id = task.id;

  // Create the task card content
  taskCard.innerHTML = `
    <div class="task-status">
      <div class="status-circle ${task.completed ? "completed" : ""}">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${
          task.completed ? "white" : "currentColor"
        }" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="task-title">${task.title}</div>
    </div>
    <div class="task-description">${truncateText(task.description, 100)}</div>
    <div class="task-info">
        <span class="priority-info">Priority: <span class="${task.priority.toLowerCase()}">${task.priority}</span></span>
        <span class="date-info">Created on: ${task.date}</span>
    </div>
  `;
  // Add click event to select task
  taskCard.addEventListener("click", () => {
    selectTask(task.id);
  });

  // Add click event to toggle completion status
  const statusCircle = taskCard.querySelector(".status-circle");
  statusCircle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  });

  return taskCard;
}

// HANDELING EVENTS AND USER INTERACTIONS
function selectTask(taskId) {
  // Deselect all tasks
  document.querySelectorAll(".task-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Select the clicked task
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    taskCard.classList.add("selected");
  }

  // Fine the task data
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Update the details panel
  taskDetailsPanel.innerHTML = `
    <div class="task-detail-header">
      <h2>${task.title}</h2>
      <div class="detail-meta">
        <div class="detail-meta-item">
          <span class="meta-label">Priority:</span> 
          <span class="${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        <div class="detail-meta-item">
          <span class="meta-label">Created on:</span> 
          <span>${task.date}</span>
        </div>
      </div>
    </div>
    
    <div class="detail-description">
      <p>${task.description}</p>
    </div>

    <div class="action-buttons">
      <button class="action-btn btn-secondary" id="editCurrentTaskBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="action-btn btn-primary" id="deleteCurrentTaskBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
    </div>
  `;
  // Add event listeners for edit and delete buttons
  document
    .getElementById("editCurrentTaskBtn")
    .addEventListener("click", () => openEditTaskModal(taskId));
  document
    .getElementById("deleteCurrentTaskBtn")
    .addEventListener("click", () => deleteTask(taskId));
}

function openEditTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  modalTitle.textContent = "Edit Task";
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;

  // Task date is stored as MM-DD-YYYY
  if (taskDateDisplayInput) taskDateDisplayInput.value = task.date;

  // Also sync hidden picker so the calendar opens on the same date
  if (taskDatePickerInput) taskDatePickerInput.value = mdyToYmdLoose(task.date);

  // Set priority radio (values are lowercase in HTML)
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value.toLowerCase() === task.priority.toLowerCase();
  });

  taskModal.style.display = "flex";
}

// HELPER FUNCTIONS
// truncate text with ellipsis
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// show empty state when no tasks
function showEmptyState() {
  tasksWrapper.innerHTML = `
    <div class="empty-state">
      <p>No tasks found. Click "Add Task" to create your first task!</p>
    </div>
  `;

  // clear details panel
  taskDetailsPanel.innerHTML = "";
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].completed = !tasks[taskIndex].completed;

  // redraw list (so it moves between tabs)
  renderTasks();

  // pick a task to show in details (first visible in current tab)
  const visible = getVisibleTasks();
  if (visible.length > 0) selectTask(visible[0].id);
  else taskDetailsPanel.innerHTML = "";
}

// FORM HANDLING
function openAddTaskModal() {
  // reset form
  editingTaskId = null;
  modalTitle.textContent = "Add New Task";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";

  const taskDateDisplayInput = document.getElementById("taskDate");       // MM-DD-YYYY (text)
  const taskDatePickerInput = document.getElementById("taskDatePicker");  // YYYY-MM-DD (date)

  // set default priority (Low)
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value === "Low";
  });

  // show modal
  taskModal.style.display = "flex";
}

//Open modal to edit existing task
function openAddTaskModal() {
  editingTaskId = null;
  modalTitle.textContent = "Add New Task";
  taskTitleInput.value = "";
  taskDescriptionInput.value = "";

  // Set date to today (store/display as MM-DD-YYYY)
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yyyy = now.getFullYear();

  if (taskDateDisplayInput) taskDateDisplayInput.value = `${mm}-${dd}-${yyyy}`;
  if (taskDatePickerInput) taskDatePickerInput.value = `${yyyy}-${mm}-${dd}`;

  // Set default priority (low)
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    radio.checked = radio.value.toLowerCase() === "low";
  });

  taskModal.style.display = "flex";
}

// SAVING AND VALIDATING FORM DATA
function saveTask() {
  // Validate Title
  if (!taskTitleInput.value.trim()) {
    alert("Please enter a task title.");
    return;
  }
  
  const taskDateDisplayInput = document.getElementById("taskDate");

  // Get selected Priority
  let selectedPriority = "Low"; // default
  document.querySelectorAll('input[name="priority"]').forEach((radio) => {
    if (radio.checked) {
      selectedPriority = radio.value.charAt(0).toUpperCase() + radio.value.slice(1); // capitalize first letter
    }
  });

  if (editingTaskId === null) {
    // Create new task
    const newTask = {
      id: Date.now(),
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      priority: selectedPriority,
      date: taskDateDisplayInput.value,
      completed: false,
    };
    tasks.unshift(newTask); // add to the beginning
    renderTasks();
    selectTask(newTask.id);
  } else {
    // Update existing task
    const taskIndex = tasks.findIndex((t) => t.id === editingTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].title = taskTitleInput.value.trim();
      tasks[taskIndex].description = taskDescriptionInput.value.trim();
      tasks[taskIndex].priority = selectedPriority;
      tasks[taskIndex].date = taskDateDisplayInput.value;
      renderTasks();
      selectTask(editingTaskId);
    }
  }
  // close modal
  closeModal();
}

function deleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  tasks.splice(taskIndex, 1);
  renderTasks();

  if (tasks.length > 0) {
    selectTask(tasks[0].id);
  } else {
    showEmptyState();
  }
}

// SEARCH FUNCTIONALITY
function searchTasks() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    renderTasks();
    if (tasks.length > 0) {
      selectTask(tasks[0].id);
    }
    return;
  }

  const filteredTasks = tasks.filter((task) =>
  task.title.toLowerCase().includes(searchTerm)
  );

  if (filteredTasks.length === 0) {
    tasksWrapper.innerHTML = `
      <div class="empty-state">
        <p>No tasks match your search. Try a different keyword?</p>
      </div>
    `;
    taskDetailsPanel.innerHTML = "";
  } else {
    tasksWrapper.innerHTML = "";
    filteredTasks.forEach((task) => {
      const taskCard = createTaskCard(task);
      tasksWrapper.appendChild(taskCard);
    });
    selectTask(filteredTasks[0].id);
  }
}

function closeModal(e) {
  if (e) e.preventDefault();
  taskModal.style.display = "none";
}

function mdyToYmdLoose(mdy) {
  // expects MM-DD-YYYY
  if (!mdy || !/^\d{2}-\d{2}-\d{4}$/.test(mdy)) return "";
  const [m, d, y] = mdy.split("-");
  return `${y}-${m}-${d}`;
}