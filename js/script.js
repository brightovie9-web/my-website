document.addEventListener('DOMContentLoaded', () => {

  // ---------- Mobile Navigation ----------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => {
          s.style.transform = 'none';
          s.style.opacity = '1';
        });
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = 'none';
          s.style.opacity = '1';
        });
      });
    });
  }

  // Highlight current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ---------- Academic Planner ----------
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const taskCount = document.getElementById('task-count');
  const completedCount = document.getElementById('completed-count');

  let tasks = JSON.parse(localStorage.getItem('portfolioTasks')) || [];

  function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      updateStats();
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="task-delete" data-index="${index}" title="Delete task">✕</button>
      `;
      taskList.appendChild(li);
    });
    updateStats();
  }

  function updateStats() {
    if (taskCount) taskCount.textContent = tasks.length;
    if (completedCount) {
      completedCount.textContent = tasks.filter(t => t.completed).length;
    }
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    tasks.push({ text: trimmed, completed: false, id: Date.now() });
    saveTasks();
    renderTasks();
  }

  function toggleTask(index) {
    if (index >= 0 && index < tasks.length) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    }
  }

  function deleteTask(index) {
    if (index >= 0 && index < tasks.length) {
      // Small animation before removing
      const item = taskList.children[index];
      if (item) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        setTimeout(() => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }, 220);
      } else {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      }
    }
  }

  function saveTasks() {
    localStorage.setItem('portfolioTasks', JSON.stringify(tasks));
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (taskForm) {
    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      addTask(taskInput.value);
      taskInput.value = '';
      taskInput.focus();
    });
  }

  if (taskList) {
    taskList.addEventListener('click', e => {
      const index = parseInt(e.target.dataset.index, 10);
      if (e.target.classList.contains('task-checkbox')) toggleTask(index);
      if (e.target.classList.contains('task-delete')) deleteTask(index);
    });
  }

  renderTasks();

  // ---------- Contact Form Validation ----------
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      if (successMsg) successMsg.style.display = 'none';

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');

      let isValid = true;

      if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
      }
      if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      if (!phone.value.trim()) {
        showError(phone, 'Phone number is required');
        isValid = false;
      } else if (!/^\d+$/.test(phone.value.replace(/[\s\-\+\(\)]/g, ''))) {
        showError(phone, 'Phone number should contain only digits');
        isValid = false;
      }
      if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
      }

      if (isValid) {
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.textContent = 'Thank you! Your message has been sent successfully.';
        }
        contactForm.reset();
        setTimeout(() => {
          if (successMsg) successMsg.style.display = 'none';
        }, 4500);
      }
    });
  }

  function showError(input, msg) {
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('error');
      const errorEl = group.querySelector('.error');
      if (errorEl) errorEl.textContent = msg;
    }
  }

  // Live phone restriction
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/[^\d\s+\-()]/g, '');
    });
  }
});