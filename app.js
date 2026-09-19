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
const clearCompletedButton = document.getElementById('clear-completed');
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

// 安全讀取瀏覽器儲存資料，避免儲存功能失敗時中斷 App
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('讀取 localStorage 失敗：', error);
    return null;
  }
}

// 安全寫入瀏覽器儲存資料，儲存失敗時保留目前畫面操作能力
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('儲存 localStorage 失敗：', error);
  }
}

// 取得目前主題；沒有手動選擇時交給作業系統設定決定
function getCurrentTheme() {
  const savedTheme = readStorage(THEME_STORAGE_KEY);
  return savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : systemThemeQuery.matches
      ? 'dark'
      : 'light';
}

// 讀取儲存的篩選條件，無效值則安全回退到全部
function loadFilter() {
  const savedFilter = readStorage(FILTER_STORAGE_KEY);
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
    const savedTodos = readStorage(STORAGE_KEY);
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
    return Array.isArray(parsedTodos) ? parsedTodos : [];
  } catch (error) {
    console.error('讀取待辦資料失敗：', error);
    return [];
  }
}

// 儲存待辦資料到 localStorage
function saveTodos(nextTodos) {
  writeStorage(STORAGE_KEY, JSON.stringify(nextTodos));
}

// 計算未完成項目數量
function getUnfinishedCount(todoItems) {
  return todoItems.filter((todo) => !todo.completed).length;
}

// 重新渲染待辦清單
function renderTodos() {
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  todoList.replaceChildren();

  // 根據篩選結果顯示清單或對應的提示文字
  if (filteredTodos.length === 0) {
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
    const todoFragment = document.createDocumentFragment();

    filteredTodos.forEach((todo) => {
      const item = document.createElement('li');
      item.className = `todo-item${todo.completed ? ' completed' : ''}`;
      item.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-btn';
      deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);
      deleteButton.textContent = '×';

      item.append(checkbox, text, deleteButton);
      todoFragment.append(item);
    });

    todoList.append(todoFragment);
  }

  todoCount.textContent = `未完成: ${getUnfinishedCount(todos)} 項`;
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
}

// 更新篩選按鈕的選取狀態
function setFilter(filter) {
  currentFilter = validFilters.includes(filter) ? filter : 'all';
  writeStorage(FILTER_STORAGE_KEY, currentFilter);
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive);
  });
  renderTodos();
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

// 清除所有已完成的待辦事項
function clearCompletedTodos() {
  if (!todos.some((todo) => todo.completed)) {
    return;
  }

  const shouldClear = window.confirm('確定要清除所有已完成的待辦事項嗎？');
  if (!shouldClear) {
    return;
  }

  todos = todos.filter((todo) => !todo.completed);
  saveTodos(todos);
  renderTodos();
}

// 事件：新增表單送出
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
  writeStorage(THEME_STORAGE_KEY, nextTheme);
  applyTheme();
});

// 事件：切換待辦篩選條件
filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

// 事件：清除所有已完成的待辦事項
clearCompletedButton.addEventListener('click', clearCompletedTodos);

// 尚未手動選擇主題時，作業系統設定變更就同步更新
systemThemeQuery.addEventListener('change', () => {
  if (!readStorage(THEME_STORAGE_KEY)) {
    applyTheme();
  }
});

// 首次載入時渲染目前資料
applyTheme();
setFilter(currentFilter);
