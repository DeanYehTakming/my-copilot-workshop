// 待辦清單資料存放在 localStorage，資料結構範例：
// [
//   { id: Date.now(), text: '完成作業', completed: false }
// ]
const STORAGE_KEY = 'todo-list-v1';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const todoCount = document.getElementById('todo-count');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeLabel = themeToggle.querySelector('.theme-label');
const filterButtons = document.querySelectorAll('.filter-btn');
const THEME_STORAGE_KEY = 'todo-theme';
const FILTER_STORAGE_KEY = 'todo-filter';
const validFilters = ['all', 'active', 'completed'];
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let todos = loadTodos();
let currentFilter = loadFilter();

// 取得目前主題；沒有手動選擇時交給作業系統設定決定
function getCurrentTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || (systemThemeQuery.matches ? 'dark' : 'light');
}

// 讀取儲存的篩選條件，無效值則安全回退到全部
function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  return validFilters.includes(savedFilter) ? savedFilter : 'all';
}

// 套用主題並同步切換按鈕的文字與圖示
function applyTheme() {
  const theme = getCurrentTheme();
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-label', isDark ? '切換到淺色模式' : '切換到深色模式');
}

// 讀取儲存的待辦資料，若不存在則回傳空陣列
function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    console.error('讀取 localStorage 失敗：', error);
    return [];
  }
}

// 儲存待辦資料到 localStorage
function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('儲存 localStorage 失敗：', error);
  }
}

// 計算未完成項目數量
function getUnfinishedCount(todos) {
  return todos.filter((todo) => !todo.completed).length;
}

// 重新渲染待辦清單
function renderTodos() {
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  // 根據篩選結果顯示清單或對應的提示文字
  if (filteredTodos.length === 0) {
    todoList.innerHTML = '';
    emptyState.hidden = false;
    emptyState.textContent = todos.length === 0
      ? '還沒有任何待辦事項,新增一個吧!'
      : currentFilter === 'active'
        ? '目前沒有未完成的待辦事項，其他項目仍可在「全部」查看。'
        : currentFilter === 'completed'
          ? '目前沒有已完成的待辦事項，其他項目仍可在「全部」查看。'
          : '目前沒有符合條件的待辦事項，其他項目仍可在「全部」查看。';
  } else {
    emptyState.hidden = true;
    todoList.innerHTML = filteredTodos
      .map(
        (todo) => `
          <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} aria-label="標記為完成" />
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button type="button" class="delete-btn" aria-label="刪除待辦">×</button>
          </li>
        `
      )
      .join('');
  }

  // 更新底部計數
  todoCount.textContent = `未完成: ${getUnfinishedCount(todos)} 項`;
}

// 更新篩選按鈕的選取狀態
function setFilter(filter) {
  currentFilter = validFilters.includes(filter) ? filter : 'all';
  localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === currentFilter);
    button.setAttribute('aria-pressed', button.dataset.filter === currentFilter);
  });
  renderTodos();
}

// 將 HTML 特殊字元轉義，避免 XSS
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 新增待辦事項
function addTodo(text) {
  const trimmedText = text.trim();

  // 如果內容為空白，直接忽略，不新增
  if (!trimmedText) {
    return;
  }

  const newTodo = {
    id: Date.now() + Math.random(),
    text: trimmedText,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos(todos);
  renderTodos();
}

// 刪除指定待辦事項
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos(todos);
  renderTodos();
}

// 切換待辦完成狀態
function toggleTodo(id, completed) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed };
    }
    return todo;
  });

  saveTodos(todos);
  renderTodos();
}

// 事件：新增表單送出
// 當輸入空白內容時不新增，避免建立無效待辦
todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

// 事件：勾選框改變狀態
todoList.addEventListener('change', (event) => {
  const target = event.target;

  if (target.matches('input[type="checkbox"]')) {
    const item = target.closest('.todo-item');
    const id = Number(item.dataset.id);
    toggleTodo(id, target.checked);
  }
});

// 事件：刪除按鈕點擊
todoList.addEventListener('click', (event) => {
  const target = event.target;

  if (target.matches('.delete-btn')) {
    const item = target.closest('.todo-item');
    const id = Number(item.dataset.id);
    deleteTodo(id);
  }
});

// 事件：切換深色或淺色模式
themeToggle.addEventListener('click', () => {
  const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme();
});

// 事件：切換待辦篩選條件
filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

// 尚未手動選擇主題時，作業系統設定變更就同步更新
systemThemeQuery.addEventListener('change', () => {
  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    applyTheme();
  }
});

// 首次載入時渲染目前資料
applyTheme();
setFilter(currentFilter);
