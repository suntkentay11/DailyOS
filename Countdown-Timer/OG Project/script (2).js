const timerForm = document.getElementById("countdownForm");
const modeCheckbox = document.getElementById("modeCheckbox");
const timerNameInput = document.getElementById("timerName");
const breakDurationDecrementButton = document.getElementById(
  "breakDurationDecrement"
);
const breakDurationInput = document.getElementById("breakDuration");
const breakDurationIncrementButton = document.getElementById(
  "breakDurationIncrement"
);
const radioCountdownButton = document.getElementById("radioCountdown");
const radioDateCountdownButton = document.getElementById("radioDateCountdown");
const daysIncrementButton = document.getElementById("daysIncrement");
const daysInput = document.getElementById("days");
const daysDecrementButton = document.getElementById("daysDecrement");
const hoursIncrementButton = document.getElementById("hoursIncrement");
const hoursInput = document.getElementById("hours");
const hoursDecrementButton = document.getElementById("hoursDecrement");
const minutesIncrementButton = document.getElementById("minutesIncrement");
const minutesInput = document.getElementById("minutes");
const minutesDecrementButton = document.getElementById("minutesDecrement");
const secondsIncrementButton = document.getElementById("secondsIncrement");
const secondsInput = document.getElementById("seconds");
const secondsDecrementButton = document.getElementById("secondsDecrement");
const dateInput = document.getElementById("date");
const dateTimeInput = document.getElementById("dateTime");
const addTimerButton = document.getElementById("addTimer");

const countdownDateSettingsDiv = document.querySelector(
  ".countdown__date-settings"
);
const countdownTimeSettingsDiv = document.querySelector(
  ".countdown__time-settings"
);
const countdownTimerTypeGroup = document.querySelector(
  ".countdown__timer-type-group"
);
const countdownPomodoroSettingDiv = document.querySelector(
  ".countdown__pomodoro-setting"
);
const errorMessageElement = document.querySelector(".error__message");
const countdownTimersList = document.querySelector(".countdown__timers-list");

const showError = (message) => {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
};

// -----------------
// START HERE
// -----------------

// FORM SUBMISSION HANDLING
timerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const timerName = timerNameInput.value.trim();
  const breakDuration = +breakDurationInput.value;
  const isPomodoroMode = modeCheckbox.checked;
  const isCountdown = radioCountdownButton.checked;
  const isCountdownDate = radioDateCountdownButton.checked;
  const days = +daysInput.value;
  const hours = +hoursInput.value;
  const minutes = +minutesInput.value;
  const seconds = +secondsInput.value;
  const date = dateInput.value;
  const dateTime = dateTimeInput.value;
  let error = "";
  if (!timerName) {
    error = "Please enter a timer name.";
    showError(error);
    return;
  }
  if (isCountdown) {
    let totalTime =
      days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
    if (totalTime === 0) {
      error = "Please set a valid countdown time.";
      showError(error);
      return;
    }
    if (isPomodoroMode) {
      timers.push({
        name: timerName,
        pomodoro: true,
        breakDuration: breakDuration,
        totalTime: totalTime,
        timeLeft: totalTime,
      });
    } else {
      timers.push({
        name: timerName,
        totalTime: totalTime,
        timeLeft: totalTime,
      });
    }
    updateTimersView();
  }
  if (isCountdownDate) {
    if (!date || !dateTime) {
      error = "Please select a date and time for the countdown.";
      showError(error);
      return;
    }
    const countdownDate = new Date(date + "T" + dateTime);
    const currentDate = new Date();
    if (countdownDate <= currentDate) {
      error = "The selected date and time must be in the future.";
      showError(error);
      return;
    }
    const timeLeft = Math.floor((countdownDate - currentDate) / 1000);
    timers.push({
      name: timerName,
      isCountdownDate: true,
      countdownDate: countdownDate,
      started: true,
      timeLeft: timeLeft,
    });
    updateTimersView();
  }
});

// TIMER MODE HANDLING
radioCountdownButton.addEventListener("change", () => {
  if (radioCountdownButton.checked) {
    countdownDateSettingsDiv.style.display = "none";
    countdownTimeSettingsDiv.style.display = "flex";
  }
});

radioDateCountdownButton.addEventListener("change", () => {
  if (radioDateCountdownButton.checked) {
    countdownDateSettingsDiv.style.display = "flex";
    countdownTimeSettingsDiv.style.display = "none";
  }
});

