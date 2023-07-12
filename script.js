window.onload = function() {
    const inputElement = document.getElementById('note');
    loadTodos();

    inputElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            createTodo();
        }
    });
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(function(todo) {
    createTodoElement(todo.text, todo.priority, todo.isCompleted);
  });
}

function createTodo() {
  const userInput = document.getElementById('note').value;
  if (userInput != '') {
    const priority = document.getElementById('priority').value;
    createTodoElement(userInput, priority, false);
    saveTodoInLocalStorage(userInput, priority);
    document.getElementById('note').value = '';
  }
}

function createTodoElement(todo, priority, isCompleted) {
  const listItem = document.createElement("li");
  const todoContainer = document.createElement("div");
  const todoText = document.createElement("span");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  todoText.innerHTML = todo;
  deleteButton.innerHTML = "Delete";
  editButton.innerHTML = "Edit";

  todoContainer.style.display = "flex";
  todoContainer.style.justifyContent = "center";
  todoContainer.style.alignItems = "center";
  todoContainer.style.width = "100%";

  deleteButton.style.marginLeft = "auto";
  editButton.style.marginLeft = "10px";

  deleteButton.addEventListener('click', deleteTodo);
  editButton.addEventListener('click', function() {
    const userInput = prompt("Edit your todo:", todoText.innerHTML);
    const priorityInput = prompt("Edit your todo priority (low, medium, high):", priority);
    if (userInput != null && userInput != "" && ["low", "medium", "high"].includes(priorityInput)) {
      todoText.innerHTML = userInput;
      listItem.className = '';
      listItem.classList.add(priorityInput);
      updateTodoInLocalStorage(todo, userInput, priority, priorityInput);
    } else if (priorityInput != null && priorityInput != "" && !["low", "medium", "high"].includes(priorityInput)) {
      alert("Invalid priority. Please try again with 'low', 'medium', or 'high'.");
    }
});

  todoContainer.appendChild(todoText);
  listItem.appendChild(todoContainer);
  listItem.appendChild(deleteButton);
  listItem.appendChild(editButton);
  
  listItem.addEventListener("click", todoCheck);

  listItem.classList.add(priority);

  listItem.style.textDecoration = isCompleted ? "line-through" : "";

  const todosContainerElement = document.getElementById('todos-container');
  todosContainerElement.appendChild(listItem);
}

function updateTodoInLocalStorage(oldTodo, newTodo, oldPriority, newPriority) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoIndex = todos.findIndex(todo => todo.text === oldTodo && todo.priority === oldPriority);
  todos[todoIndex].text = newTodo;
  todos[todoIndex].priority = newPriority;
  localStorage.setItem('todos', JSON.stringify(todos));
}

function saveTodoInLocalStorage(todo, priority) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push({ text: todo, priority: priority, isCompleted: false });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodos() {
  const todosContainerElement = document.getElementById('todos-container');
  todosContainerElement.innerHTML = '';
  localStorage.removeItem('todos');
}

function deleteTodo(event) {
  const todoText = event.target.parentNode.textContent.replace("DeleteEdit", "");
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoIndex = todos.findIndex(todo => todo.text === todoText);
  todos.splice(todoIndex, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
  event.target.parentNode.parentNode.remove();
}

function todoCheck(event) {
  if (event.target.tagName !== 'BUTTON') {
    event.target.style.textDecoration = event.target.style.textDecoration == '' ? 'line-through' : '';
    const todoText = event.target.textContent;
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function sortTodosByPriority() {
  const todosContainerElement = document.getElementById('todos-container');
  todosContainerElement.innerHTML = '';

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.sort(function(a, b) {
    const priorityValues = {
      "high": 3,
      "medium": 2,
      "low": 1
    };
    return priorityValues[b.priority] - priorityValues[a.priority];
  });

  todos.forEach(function(todo) {
    createTodoElement(todo.text, todo.priority, todo.isCompleted);
  });
}
