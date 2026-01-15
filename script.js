// ====== Theme Switching ======
const themes = ["theme-pastel", "theme-dark", "theme-vibrant"];
let currentTheme = 0;
const body = document.body;
document.getElementById("themeBtn").addEventListener("click", () => {
  body.classList.remove(themes[currentTheme]);
  currentTheme = (currentTheme + 1) % themes.length;
  body.classList.add(themes[currentTheme]);
});
// ====== Modal ======
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");
helpBtn.addEventListener("click", () => (helpModal.style.display = "flex"));
closeHelp.addEventListener("click", () => (helpModal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target == helpModal) helpModal.style.display = "none";
});
// ====== Auto-save Tagline (Page 1) ======
const tagline = document.querySelector("#page1 .tagline");
if (localStorage.getItem("tagline")) {
  tagline.innerText = localStorage.getItem("tagline");
}
tagline.addEventListener("input", () => {
  localStorage.setItem("tagline", tagline.innerText);
});
// ====== Vision Board ======
const visionBoard = document.getElementById("visionBoard");
const addCardBtn = document.getElementById("addCardBtn");
const clearBoardBtn = document.getElementById("clearBoardBtn");
const fileInput = document.getElementById("fileInput");
let boardData = JSON.parse(localStorage.getItem("visionBoard")) || [];
// ====== Save & Render ======
function saveBoard() {
  localStorage.setItem("visionBoard", JSON.stringify(boardData));
}
function renderBoard() {
  visionBoard.innerHTML = "";
  boardData.forEach((card, idx) => {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.index = idx;
    div.setAttribute("draggable", "true");
    // Buttons container (File + URL + delete content)
    const btnContainer = document.createElement("div");
    btnContainer.className = "card-buttons";
    const addFileBtn = document.createElement("button");
    addFileBtn.innerText = "File";
    addFileBtn.onclick = () => {
      fileInput.dataset.idx = idx;
      fileInput.click();
    };
    const addURLBtn = document.createElement("button");
    addURLBtn.innerText = "URL";
    addURLBtn.onclick = () => {
      const url = prompt("Enter image URL:");
      if (url) {
        card.content = { type: "image", data: url };
        saveBoard();
        renderBoard();
      }
    };
    const delContentBtn = document.createElement("button");
    delContentBtn.innerText = "X";
    delContentBtn.onclick = () => {
      card.content = null;
      saveBoard();
      renderBoard();
    };
    btnContainer.append(addFileBtn, addURLBtn, delContentBtn);
    div.appendChild(btnContainer);
    // Show content
    if (card.content) {
      if (card.content.type === "image") {
        const img = document.createElement("img");
        img.src = card.content.data;
        div.appendChild(img);
      } else if (card.content.type === "text") {
        const p = document.createElement("p");
        p.innerText = card.content.data;
        div.appendChild(p);
      }
    }
    // Delete full card
    const delCard = document.createElement("button");
    delCard.className = "delete-card-full";
    delCard.innerText = "Delete Card";
    delCard.onclick = () => {
      boardData.splice(idx, 1);
      saveBoard();
      renderBoard();
    };
    div.appendChild(delCard);
    visionBoard.appendChild(div);
  });
}
renderBoard();
// ====== Add new empty card ======
addCardBtn.onclick = () => {
  boardData.unshift({ content: null });
  saveBoard();
  renderBoard();
};
// ====== File Input ======
fileInput.addEventListener("change", (e) => {
  const idx = e.target.dataset.idx;
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      boardData[idx].content = { type: "image", data: ev.target.result };
      saveBoard();
      renderBoard();
    };
    reader.readAsDataURL(file);
  }
  fileInput.value = "";
});
// ====== Drag & Drop ======
let draggedIdx = null;
visionBoard.addEventListener("dragstart", (e) => {
  draggedIdx = e.target.dataset.index;
  e.target.style.opacity = "0.5";
});
visionBoard.addEventListener("dragend", (e) => {
  e.target.style.opacity = "1";
});
visionBoard.addEventListener("dragover", (e) => {
  e.preventDefault();
});
visionBoard.addEventListener("drop", (e) => {
  e.preventDefault();
  const target = e.target.closest(".card");
  if (target && draggedIdx !== null) {
    const targetIdx = target.dataset.index;
    const draggedCard = boardData.splice(draggedIdx, 1)[0];
    boardData.splice(targetIdx, 0, draggedCard);
    saveBoard();
    renderBoard();
  }
});
//   =====  Goals page    =====
const goalsBoard = document.getElementById("goalsBoard");
const addSectionBtn = document.getElementById("addSectionBtn");
const clearSectionsBtn = document.getElementById("clearSectionsBtn");
let goalsData = JSON.parse(localStorage.getItem("goalsData")) || [];
// ===== Save & Render =====
function saveGoals() {
  localStorage.setItem("goalsData", JSON.stringify(goalsData));
}
function renderGoals() {
  goalsBoard.innerHTML = "";
  goalsData.forEach((section, sIdx) => {
    const div = document.createElement("div");
    div.className = "section-card";
    div.dataset.index = sIdx;
    // Section Title
    const sectionInput = document.createElement("input");
    sectionInput.className = "section-title";
    sectionInput.type = "text";
    sectionInput.value = section.title || "";
    sectionInput.placeholder = "Enter Section Name";
    sectionInput.oninput = () => {
      section.title = sectionInput.value;
      saveGoals();
    };
    div.appendChild(sectionInput);
    // Goals inside section
    if (section.goals) {
      section.goals.forEach((goal, gIdx) => {
        const goalDiv = document.createElement("div");
        goalDiv.className = "goal-card";
        // Goal title
        const goalInput = document.createElement("input");
        goalInput.className = "goal-title";
        goalInput.type = "text";
        goalInput.value = goal.title;
        goalInput.placeholder = "Goal Name";
        goalInput.oninput = () => {
          goal.title = goalInput.value;
          saveGoals();
        };
        goalDiv.appendChild(goalInput);
        // Goal tasks/ habits
        const goalTasks = document.createElement("textarea");
        goalTasks.className = "goal-tasks";
        goalTasks.placeholder = "Tasks / Habits";
        goalTasks.value = goal.tasks;
        goalTasks.oninput = () => {
          goal.tasks = goalTasks.value;
          saveGoals();
        };
        goalDiv.appendChild(goalTasks);
        // Delete Goal button
        const delGoalBtn = document.createElement("button");
        delGoalBtn.className = "delete-goal-btn";
        delGoalBtn.innerText = "x";
        delGoalBtn.onclick = () => {
          section.goals.splice(gIdx, 1);
          saveGoals();
          renderGoals();
        };
        goalDiv.appendChild(delGoalBtn);
        div.appendChild(goalDiv);
      });
    }
    // Add Goal Button
    const addGoalBtn = document.createElement("button");
    addGoalBtn.innerText = "Add Goal";
    addGoalBtn.classList.add("add-goal-button");
    addGoalBtn.onclick = () => {
      const goalName = prompt("Enter Goal Name:");
      if (goalName) {
        if (!section.goals) section.goals = [];
        section.goals.push({ title: goalName, tasks: "" });
        saveGoals();
        renderGoals();
      }
    };
    div.appendChild(addGoalBtn);
    // Delete Section button
    const delSectionBtn = document.createElement("button");
    delSectionBtn.className = "delete-section-btn";
    delSectionBtn.innerText = "x";
    delSectionBtn.onclick = () => {
      goalsData.splice(sIdx, 1);
      saveGoals();
      renderGoals();
    };
    div.appendChild(delSectionBtn);
    goalsBoard.appendChild(div);
  });
}
renderGoals();
// ===== Add Section =====
addSectionBtn.onclick = () => {
  goalsData.unshift({ title: "", goals: [] });
  saveGoals();
  renderGoals();
};
// ===== Drag & Drop Sections =====
goalsBoard.addEventListener("dragstart", (e) => {
  const target = e.target.closest(".section-card");
  if (target) {
    draggedIdx = target.dataset.index;
    target.style.opacity = "0.5";
  }
});
goalsBoard.addEventListener("dragend", (e) => {
  const target = e.target.closest(".section-card");
  if (target) target.style.opacity = "1";
});
goalsBoard.addEventListener("dragover", (e) => {
  e.preventDefault();
});
goalsBoard.addEventListener("drop", (e) => {
  const target = e.target.closest(".section-card");
  if (target && draggedIdx !== null) {
    const targetIdx = target.dataset.index;
    const draggedSection = goalsData.splice(draggedIdx, 1)[0];
    goalsData.splice(targetIdx, 0, draggedSection);
    saveGoals();
    renderGoals();
  }
});
// ===== monthly planner =====
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let currentMonth = "January";
let monthlyData = JSON.parse(localStorage.getItem("monthlyData")) || {};
// Init months buttons
const monthsBar = document.getElementById("monthsBar");
const monthTitle = document.getElementById("currentMonthTitle");
const cards = document.querySelectorAll(".monthly-card");
months.forEach((month) => {
  const btn = document.createElement("button");
  btn.textContent = month;
  if (month === currentMonth) btn.classList.add("active");
  btn.onclick = () => {
    document
      .querySelectorAll(".months-bar button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMonth = month;
    monthTitle.textContent = month;
    loadMonthData();
  };
  monthsBar.appendChild(btn);
});
// Load data
function loadMonthData() {
  const data = monthlyData[currentMonth] || {};
  cards.forEach((card) => {
    const type = card.dataset.type;
    card.innerHTML = data[type] || "";
  });
}
// Save data
cards.forEach((card) => {
  card.addEventListener("input", () => {
    if (!monthlyData[currentMonth]) {
      monthlyData[currentMonth] = { goals: "", focus: "", notes: "" };
    }
    monthlyData[currentMonth][card.dataset.type] = card.innerHTML;
    localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
  });
});
loadMonthData();
// ==== weekly planner ====
const weeksContainer = document.getElementById("weeksContainer");
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let currentMonthWeekly = currentMonth; // مرتبط بالـ Monthly Goals
// Load or init weekly data
let weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || {};
function initWeeklyData(month) {
  if (!weeklyData[month]) {
    weeklyData[month] = {};
    for (let i = 1; i <= 4; i++) {
      weeklyData[month]["week" + i] = {};
      weekDays.forEach((day) => (weeklyData[month]["week" + i][day] = []));
    }
    localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
  }
}
// Render Weeks
function renderWeeks(month) {
  initWeeklyData(month);
  weeksContainer.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    const weekCard = document.createElement("div");
    weekCard.classList.add("week-card");
    // Week title
    const title = document.createElement("h3");
    title.textContent = "Week " + i;
    weekCard.appendChild(title);
    // Week Grid
    const grid = document.createElement("div");
    grid.classList.add("week-grid");
    weekDays.forEach((day) => {
      const cell = document.createElement("div");
      cell.classList.add("day-cell");
      const dayLabel = document.createElement("div");
      dayLabel.classList.add("day-label");
      dayLabel.textContent = day;
      cell.appendChild(dayLabel);
      // Add existing tasks
      weeklyData[month]["week" + i][day].forEach((taskText) => {
        const task = createTaskElement(taskText, month, i, day);
        cell.appendChild(task);
      });
      // Add Task Button
      const addBtn = document.createElement("button");
      addBtn.classList.add("add-task-btn");
      addBtn.textContent = "+ Add Task";
      addBtn.onclick = () => {
        const taskText = prompt("Enter task:");
        if (taskText) {
          weeklyData[month]["week" + i][day].push(taskText);
          localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
          const task = createTaskElement(taskText, month, i, day);
          cell.insertBefore(task, addBtn);
        }
      };
      cell.appendChild(addBtn);
      grid.appendChild(cell);
    });
    weekCard.appendChild(grid);
    weeksContainer.appendChild(weekCard);
  }
}
// Create Task Element
function createTaskElement(text, month, weekNumber, day) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.textContent = text;
  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "x";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    const tasks = weeklyData[month]["week" + weekNumber][day];
    const index = tasks.indexOf(text);
    if (index > -1) tasks.splice(index, 1);
    localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
    task.remove();
  };
  task.appendChild(delBtn);
  return task;
}
// On month change (linked to Monthly Goals)
function changeWeekMonth(month) {
  currentMonthWeekly = month;
  renderWeeks(month);
}
renderWeeks(currentMonthWeekly);
// ===== daily tasks ====
document.addEventListener("DOMContentLoaded", () => {
  const daysContainer = document.getElementById("daysContainer");
  const dailyTasksContainer = document.getElementById("dailyTasksContainer");
  const addDailyTaskBtn = document.getElementById("addDailyTaskBtn");
  // ===== تعريف الشهر والسنة الافتراضية =====
  const currentMonth = "January"; // ممكن تغيره ديناميكي لاحقاً
  const year = 2026;
  let dailyData = JSON.parse(localStorage.getItem("dailyData")) || {};
  let currentDay = null;
  // ===== Initialize Days Buttons =====
  function initDays(monthDays = 31) {
    daysContainer.innerHTML = "";
    for (let i = 1; i <= monthDays; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("day-btn");
      btn.onclick = () => {
        document
          .querySelectorAll(".day-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentDay = i;
        loadDailyTasks(i);
      };
      daysContainer.appendChild(btn);
    }
  }
  // ===== Load Tasks for Selected Day =====
  function loadDailyTasks(day) {
    dailyTasksContainer.innerHTML = "";
    const key = `${currentMonth}-${day}-${year}`;
    if (!dailyData[key]) dailyData[key] = [];
    dailyData[key].forEach((taskText) => {
      const task = createDailyTaskElement(taskText, key);
      dailyTasksContainer.appendChild(task);
    });
  }
  // ===== Create Task Token =====
  // ===== Create Task Token مع Checkbox =====
  function createDailyTaskElement(text, key, completed = false) {
    const task = document.createElement("div");
    task.classList.add("task-token");
    if (completed) task.classList.add("completed");
    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.onchange = () => {
      if (checkbox.checked) {
        task.classList.add("completed");
      } else {
        task.classList.remove("completed");
      }
    };
    // نص المهمة
    const taskText = document.createElement("span");
    taskText.textContent = text;
    // حفظ الحالة
    const index = dailyData[key].findIndex((t) => t.text === text);
    if (index > -1) {
      dailyData[key][index].completed = checkbox.checked;
      localStorage.setItem("dailyData", JSON.stringify(dailyData));
    }
    // زر الحذف
    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.onclick = () => {
      dailyData[key] = dailyData[key].filter((t) => t.text !== text);
      localStorage.setItem("dailyData", JSON.stringify(dailyData));
      task.remove();
    };
    task.appendChild(taskText);
    task.appendChild(checkbox);
    task.appendChild(delBtn);
    return task;
  }
  // ===== Add Task Button محدث =====
  addDailyTaskBtn.onclick = () => {
    if (!currentDay) {
      alert("Please select a day first!");
      return;
    }
    const taskTextPrompt = prompt("Enter task:");
    if (taskTextPrompt) {
      const key = `${currentMonth}-${currentDay}-${year}`;
      if (!dailyData[key]) dailyData[key] = [];
      dailyData[key].push({ text: taskTextPrompt, completed: false });
      localStorage.setItem("dailyData", JSON.stringify(dailyData));
      const task = createDailyTaskElement(taskTextPrompt, key, false);
      dailyTasksContainer.appendChild(task);
    }
  };
  // ===== Load Tasks محدث لدعم الحالة =====
  function loadDailyTasks(day) {
    dailyTasksContainer.innerHTML = "";
    const key = `${currentMonth}-${day}-${year}`;
    if (!dailyData[key]) dailyData[key] = [];
    dailyData[key].forEach((t) => {
      const task = createDailyTaskElement(t.text, key, t.completed || false);
      dailyTasksContainer.appendChild(task);
    });
  }
  // ===== Add Task Button =====
  addDailyTaskBtn.onclick = () => {
    if (!currentDay) {
      alert("Please select a day first!");
      return;
    }
    const taskText = prompt("Enter task:");
    if (taskText) {
      const key = `${currentMonth}-${currentDay}-${year}`;
      if (!dailyData[key]) dailyData[key] = [];
      dailyData[key].push(taskText);
      localStorage.setItem("dailyData", JSON.stringify(dailyData));
      const task = createDailyTaskElement(taskText, key);
      dailyTasksContainer.appendChild(task);
    }
  };
  // ===== Initialize =====
  initDays(31); // عدد أيام الشهر
});
//           -------------- reviwes -----------
const weeklyReviewsContainer = document.getElementById(
  "weeklyReviewsContainer"
);
const monthlyReviewsContainer = document.getElementById(
  "monthlyReviewsContainer"
);
let reviewsData = JSON.parse(localStorage.getItem("reviewsData")) || {};
const year = 2026;
// ===== Weekly Reviews =====
function initWeeklyReviews(numWeeks = 4) {
  weeklyReviewsContainer.innerHTML = "";
  for (let w = 1; w <= numWeeks; w++) {
    const card = document.createElement("div");
    card.classList.add("review-card");
    card.setAttribute("contenteditable", "true");
    card.setAttribute("data-placeholder", `Week${w} Review...`);
    const key = `${currentMonth}-week${w}-${year}`;
    //card.innerHTML = reviewsData[key] || "";
    card.addEventListener("input", () => {
      reviewsData[key] = card.innerHTML;
      localStorage.setItem("reviewsData", JSON.stringify(reviewsData));
    });
    card.classList.add("review-card");
    card.setAttribute("contenteditable", "true");
    weeklyReviewsContainer.appendChild(card);
  }
}
// ===== Monthly Reviews =====
const monthlyLabels = ["Achieved Goals", "Missed Goals", "Improvements"];
function initMonthlyReviews() {
  monthlyReviewsContainer.innerHTML = "";
  monthlyLabels.forEach((labelText) => {
    const card = document.createElement("div");
    card.classList.add("review-card");
    card.setAttribute("contenteditable", "true");
    card.setAttribute("data-placeholder", labelText + "...");
    const key = `${currentMonth}-${labelText}-${year}`;
    // card.innerHTML = reviewsData[key] || "";
    card.addEventListener("input", () => {
      reviewsData[key] = card.innerHTML;
      localStorage.setItem("reviewsData", JSON.stringify(reviewsData));
    });
    // const label = document.createElement("h4");
    // label.textContent = labelText;
    //card.prepend(label);
    monthlyReviewsContainer.appendChild(card);
  });
}
// ===== Initialize =====
initWeeklyReviews(4);
initMonthlyReviews();
//// ------------  Hubit tracker ---------------
const habitsContainer = document.getElementById("habitsContainer");
const addHabitBtn = document.getElementById("addHabitBtn");
let habitsData = JSON.parse(localStorage.getItem("habitsData")) || {};
//const currentMonth = "January";
//const year = 2026;
// ===== Create Habit Card =====
function createHabitCard(habitName) {
  const key = `${currentMonth}-${habitName}-${year}`;
  if (!habitsData[key]) habitsData[key] = Array(31).fill(false);
  const card = document.createElement("div");
  card.classList.add("habit-card");
  // Header
  const header = document.createElement("div");
  header.classList.add("habit-header");
  const name = document.createElement("span");
  name.classList.add("habit-name");
  name.textContent = habitName;
  const delBtn = document.createElement("button");
  delBtn.classList.add("delete-habit-btn");
  delBtn.textContent = "x";
  delBtn.onclick = () => {
    delete habitsData[key];
    localStorage.setItem("habitsData", JSON.stringify(habitsData));
    card.remove();
  };
  header.appendChild(name);
  header.appendChild(delBtn);
  card.appendChild(header);
  // Days Grid
  const daysGrid = document.createElement("div");
  daysGrid.classList.add("habit-days");
  for (let d = 1; d <= 31; d++) {
    const dayBtn = document.createElement("div");
    dayBtn.classList.add("habit-day");
    dayBtn.textContent = d;
    if (habitsData[key][d - 1]) dayBtn.classList.add("completed");
    dayBtn.onclick = () => {
      habitsData[key][d - 1] = !habitsData[key][d - 1];
      dayBtn.classList.toggle("completed");
      localStorage.setItem("habitsData", JSON.stringify(habitsData));
    };
    daysGrid.appendChild(dayBtn);
  }
  card.appendChild(daysGrid);
  habitsContainer.appendChild(card);
}
// ===== Load Habits =====
function loadHabits() {
  habitsContainer.innerHTML = "";
  Object.keys(habitsData).forEach((key) => {
    const habitName = key.split("-")[1];
    createHabitCard(habitName);
  });
}
// ===== Add Habit Button =====
addHabitBtn.onclick = () => {
  const habitName = prompt("Enter Habit Name:");
  if (habitName) {
    createHabitCard(habitName);
    localStorage.setItem("habitsData", JSON.stringify(habitsData));
  }
};
// ===== Initialize =====
loadHabits();
// ==== server worker ====
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered successfully"))
    .catch((err) => console.log("Service Worker registration failed:", err));
}