modeCheckbox.addEventListener("change", () => {
  if (modeCheckbox.checked) {
    countdownTimerTypeGroup.style.display = "none";
    countdownPomodoroSettingDiv.style.display = "block";
    radioCountdownButton.click();
  } else {
    countdownTimerTypeGroup.style.display = "flex";
    countdownPomodoroSettingDiv.style.display = "none";
  }
});

// BREAK DURATION INPUT HANDLING
const updateBreakDurationButtonsState = () => {
  const currentValue = +breakDurationInput.value;
  breakDurationDecrementButton.disabled = currentValue <= 1;
  breakDurationIncrementButton.disabled = currentValue >= 60;
  if (currentValue <= 1) {
    breakDurationDecrementButton.style.cursor = "not-allowed";
  } else {
    breakDurationDecrementButton.style.cursor = "pointer";
  }
  if (currentValue >= 60) {
    breakDurationIncrementButton.style.cursor = "not-allowed";
  } else {
    breakDurationIncrementButton.style.cursor = "pointer";
  }
};

breakDurationDecrementButton.addEventListener("click", () => {
  const currentValue = +breakDurationInput.value;
  if (currentValue > 1) {
    breakDurationInput.value = currentValue - 1;
  }
  updateBreakDurationButtonsState();
});

breakDurationIncrementButton.addEventListener("click", () => {
  const currentValue = +breakDurationInput.value;
  if (currentValue < 60) {
    breakDurationInput.value = currentValue + 1;
  }
  updateBreakDurationButtonsState();
});

breakDurationInput.addEventListener("blur", () => {
  const currentValue = +breakDurationInput.value;
  if (currentValue < 1) {
    breakDurationInput.value = 1;
  }
  if (currentValue > 60) {
    breakDurationInput.value = 60;
  }
  updateBreakDurationButtonsState();
});

updateBreakDurationButtonsState();

// TIME INPUT HANDLING
const updateTimeButtonsState = () => {
  const currentDays = +daysInput.value;
  const currentHours = +hoursInput.value;
  const currentMinutes = +minutesInput.value;
  const currentSeconds = +secondsInput.value;
  if (currentDays >= 30) {
    daysIncrementButton.disabled = true;
    daysIncrementButton.style.cursor = "not-allowed";
  } else {
    daysIncrementButton.disabled = false;
    daysIncrementButton.style.cursor = "pointer";
  }
  if (currentDays <= 0) {
    daysDecrementButton.disabled = true;
    daysDecrementButton.style.cursor = "not-allowed";
  } else {
    daysDecrementButton.disabled = false;
    daysDecrementButton.style.cursor = "pointer";
  }
  if (currentHours >= 23) {
    hoursIncrementButton.disabled = true;
    hoursIncrementButton.style.cursor = "not-allowed";
  } else {
    hoursIncrementButton.disabled = false;
    hoursIncrementButton.style.cursor = "pointer";
  }
  if (currentHours <= 0) {
    hoursDecrementButton.disabled = true;
    hoursDecrementButton.style.cursor = "not-allowed";
  } else {
    hoursDecrementButton.disabled = false;
    hoursDecrementButton.style.cursor = "pointer";
  }
  if (currentMinutes >= 59) {
    minutesIncrementButton.disabled = true;
    minutesIncrementButton.style.cursor = "not-allowed";
  } else {
    minutesIncrementButton.disabled = false;
    minutesIncrementButton.style.cursor = "pointer";
  }
  if (currentMinutes <= 0) {
    minutesDecrementButton.disabled = true;
    minutesDecrementButton.style.cursor = "not-allowed";
  } else {
    minutesDecrementButton.disabled = false;
    minutesDecrementButton.style.cursor = "pointer";
  }
  if (currentSeconds >= 59) {
    secondsIncrementButton.disabled = true;
    secondsIncrementButton.style.cursor = "not-allowed";
  } else {
    secondsIncrementButton.disabled = false;
    secondsIncrementButton.style.cursor = "pointer";
  }
  if (currentSeconds <= 0) {
    secondsDecrementButton.disabled = true;
    secondsDecrementButton.style.cursor = "not-allowed";
  } else {
    secondsDecrementButton.disabled = false;
    secondsDecrementButton.style.cursor = "pointer";
  }
};

daysIncrementButton.addEventListener("click", () => {
  const currentValue = +daysInput.value;
  if (currentValue < 30) {
    daysInput.value = currentValue + 1;
  }
  updateTimeButtonsState();
});

