const Storage = {
    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    getItem(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    removeItem(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    },

    key(index) {
        return localStorage.key(index);
    },

    get length() {
        return localStorage.length;
    }
};

function getTasks() {
    return Storage.getItem('tasks') || [];
}

function saveTasks(tasks) {
    Storage.setItem('tasks', tasks);
}

function openModal() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.value = '';
    }
    sessionStorage.removeItem('editingTaskId');
}

function closeModal() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.value = '';
    }
    sessionStorage.removeItem('editingTaskId');
}


function createTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (!text) {
        alert('Пожалуйста, введите текст задачи');
        return;
    }

    const tasks = getTasks();
    const editingId = sessionStorage.getItem('editingTaskId');

    if (editingId) {
        const taskIndex = tasks.findIndex(t => t.id === parseInt(editingId));
        if (taskIndex !== -1) {
            tasks[taskIndex].text = text;
        }
        sessionStorage.removeItem('editingTaskId');
    } else {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
    }

    saveTasks(tasks);
    taskInput.value = '';
    window.location.href = 'index.html';
}

function deleteItem(id) {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveTasks(filteredTasks);
    renderTodoList();
}

function setDone(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTodoList();
    }
}

function editItem(id) {
    sessionStorage.setItem('editingTaskId', id);
    window.location.href = 'addTask.html';
}

function renderTodoList() {
    const emptyState = document.getElementById('emptyState');
    const taskList = document.getElementById('taskList');
    const tasks = getTasks();

    if (!emptyState || !taskList) return;

    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.style.display = 'flex';
        taskList.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    taskList.style.display = 'block';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        const statusClass = task.completed ? 'completed' : 'pending';
        const textClass = task.completed ? 'task-text completed-text' : 'task-text';
        const statusContent = task.completed ? '✓' : '';

        taskItem.innerHTML = `
            <div class="task-status ${statusClass}" onclick="setDone(${task.id})">${statusContent}</div>
            <span class="${textClass}">${task.text}</span>
            <div class="task-actions">
                <button class="icon-button edit" onclick="editItem(${task.id})">✎</button>
                <button class="icon-button delete" onclick="deleteItem(${task.id})">✕</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTodoList();

    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'addTask.html') {
        const editingId = sessionStorage.getItem('editingTaskId');
        if (editingId) {
            const tasks = getTasks();
            const task = tasks.find(t => t.id === parseInt(editingId));
            if (task) {
                const taskInput = document.getElementById('taskInput');
                if (taskInput) {
                    taskInput.value = task.text;
                }
            }
        }
    }
});

window.openModal = openModal;
window.closeModal = closeModal;
window.createTask = createTask;
window.deleteItem = deleteItem;
window.setDone = setDone;
window.editItem = editItem;
window.renderTodoList = renderTodoList;
