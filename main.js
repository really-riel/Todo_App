const inputTextElem = document.querySelector(".inputText");
const todoListElem = document.querySelector(".todoList");
const alls = document.querySelectorAll(".all");
const activeElems = document.querySelectorAll(".active");
const completedElems = document.querySelectorAll(".completed");

let listArray = [];
let todos;
let dragStartIndex;
const initApp = () => {
  const themeIcon = document.querySelector(".themeIcon");
  const inputBtn = document.querySelector(".inputBtn");
  const ClearcompletedBtn = document.querySelector(".clearCompleted");

  themeIcon.addEventListener("click", setPreferredColorTheme);
  inputBtn.addEventListener("click", createTodos);
  getTodosFromLocalStorage();
  todoListElem.addEventListener("click", deleteOrCheckTodos);
  ClearcompletedBtn.addEventListener("click", clearCompletedTodos);

  alls.forEach((all) => {
    all.addEventListener("click", displayAll);
    all.click();
  });

  activeElems.forEach((activeElem) => {
    activeElem.addEventListener("click", displayActiveTodos);
  });

  completedElems.forEach((completedElem) => {
    completedElem.addEventListener("click", displayCompletedTodos);
  });
  mouseOver();
  countItemsLeft();
  sortable();
};
document.addEventListener("DOMContentLoaded", initApp);

const setPreferredColorTheme = () => {
  const defaultTheme = JSON.parse(
    getComputedStyle(document.body, ":after").content
  );

  switch (defaultTheme) {
    case "d":
      document.documentElement.classList.toggle("light");

      break;
    case "l":
      document.documentElement.classList.toggle("dark");
      break;
  }
};

const createTodos = (e) => {
  e.preventDefault();
  const inputText = inputTextElem.value.trim();
  const todoListitem = document.createElement("li");
  todoListitem.setAttribute("draggable", "true");
  todoListitem.classList.add("todoListItem");
  todoListitem.innerHTML = `
    <div class="cover">
        <button class="todoListBtn"></button>
        <span class="todoText">${inputText}</span>
    </div>
    <button class="cancelBtn"></button>
    `;
  todoListElem.appendChild(todoListitem);

  listArray.push(todoListitem);

  saveToLocaleStorage(inputText);
  inputTextElem.value = "";
  countItemsLeft();
  alls.forEach((all) => {
    all.click();
  });
};

const checkAndGetTodosfromLocalStorage = () => {
  if (localStorage.getItem("todoList") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todoList"));
  }
};

const saveToLocaleStorage = (item) => {
  checkAndGetTodosfromLocalStorage();
  if (todos.indexOf(item) >= 0) {
    todos = [];
    todos.push(item);
  } else {
    todos.push(item);
  }

  localStorage.setItem("todoList", JSON.stringify(todos));
};

const getTodosFromLocalStorage = () => {
  checkAndGetTodosfromLocalStorage();
  todos.forEach((todo) => {
    const todoListitem = document.createElement("li");
    todoListitem.setAttribute("draggable", "true");
    todoListitem.classList.add("todoListItem");
    todoListitem.innerHTML = `
    <div class="cover">
        <button class="todoListBtn"></button>
        <span class="todoText">${todo}</span>
    </div>
    <button class="cancelBtn"></button>
    `;
    todoListElem.appendChild(todoListitem);
    listArray.push(todoListitem);
  });
  /* for checked todos */
  let doneTodosArray;
  if (localStorage.getItem("doneTodos") === null) {
    doneTodosArray = [];
  } else {
    doneTodosArray = JSON.parse(localStorage.getItem("doneTodos"));
  }
  doneTodosArray.forEach((doneTodo) => {
    const todoTextElems = document.querySelectorAll(".todoText");
    todoTextElems.forEach((todoTextElem) => {
      if (todoTextElem.innerText === doneTodo) {
        todoTextElem.classList.add("checkedText");
        todoTextElem.previousElementSibling.classList.add("checked");
      }
    });
  });
};

const deleteOrCheckTodos = (e) => {
  if (e.target.classList.contains("todoListBtn")) {
    const checkBtn = e.target;
    const todoText = e.target.nextElementSibling;
    checkBtn.classList.toggle("checked");

    todoText.classList.toggle("checkedText");
    saveDoneTodosToLocalStorage(todoText);
    countItemsLeft();
  } else if (e.target.classList.contains("cancelBtn")) {
    const listItem = e.target.parentElement;
    const todoText = listItem.firstElementChild.lastElementChild.innerText;
    listItem.remove();

    deleteFromLocalStorage(todoText);
    deleteDoneTodosFromLocalStorage(todoText);
    countItemsLeft();
  }
};

const deleteFromLocalStorage = (item) => {
  checkAndGetTodosfromLocalStorage();
  const itemIndex = todos.indexOf(item);

  todos.splice(itemIndex, 1);
  localStorage.setItem("todoList", JSON.stringify(todos));
};