daysDecrementButton.addEventListener("click", () => {
  const currentValue = +daysInput.value;
  if (currentValue > 0) {
    daysInput.value = currentValue - 1;
  }
  updateTimeButtonsState();
});

daysInput.addEventListener("blur", () => {
  const currentValue = +daysInput.value;
  if (currentValue < 0) {
    daysInput.value = 0;
  }
  if (currentValue > 30) {
    daysInput.value = 30;
  }
  updateTimeButtonsState();
});

hoursIncrementButton.addEventListener("click", () => {
  const currentValue = +hoursInput.value;
  if (currentValue < 23) {
    hoursInput.value = currentValue + 1;
  }
  updateTimeButtonsState();
});

hoursDecrementButton.addEventListener("click", () => {
  const currentValue = +hoursInput.value;
  if (currentValue > 0) {
    hoursInput.value = currentValue - 1;
  }
  updateTimeButtonsState();
});

hoursInput.addEventListener("blur", () => {
  const currentValue = +hoursInput.value;
  if (currentValue < 0) {
    hoursInput.value = 0;
  }
  if (currentValue > 23) {
    hoursInput.value = 23;
  }
  updateTimeButtonsState();
});

minutesIncrementButton.addEventListener("click", () => {
  const currentValue = +minutesInput.value;
  if (currentValue < 59) {
    minutesInput.value = currentValue + 1;
  }
  updateTimeButtonsState();
});

minutesDecrementButton.addEventListener("click", () => {
  const currentValue = +minutesInput.value;
  if (currentValue > 0) {
    minutesInput.value = currentValue - 1;
  }
  updateTimeButtonsState();
});

minutesInput.addEventListener("blur", () => {
  const currentValue = +minutesInput.value;
  if (currentValue < 0) {
    minutesInput.value = 0;
  }
  if (currentValue > 59) {
    minutesInput.value = 59;
  }
  updateTimeButtonsState();
});

secondsIncrementButton.addEventListener("click", () => {
  const currentValue = +secondsInput.value;
  if (currentValue < 59) {
    secondsInput.value = currentValue + 1;
  }
  updateTimeButtonsState();
});

secondsDecrementButton.addEventListener("click", () => {
  const currentValue = +secondsInput.value;
  if (currentValue > 0) {
    secondsInput.value = currentValue - 1;
  }
  updateTimeButtonsState();
});

secondsInput.addEventListener("blur", () => {
  const currentValue = +secondsInput.value;
  if (currentValue < 0) {
    secondsInput.value = 0;
  }
  if (currentValue > 59) {
    secondsInput.value = 59;
  }
  updateTimeButtonsState();
});

updateTimeButtonsState();

timer.intervalId = setInterval(() => {
  if (timer.isCountdownDate) {
    timer.timeLeft = Math.floor((timer.countdownDate - Date.now()) / 1000);
  } else {
    timer.timeLeft--;
  }

  if (timer.timeLeft <= 0) {
    if (timer.pomodoro) {
      if (timer.isOnBreak) {
        timer.isOnBreak = false;
        timer.timeLeft = timer.totalTime;
      } else {
        timer.isOnBreak = true;
        timer.timeLeft = timer.breakDuration * 60;
      }
    }
  }
  updateTimersView();
}, 1000);

startButton.addEventListener("click", () => {
  timer.started = true;
  updateTimersView();
});

stopButton.addEventListener("click", () => {
  clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.started = false;
  updateTimersView();
});

// Save to localStorage after every update
localStorage.setItem("timers", JSON.stringify(timers));

/* 

let timers = [
  {
    name: "Quick 10-Min Countdown",
    pomodoro: false,
    totalTime: 10 * 60,     // 10 minutes in seconds
    timeLeft: 10 * 60,
    started: false,
    isOnBreak: false,
    isCountdownDate: false,
    countdownDate: null,
    intervalId: null,
  },
  {
    name: "Pomodoro Session",
    pomodoro: true,
    breakDuration: 5,       // 5 minutes break
    totalTime: 25 * 60,     // 25 minutes work session
    timeLeft: 25 * 60,
    started: false,
    isOnBreak: false,
    isCountdownDate: false,
    countdownDate: null,
    intervalId: null,
  },
  {
    name: "Event Countdown",
    pomodoro: false,
    totalTime: 0,
    timeLeft: 0,
    started: true,
    isOnBreak: false,
    isCountdownDate: true,
    countdownDate: new Date("2025-12-31T23:59:59"),  // countdown to New Year's Eve 2025
    intervalId: null,
  },
];

*/
