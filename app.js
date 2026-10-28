(function () {
  'use strict';

  const STORAGE_KEY = 'tasks-v1';

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');

  let tasks = loadTasks();

  function loadTasks() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = '';

    tasks.forEach(function (task) {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', function () {
        task.done = checkbox.checked;
        saveTasks();
        render();
      });

      const text = document.createElement('span');
      text.textContent = task.text;

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'delete-btn';
      del.textContent = 'Borrar';
      del.addEventListener('click', function () {
        tasks = tasks.filter(function (t) { return t.id !== task.id; });
        saveTasks();
        render();
      });

      li.append(checkbox, text, del);
      list.appendChild(li);
    });

    emptyMsg.style.display = tasks.length === 0 ? 'block' : 'none';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text: text, done: false });
    saveTasks();
    input.value = '';
    input.focus();
    render();
  });

  render();
})();
