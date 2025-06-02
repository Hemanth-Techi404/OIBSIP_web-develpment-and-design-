document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const itemsLeftSpan = document.getElementById('items-left');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');

    // Load tasks from localStorage or initialize empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Initial rendering and stats update
    renderTasks();
    updateStats();

    // Event listener for adding a new task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };

            // Add new task to the beginning of the tasks array
            tasks.unshift(newTask);
            saveTasks();
            renderTasks();
            updateStats();

            // Clear input and focus
            taskInput.value = '';
            taskInput.focus();

            showNotification('Task added successfully!', 'success');
        }
    });

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active styles from all buttons
            filterButtons.forEach(btn => btn.classList.remove('bg-indigo-600', 'text-white'));
            // Add active styles to clicked button
            this.classList.add('bg-indigo-600', 'text-white');
            // Update current filter and re-render tasks
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });

    // Event listener for clearing completed tasks
    clearCompletedBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('Completed tasks cleared!', 'info');
        }
    });

    // Function to render tasks based on current filter
    function renderTasks() {
        let filteredTasks = [];

        if (currentFilter === 'all') {
            filteredTasks = tasks;
        } else if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        // Show empty state if no tasks to display
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
            taskList.innerHTML = '';
            taskList.appendChild(emptyState);
        } else {
            emptyState.style.display = 'none';
            taskList.innerHTML = '';

            // Create task elements
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item p-4 border-b border-gray-100 flex items-center justify-between hover:bg-indigo-50 transition-colors ${task.completed ? 'opacity-70' : ''}`;
                taskItem.dataset.id = task.id;

                taskItem.innerHTML = `
                    <div class="flex items-center flex-grow">
                        <label class="checkbox-container">
                            <input type="checkbox" ${task.completed ? 'checked' : ''}>
                            <span class="checkmark"></span>
                        </label>
                        <span class="ml-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}">${task.text}</span>
                    </div>
                    <div class="task-actions opacity-0 transition-opacity flex space-x-2">
                        <button class="edit-btn text-indigo-400 hover:text-indigo-600" aria-label="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn text-red-400 hover:text-red-600" aria-label="Delete task">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;

                // Add event listeners for checkbox, edit, and delete buttons
                const checkbox = taskItem.querySelector('input[type="checkbox"]');
                const editBtn = taskItem.querySelector('.edit-btn');
                const deleteBtn = taskItem.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
                editBtn.addEventListener('click', () => editTask(task.id));
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                taskList.appendChild(taskItem);
            });
        }
    }

    // Toggle task completion status
    function toggleTaskComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });

        saveTasks();
        renderTasks();
        updateStats();

        const task = tasks.find(t => t.id === id);
        const message = task.completed ? 'Task marked as complete!' : 'Task marked as active';
        showNotification(message, 'info');
    }

    // Edit task text
    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        const newText = prompt('Edit your task:', task.text);

        if (newText !== null && newText.trim() !== '') {
            tasks = tasks.map(t => {
                if (t.id === id) {
                    return { ...t, text: newText.trim() };
                }
                return t;
            });

            saveTasks();
            renderTasks();
            showNotification('Task updated successfully!', 'success');
        }
    }

    // Delete a task
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            updateStats();
            showNotification('Task deleted!', 'warning');
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Update task statistics display
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;

        totalTasksSpan.textContent = total;
        completedTasksSpan.textContent = completed;
        pendingTasksSpan.textContent = pending;
        itemsLeftSpan.textContent = `${pending} ${pending === 1 ? 'item' : 'items'} left`;
    }

    // Show notification messages
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in-up ${
            type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
