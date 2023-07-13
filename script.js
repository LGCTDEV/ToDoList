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
  // Récupère les todos depuis le localStorage, ou crée un tableau vide s'il n'y en a pas
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  // Parcourt chaque todo dans le tableau et crée un élément correspondant dans l'interface
  todos.forEach(function(todo) {
    createTodoElement(todo.text, todo.priority, todo.isCompleted);
  });
}

function createTodo() {
  // Récupère la valeur de la zone de saisie de l'utilisateur
  const userInput = document.getElementById('note').value;

  // Vérifie si l'utilisateur a saisi quelque chose
  if (userInput != '') {
    // Récupère la valeur de la priorité sélectionnée par l'utilisateur
    const priority = document.getElementById('priority').value;

    // Crée un nouvel élément de todo dans l'interface
    createTodoElement(userInput, priority, false);

    // Sauvegarde le todo dans le localStorage
    saveTodoInLocalStorage(userInput, priority);

    // Réinitialise la zone de saisie de l'utilisateur
    document.getElementById('note').value = '';
  }
}

function createTodoElement(todo, priority, isCompleted) {
  // Crée les éléments HTML nécessaires pour représenter un todo
  const listItem = document.createElement("li");
  const todoContainer = document.createElement("div");
  const todoText = document.createElement("span");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  // Définit le texte du todo, des boutons de suppression et d'édition
  todoText.innerHTML = todo;
  deleteButton.innerHTML = "Delete";
  editButton.innerHTML = "Edit";

  // Applique des styles CSS pour l'apparence du todo dans l'interface
  todoContainer.style.display = "flex";
  todoContainer.style.justifyContent = "center";
  todoContainer.style.alignItems = "center";
  todoContainer.style.width = "100%";

  deleteButton.style.marginLeft = "auto";
  editButton.style.marginLeft = "10px";

  // Ajoute des écouteurs d'événements pour les boutons de suppression et d'édition
  deleteButton.addEventListener('click', deleteTodo);
  editButton.addEventListener('click', function() {
    // prompt utilisateur pour modifier le todo et sa priorité
    const userInput = prompt("Edit your todo:", todoText.innerHTML);
    const priorityInput = prompt("Edit your todo priority (low, medium, high):", priority);

    // Vérifie si l'utilisateur a saisi une valeur valide et effectue les modifications
    if (userInput != null && userInput != "" && ["low", "medium", "high"].includes(priorityInput)) {
      todoText.innerHTML = userInput;
      listItem.className = '';
      listItem.classList.add(priorityInput);
      updateTodoInLocalStorage(todo, userInput, priority, priorityInput);
    } else if (priorityInput != null && priorityInput != "" && !["low", "medium", "high"].includes(priorityInput)) {
      // Affiche une alerte si la priorité saisie n'est pas valide
      alert("Invalid priority. Please try again with 'low', 'medium', or 'high'.");
    }
  });

  // Ajoute les éléments HTML de la liste de todo
  todoContainer.appendChild(todoText);
  listItem.appendChild(todoContainer);
  listItem.appendChild(deleteButton);
  listItem.appendChild(editButton);

  // Ajoute un écouteur d'événement pour le marquage/démarquage d'un todo
  listItem.addEventListener("click", todoCheck);

  // Applique une classe CSS basée sur la priorité du todo
  listItem.classList.add(priority);

  // Applique un style de texte barré si le todo est terminé (cliqué)
  listItem.style.textDecoration = isCompleted ? "line-through" : "";

  // Ajoute l'élément liste du todo à l'élément conteneur des todos
  const todosContainerElement = document.getElementById('todos-container');
  todosContainerElement.appendChild(listItem);
}

function updateTodoInLocalStorage(oldTodo, newTodo, oldPriority, newPriority) {
  // Récupère les todos depuis le localStorage
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  // Trouve l'index du todo à mettre à jour dans le tableau des todos
  const todoIndex = todos.findIndex(todo => todo.text === oldTodo && todo.priority === oldPriority);

  // Met à jour le texte et la priorité
  todos[todoIndex].text = newTodo;
  todos[todoIndex].priority = newPriority;

  // Met à jour les todos dans le localStorage
  localStorage.setItem('todos', JSON.stringify(todos));
}

function saveTodoInLocalStorage(todo, priority) {
  // Récupère les todos depuis le localStorage, ou crée un tableau vide s'il n'y en a pas
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  // Ajoute le nouveau todo avec sa priorité et son statut de complétion au tableau
  todos.push({ text: todo, priority: priority, isCompleted: false });

  // Sauvegarde les todos dans le localStorage
  localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodos() {
  // Supprime tous les todos de l'interface
  const todosContainerElement = document.getElementById('todos-container');
  todosContainerElement.innerHTML = '';

  // Supprime tous les todos du localStorage
  localStorage.removeItem('todos');
}

function deleteTodo(event) {
  // Récupère le texte du todo à supprimer en utilisant l'événement du bouton de suppression
  const todoText = event.target.parentNode.textContent.replace("DeleteEdit", "");

  // Récupère les todos depuis le localStorage
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  // Trouve l'index du todo à supprimer dans le tableau des todos
  const todoIndex = todos.findIndex(todo => todo.text === todoText);

  // Supprime le todo du tableau des todos
  todos.splice(todoIndex, 1);

  // Met à jour les todos dans le localStorage
  localStorage.setItem('todos', JSON.stringify(todos));

  // Supprime l'élément de liste du todo de l'interface
  event.target.parentNode.parentNode.remove();
}

function todoCheck(event) {
  // Vérifie si l'élément cliqué n'est pas un bouton
  if (event.target.tagName !== 'BUTTON') {
    // Applique ou supprime le style de texte barré pour indiquer l'état de complétion du todo
    event.target.style.textDecoration = event.target.style.textDecoration == '' ? 'line-through' : '';

    // Récupère le texte du todo
    const todoText = event.target.textContent;

    // Récupère les todos depuis le localStorage
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Trouve l'index du todo dans le tableau des todos
    const todoIndex = todos.findIndex(todo => todo.text === todoText);

    // Inverse l'état de complétion du todo
    todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;

    // Met à jour les todos dans le localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function sortTodosByPriority() {
  // Supprime tous les todos de l'interface
  const todosContainerElement = document.getElementById('todos-container');
  todosContainerElement.innerHTML = '';

  // Récupère les todos depuis le localStorage
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

// Trie les todos en fonction de leur priorité
// Crée un objet qui attribue une valeur numérique à chaque priorité possible
const priorityValues = {
  "high": 3,
  "medium": 2,
  "low": 1
};

// Utilise la fonction de tri pour comparer deux todos et déterminer leur ordre
todos.sort(function(a, b) {
  // Compare les priorités des todos en utilisant les valeurs numériques définies dans priorityValues
  // L'ordre de tri sera du plus grand au plus petit, c'est-à-dire de "high" à "low"
  return priorityValues[b.priority] - priorityValues[a.priority];
});

// La fonction de tri réorganise les éléments dans le tableau todos en fonction de leur priorité.
// Les todos ayant une priorité plus élevée ("high") seront placés avant ceux ayant une priorité plus faible ("low").
// Cela permet d'afficher les todos dans l'ordre décroissant de priorité dans l'interface utilisateur.

  // Parcourt chaque todo dans le tableau trié et crée un élément correspondant dans l'interface
  todos.forEach(function(todo) {
    createTodoElement(todo.text, todo.priority, todo.isCompleted);
  });
}
