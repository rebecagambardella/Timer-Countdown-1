
const settingsBtn = document.getElementById('settings');
const startBtn = document.getElementById('button-start');
const pauseBtn = document.getElementById('button-pause');
const restartBtn = document.getElementById('button-restart');
const counterDisplay = document.getElementById('counter');
const countdownInput = document.getElementById('countdown');
const addBtn = document.getElementById('button-add');
const taskInput = document.getElementById('add-tasks');
const tasksContainer = document.getElementById('tasks-added');
const changeColor = document.getElementById('change-background');
const changeSound = document.getElementById('change-sound');
const divBtnSettings = document.getElementById('div-button-settings');
const alertBox = document.getElementById('alert-time-finished');
const stopSoundBtn = document.getElementById('stop-sound');

// ===================
// VARIÁVEIS GLOBAIS
// ===================
let interval = null;
let timeInSeconds = 0;
let isRunning = false;
let mode = "up"; // "up" = cronômetro | "down" = countdown

// ===================
// NAV BAR
// ===================
settingsBtn.addEventListener('click', () => {
  divBtnSettings.classList.toggle('active');
});

// -------------------
// GUARDAR CORES ORIGINAIS
// -------------------
const originalBodyColor = getComputedStyle(document.body).backgroundColor;
const originalCardColor = getComputedStyle(document.documentElement).getPropertyValue('--card-color').trim();

// -------------------
// ARRAY DE CORES
// -------------------
const colors = [
  "#ffb6c1",
  "#556b2f",
  "#00bfff",
  "#8b0000",
  "#483d8b"
];

let currentColor = 0;

// -------------------
// EVENTO CHANGE COLOR
// -------------------
changeColor.addEventListener('click', () => {
  if (currentColor >= colors.length) {
    // Volta para a cor original
    document.body.style.backgroundColor = originalBodyColor;
    document.documentElement.style.setProperty('--card-color', originalCardColor);
    currentColor = 0; // reseta o contador do array
    return;
  }

  // Aplica a próxima cor do array
  const newColor = colors[currentColor];
  document.body.style.backgroundColor = newColor;
  document.documentElement.style.setProperty('--card-color', newColor);

  currentColor++;
});
// ===================
// SONS
// ===================
const sounds = [
  new Audio("/sounds/sound1.mp3"),
  new Audio("/sounds/sound2.mp3"),
  new Audio("/sounds/sound3.mp3")
];

let currentSoundIndex = 0;

changeSound.addEventListener('click', () => {
  currentSoundIndex++;
  if (currentSoundIndex === sounds.length) currentSoundIndex = 0;
  alert(`Sound ${currentSoundIndex + 1} selected`);
});

// ===================
// FORMATAR TEMPO
// ===================
function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// ===================
// START (CRONÔMETRO + COUNTDOWN)
// ===================
function startTimer() {
  if (isRunning) return;

  const inputTime = parseInputTime();

  if (inputTime > 0) {
    mode = "down"; // countdown
    timeInSeconds = inputTime;
  } else {
    mode = "up"; // cronômetro
  }

  isRunning = true;

  interval = setInterval(() => {
    if (mode === "down") {
      timeInSeconds--;

      if (timeInSeconds <= 0) {
        clearInterval(interval);
        isRunning = false;
        counterDisplay.textContent = "00:00:00";
        const currentSound = sounds[currentSoundIndex];
currentSound.currentTime = 0;
currentSound.play();

alertBox.classList.remove('hidden');
        return;
      }
    } else {
      timeInSeconds++;
    }

    counterDisplay.textContent = formatTime(timeInSeconds);
  }, 1000);
}

stopSoundBtn.addEventListener('click', () => {
  const currentSound = sounds[currentSoundIndex];
  currentSound.pause();
  currentSound.currentTime = 0;

  alertBox.classList.add('hidden');
});

// ===================
// PAUSE
// ===================
function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
}

// ===================
// RESTART
// ===================
function restartTimer() {
  clearInterval(interval);
  isRunning = false;
  timeInSeconds = 0;
  counterDisplay.textContent = "00:00:00";
}

// ===================
// CONVERTER INPUT
// ===================
function parseInputTime() {
  const value = countdownInput.value.trim();
  if (!value) return 0;

  if (value.includes(":")) {
    const [min, sec] = value.split(":").map(Number);
    return (min * 60) + sec;
  }

  return Number(value);
}

// ===================
// BOTÕES
// ===================
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
restartBtn.addEventListener('click', restartTimer);

// ===================
// TASKS + LOCALSTORAGE
// ===================

// array que guarda as tasks
let tasks = [];

// salvar no localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// criar task no HTML
function createTaskElement(taskText) {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task-card');
  taskDiv.textContent = taskText;

  const deleteBtn = document.createElement('span');
  deleteBtn.textContent = " ✖";
  deleteBtn.style.cursor = "pointer";

  deleteBtn.addEventListener('click', () => {
    // remove do array
    tasks = tasks.filter(task => task !== taskText);
    saveTasks();

    // remove da tela
    taskDiv.remove();
  });

  taskDiv.appendChild(deleteBtn);
  tasksContainer.appendChild(taskDiv);
}

// carregar tasks quando a página abrir
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach(task => createTaskElement(task));
  }
}

// adicionar nova task
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push(taskText);
  saveTasks();
  createTaskElement(taskText);

  taskInput.value = "";
});

// carrega automaticamente ao abrir
loadTasks();