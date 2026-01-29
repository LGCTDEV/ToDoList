const fs = require('fs');
const path = require('path');

const scriptContent = fs.readFileSync(
  path.join(__dirname, '..', 'script.js'),
  'utf8'
);

function loadScript() {
  window.eval(scriptContent);
}

function setupDom() {
  document.body.innerHTML = `
    <input id="note" />
    <select id="priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <ul id="todos-container"></ul>
  `;
}

describe('todo list behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    setupDom();
    loadScript();
  });

  test('deleteTodo removes the matching todo by id even when text contains button labels', () => {
    const todos = [
      { id: '1', text: 'DeleteEdit', priority: 'low', isCompleted: false },
      { id: '2', text: 'Keep me', priority: 'high', isCompleted: false }
    ];
    localStorage.setItem('todos', JSON.stringify(todos));

    window.createTodoElement('DeleteEdit', 'low', false, '1');
    window.createTodoElement('Keep me', 'high', false, '2');

    const deleteButtons = document.querySelectorAll('button');
    const deleteButton = deleteButtons[0];
    window.deleteTodo({ target: deleteButton });

    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    expect(storedTodos).toHaveLength(1);
    expect(storedTodos[0].id).toBe('2');
  });

  test('sortTodosByPriority renders high priority todos first', () => {
    const todos = [
      { id: '1', text: 'Low todo', priority: 'low', isCompleted: false },
      { id: '2', text: 'High todo', priority: 'high', isCompleted: false },
      { id: '3', text: 'Medium todo', priority: 'medium', isCompleted: false }
    ];
    localStorage.setItem('todos', JSON.stringify(todos));

    window.sortTodosByPriority();

    const items = document.querySelectorAll('#todos-container li');
    expect(items[0].classList.contains('high')).toBe(true);
    expect(items[1].classList.contains('medium')).toBe(true);
    expect(items[2].classList.contains('low')).toBe(true);
  });

  test('todoCheck toggles completion in localStorage', () => {
    const todos = [
      { id: '1', text: 'Todo', priority: 'medium', isCompleted: false }
    ];
    localStorage.setItem('todos', JSON.stringify(todos));

    window.createTodoElement('Todo', 'medium', false, '1');
    const listItem = document.querySelector('#todos-container li');

    window.todoCheck({ target: listItem });

    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    expect(storedTodos[0].isCompleted).toBe(true);
  });
});