const saveDoneTodosToLocalStorage = (item) => {
  let doneTodosArray;
  if (localStorage.getItem("doneTodos") === null) {
    doneTodosArray = [];
  } else {
    doneTodosArray = JSON.parse(localStorage.getItem("doneTodos"));
  }
  const itemText = item.innerText;
  if (!item.classList.contains("checkedText")) {
    const indexofText = doneTodosArray.indexOf(itemText);
    doneTodosArray.splice(indexofText, 1);
  } else {
    doneTodosArray.push(itemText);
  }

  localStorage.setItem("doneTodos", JSON.stringify(doneTodosArray));
};

const deleteDoneTodosFromLocalStorage = (item) => {
  let doneTodosArray;
  if (localStorage.getItem("doneTodos") === null) {
    doneTodosArray = [];
  } else {
    doneTodosArray = JSON.parse(localStorage.getItem("doneTodos"));
  }
  const itemIndex = doneTodosArray.indexOf(item);
  doneTodosArray.splice(itemIndex, 1);
  localStorage.setItem("doneTodos", JSON.stringify(doneTodosArray));
};

const countItemsLeft = () => {
  const todosBtns = document.querySelectorAll(".todoListBtn");
  let countArray = [];
  todosBtns.forEach((todoBtn, index) => {
    if (!todoBtn.classList.contains("checked")) {
      countArray.push(todoBtn);
    }
  });

  const itemsLeft = document.querySelector(".itemsLeft");
  itemsLeft.innerText = `${countArray.length} items Left`;
};

const clearCompletedTodos = (e) => {
  if (!confirm("Are you sure you want to clear all your completed TODOs?"))
    return;
  let checkedArray = [];
  const todosBtns = document.querySelectorAll(".todoListBtn");

  todosBtns.forEach((todoBtn) => {
    if (todoBtn.classList.contains("checked")) {
      todoBtn.parentElement.parentElement.remove();
      deleteFromLocalStorage(todoBtn.nextElementSibling.innerText);

      checkedArray.push(todoBtn);
    }
  });

  checkedArray.length === 0
    ? alert("You have not completed any TODOs!")
    : checkedArray;
  countItemsLeft();
};

const displayAll = (e) => {
  const todoTexts = document.querySelectorAll(".todoText");
  let completedElems = document.querySelectorAll(".completed");
  completedElems.forEach((completedElem) => {
    completedElem.classList.remove("activeClass");
  });
  let activeElems = document.querySelectorAll(".active");
  activeElems.forEach((activeElem) => {
    activeElem.classList.remove("activeClass");
  });
  todoTexts.forEach((todoText) => {
    todoText.parentElement.parentElement.classList.remove("none");
    if (todoText.parentElement.parentElement.classList.contains("none")) {
      e.target.classList.remove("activeClass");
    } else {
      e.target.classList.add("activeClass");
    }
  });
};

const displayActiveTodos = (e) => {
  e.target.classList.add("activeClass");
  let alls = document.querySelectorAll(".all");
  alls.forEach((all) => {
    all.classList.remove("activeClass");
  });
  let completedElems = document.querySelectorAll(".completed");
  completedElems.forEach((completedElem) => {
    completedElem.classList.remove("activeClass");
  });

  listArray.forEach((todo) => {
    const todoBtn = todo.firstElementChild.firstElementChild;
    if (todoBtn.classList.contains("checked")) {
      todo.classList.add("none");
    } else {
      todo.classList.remove("none");
    }
  });
};

const displayCompletedTodos = (e) => {
  e.target.classList.add("activeClass");
  let alls = document.querySelectorAll(".all");
  alls.forEach((all) => {
    all.classList.remove("activeClass");
  });
  let activeElems = document.querySelectorAll(".active");
  activeElems.forEach((activeElem) => {
    activeElem.classList.remove("activeClass");
  });

  listArray.forEach((todo) => {
    const todoBtn = todo.firstElementChild.firstElementChild;

    if (!todoBtn.classList.contains("checked")) {
      todo.classList.add("none");
    } else {
      todo.classList.remove("none");
    }
  });
};

const mouseOver = () => {
  if (!matchMedia("(min-width:700px)").matches) return;
  const todoListitems = document.querySelectorAll(".todoListItem");
  todoListitems.forEach((todoListitem) => {
    todoListitem.addEventListener("mouseenter", () => {
      todoListitem.lastElementChild.style.display = "flex";
    });
    todoListitem.addEventListener("mouseleave", () => {
      todoListitem.lastElementChild.style.display = "none";
    });
  });
};

const sortable = () => {
  new Sortable(todoListElem, {
    Animation: 150,
    ghostClass: "sortable-ghost",
    store: {
      get: function (todoListElem) {
        let order = localStorage.getItem(todoListElem);
      },
    },
  });
  /* const listItems = todoListElem.querySelectorAll(".todoListItem");
  listItems.forEach((listItem) => {
    listItem.addEventListener("dragstart", () => {
     
    });
    const listitemContent =
      listItem.firstElementChild.lastElementChild.innerText;

    saveToLocaleStorage(listitemContent);
  }); */
};
