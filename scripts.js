const inputField = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

let tasks = [];

// Utility: generate unique ID for tasks
function generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function renderTasks() {
    listContainer.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id;
        if (task.checked) li.classList.add('checked');

        const span = document.createElement('span');
        span.textContent = '\u00d7';
        li.appendChild(span);

        // Add fade-in class
        li.classList.add('fade-in');

        listContainer.appendChild(li);
    });
}

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadData() {
    const data = localStorage.getItem('tasks');
    if (data) {
        tasks = JSON.parse(data);
        renderTasks();
    }
}

function addTask() {
    const taskText = inputField.value.trim();
    if (!taskText) {
        alert('You must write something!');
        return;
    }

    const newTask = {
        id: generateID(),
        text: taskText,
        checked: false
    };

    tasks.push(newTask);
    renderTasks();
    saveData();
    inputField.value = '';
}

// Event delegation for task toggle and delete
listContainer.addEventListener('click', e => {
    const target = e.target;
    if (target.tagName === 'LI') {
        const id = target.dataset.id;
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.checked = !task.checked;
            renderTasks();
            saveData();
        }
    } else if (target.tagName === 'SPAN') {
        const li = target.parentElement;
        li.classList.add('fade-out');

        // Wait for animation to finish before removing
        li.addEventListener('animationend', () => {
            const id = li.dataset.id;
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
            saveData();
        }, { once: true });
    }
});

// Add Enter key support
inputField.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

// Initialize app
loadData();