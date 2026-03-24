// ---------------------------------------------------------
// DOM Element Targets: Grabbing the HTML elements we need
// ---------------------------------------------------------
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const themeToggle = document.getElementById('themeToggle');

// ---------------------------------------------------------
// State Management: The single source of truth for our app
// ---------------------------------------------------------
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // Tracks which tab is active (all, active, completed)
let isDarkMode = localStorage.getItem('theme') === 'dark';

// ---------------------------------------------------------
// 1. Boot up application and bind initial static events
// ---------------------------------------------------------
function init() {
    applyTheme();
    renderTasks();
    
    // Bind Add Task actions (Click and Enter key)
    addTaskBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') handleAddTask(); 
    });
    
    // Bind Theme Toggle action
    themeToggle.addEventListener('click', toggleTheme);
    
    // Bind filter buttons (All, Active, Completed)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Visually update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update filter state and re-render list
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
}

// ---------------------------------------------------------
// 2. Theme Handling Logic: Toggles dark mode and updates UI
// ---------------------------------------------------------
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
}

function applyTheme() {
    // Sets a data attribute on the HTML tag for CSS to hook into
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    // Uses FontAwesome icons to indicate current state
    themeToggle.innerHTML = isDarkMode ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ---------------------------------------------------------
// 3. Create Logic: Grabs input, creates object, adds to array
// ---------------------------------------------------------
function handleAddTask() {
    const text = taskInput.value.trim();
    if (!text) return; // Guard clause: Don't add empty tasks

    const newTask = {
        id: Date.now().toString(), // Generates a unique ID based on timestamp
        text: text,
        completed: false,
        priority: prioritySelect.value,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask); // Adds new task to the top of the array
    saveAndRender();
    taskInput.value = ''; // Clear input field
}

// ---------------------------------------------------------
// 4. Update Logic (Toggle Completion & Edit Text)
// ---------------------------------------------------------
function toggleTask(id) {
    // Maps through array, flips 'completed' boolean if ID matches
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function editTask(id, currentText) {
    // Native browser prompt to get new text
    const newText = prompt("Update your task:", currentText);
    
    // Guard clause: If user clicked cancel or left it blank, do nothing
    if (newText === null || newText.trim() === "") return; 

    // Update the specific task text
    tasks = tasks.map(task => 
        task.id === id ? { ...task, text: newText.trim() } : task
    );
    saveAndRender();
}

// ---------------------------------------------------------
// 5. Delete Logic: Removes item from array
// ---------------------------------------------------------
function deleteTask(id) {
    // Filters out the task with the matching ID
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// ---------------------------------------------------------
// 6. Progress Calculation: Updates the visual progress bar
// ---------------------------------------------------------
function updateStats() {
    if (tasks.length === 0) {
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        return;
    }
    const completedTasks = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedTasks / tasks.length) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
}

// ---------------------------------------------------------
// 7. Persistence: Saves to local storage and triggers re-render
// ---------------------------------------------------------
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// ---------------------------------------------------------
// 8. Core Rendering Engine: Builds the HTML dynamically
// ---------------------------------------------------------
function renderTasks() {
    taskList.innerHTML = ''; // Wipe current DOM list clean
    
    // Determine which tasks to show based on selected filter tab
    let filteredTasks = tasks;
    if (currentFilter === 'active') filteredTasks = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    // Loop through filtered array and build DOM elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // --- Task Content Container ---
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        
        // Task Text (Using textContent prevents XSS)
        const spanText = document.createElement('span');
        spanText.className = 'task-text';
        spanText.textContent = task.text;
        
        // Add Edit functionality on Double Click
        spanText.addEventListener('dblclick', () => editTask(task.id, task.text));
        spanText.style.cursor = 'pointer'; 
        spanText.title = "Double-click to edit";
        
        // Priority Badge
        const badge = document.createElement('span');
        badge.className = `priority-badge priority-${task.priority}`;
        badge.textContent = task.priority;

        contentDiv.appendChild(spanText);
        contentDiv.appendChild(badge);

        // --- Action Buttons Container ---
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        
        // Complete Button (Using FontAwesome)
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn-complete';
        completeBtn.setAttribute('aria-label', 'Toggle Complete');
        completeBtn.innerHTML = `<i class="fa-solid ${task.completed ? 'fa-circle-check' : 'fa-circle'}"></i>`;
        completeBtn.addEventListener('click', () => toggleTask(task.id)); // Proper event binding

        // Delete Button (Using FontAwesome)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', 'Delete Task');
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        deleteBtn.addEventListener('click', () => deleteTask(task.id)); // Proper event binding
        
        // Assemble actions
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);

        // Assemble final List Item and inject to DOM
        li.appendChild(contentDiv);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });

    updateStats(); // Update progress bar to reflect new DOM state
}

// ---------------------------------------------------------
// Boot Sequence
// ---------------------------------------------------------
init();