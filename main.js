let listArray = [];
let dragStartIndex;

const initApp = () => {
  const themeIconElem = document.querySelector(".themeIcon");
  const inputTextElem = document.querySelector(".inputText");
  const inputBtnElement = document.querySelector(".inputBtn");
  const todoListElem = document.querySelector(".todoList");

  // Theme toggle
  themeIconElem.addEventListener("click", setPreferredColorTheme);
  // Input

  inputBtnElement.addEventListener("click", (e) => {
    e.preventDefault();
    const inputText = inputTextElem.value;

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

    saveToLocalStorage(inputText);
    inputTextElem.value = "";
    console.log(listArray);
    /* All */
    let alls = document.querySelectorAll(".all");
    alls.forEach((all) => {
      if (!todoListitem.classList.contains("none")) {
        all.classList.add("activeClass");
      }
      all.addEventListener("click", displayAll);
      all.click();
    });

    const cancelBtnElem = document.querySelectorAll(".cancelBtn");

    cancelBtnElem.forEach((cancelBtn) => {
      cancelBtn.addEventListener("click", deleteTodo);
    });
    const completedBtns = document.querySelectorAll(".todoListBtn");
    completedBtns.forEach((completedBtn) => {
      completedBtn.addEventListener("click", checkDone);
    });

    countItemsLeft();
    mouseOver();
    const highlight = () => {
      todoListElem.lastElementChild.classList.add("highlight");
      setTimeout(() => {
        todoListElem.lastElementChild.classList.remove("highlight");
      }, 500);
    };

    const delayHighlight = () => {
      highlight();
      inputBtnElement.disabled = true;
      setTimeout(() => (inputBtnElement.disabled = false), 1000);
    };
    delayHighlight();
    dragAndDrop();
  });
  /* get from storage */
  const getTodoFromLocalStorage = () => {
    let todos;
    if (localStorage.getItem("todoList") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todoList"));
    }
    let alls = document.querySelectorAll(".all");
    alls.forEach((all) => {
      if (todos.length === 0) {
        all.classList.add("activeClass");
      } else {
        all.classList.remove("activeClass");
      }
    });
    todos.forEach((todo) => {
      const todoListitem = document.createElement("li");
      todoListitem.classList.add("todoListItem");
      todoListitem.setAttribute("draggable", "true");
      todoListitem.innerHTML = `
      
      <div class="cover">
          <button class="todoListBtn"></button>
          <span class="todoText">${todo}</span>
      </div>
      <button class="cancelBtn"></button>
  
      `;
      todoListElem.appendChild(todoListitem);
      listArray.push(todoListitem);

      /* All */
      let alls = document.querySelectorAll(".all");
      alls.forEach((all) => {
        if (!todoListitem.classList.contains("none")) {
          all.classList.add("activeClass");
        }
        all.addEventListener("click", displayAll);
      });
    });

    /* for checked todos */
    let doneTodos;
    if (localStorage.getItem("doneTodos") === null) {
      doneTodos = [];
    } else {
      doneTodos = JSON.parse(localStorage.getItem("doneTodos"));
    }
    doneTodos.forEach((doneTodo) => {
      const todoTextElems = document.querySelectorAll(".todoText");
      todoTextElems.forEach((todoTextElem) => {
        if (todoTextElem.innerText === doneTodo) {
          todoTextElem.classList.add("checkedText");
          todoTextElem.previousElementSibling.classList.add("checked");
        }
      });
    });
  };
  getTodoFromLocalStorage();

  /* cancel button */
  const cancelBtnElem = document.querySelectorAll(".cancelBtn");

  cancelBtnElem.forEach((cancelBtn) => {
    cancelBtn.addEventListener("click", deleteTodo);
  });

  /* checked button */
  const completedBtns = document.querySelectorAll(".todoListBtn");
  completedBtns.forEach((completedBtn) => {
    completedBtn.addEventListener("click", checkDone);
  });

  /* clear Completed */
  const clearCompleted = document.querySelector(".clearCompleted");
  clearCompleted.addEventListener("click", clearCompletedTodos);

  /* drag over and drag drop */
  const dragAndDrop = () => {
    const todos = document.querySelectorAll(".todoListItem");

    todos.forEach((todo) => {
      todo.addEventListener("dragstart", dragStart);
      todo.addEventListener("dragend", dragEnd);
      todo.addEventListener("dragover", dragOver);
      todo.addEventListener("dragenter", dragEnter);
      todo.addEventListener("dragleave", dragLeave);
      todo.addEventListener("drop", dragDrop);
    });
  };
  dragAndDrop();

  /* completed */
  const showCompletedTodos = () => {
    let completedElems = document.querySelectorAll(".completed");
    completedElems.forEach((completedElem) => {
      completedElem.addEventListener("click", displayCompletedTodos);
    });
  };
  showCompletedTodos();

  /* Active */

  let activeElems = document.querySelectorAll(".active");
  activeElems.forEach((activeElem) => {
    activeElem.addEventListener("click", displayActiveTodos);
  });

  mouseOver();

  /* count items left */
  countItemsLeft();

  /*   /* touch and drag for mobile */
  /*  const touchAndDrag = () => {
    const todos = document.querySelectorAll(".todoListItem");
    todos.forEach((todo) => {
      todo.addEventListener("touchstart", sortable);
      todo.addEventListener("touchend", sortable);
    });
  };
  touchAndDrag(); */
  sortable();
};
document.addEventListener("DOMContentLoaded", initApp);
const sortable = () => {
  const sortableList = document.querySelector(".todoList");
  new Sortable(sortableList, {
    Animation: 150,
    ghostClass: "sortable-ghost",
  });
  /*   const todoListElem = document.querySelectorA(".todoList");
  todoListElem.innerHTML = "";
  listArray.forEach((todo) => {
    todoListElem.appendChild(todo);

    saveToLocalStorage(todo.firstElementChild.lastElementChild.innerText);
  });
  console.log(listArray); */
};

const touchEnd = (e) => {
  //do
};

/* mouse Over */
const mouseOver = () => {
  const todoListitems = document.querySelectorAll(".todoListItem");
  todoListitems.forEach((todoListitem) => {
    todoListitem.addEventListener("touchstart", () => {});
    todoListitem.addEventListener("mouseenter", () => {
      todoListitem.lastElementChild.style.display = "flex";
    });
    todoListitem.addEventListener("mouseleave", () => {
      todoListitem.lastElementChild.style.display = "none";
    });
  });
};

/* save in local storage */
const saveToLocalStorage = (item) => {
  //do

  let todos;
  if (localStorage.getItem("todoList") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todoList"));
  }
  const indexOfIncomingItems = todos.indexOf(item);

  if (indexOfIncomingItems === -1) {
    todos.push(item);
  } else {
    todos = [];
    todos.push(item);
  }

  localStorage.setItem("todoList", JSON.stringify(todos));
};

const deleteTodo = (e) => {
  const todoItem = e.target.parentElement;
  todoItem.remove();
  const index = listArray.indexOf(todoItem);

  listArray.splice(index, 1);

  removefromLocalStorage(todoItem.innerText.trim());
  countItemsLeft();
  removeDoneTodosFromLocalStorage(todoItem.innerText.trim());
};

const removefromLocalStorage = (item) => {
  let todos;
  if (localStorage.getItem("todoList") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todoList"));
  }

  const getIndex = todos.indexOf(item);
  todos.splice(getIndex, 1);

  localStorage.setItem("todoList", JSON.stringify(todos));
};

const checkDone = (e) => {
  e.target.classList.toggle("checked");
  const textElem = e.target.nextElementSibling;

  textElem.classList.toggle("checkedText");
  //e.target.nextSiblingElem.classList.toggle("checkedText");
  countItemsLeft();
  //const checkedTextContent = text.innerText;

  saveDoneTodosToLocalStorage(textElem);
};

const saveDoneTodosToLocalStorage = (item) => {
  let todos;
  if (localStorage.getItem("doneTodos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("doneTodos"));
  }

  if (!item.classList.contains("checkedText")) {
    const indexofText = todos.indexOf(item.innerText);
    todos.splice(indexofText, 1);
  } else {
    todos.push(item.innerText);
  }

  localStorage.setItem("doneTodos", JSON.stringify(todos));
};

const removeDoneTodosFromLocalStorage = (item) => {
  let todos;
  if (localStorage.getItem("doneTodos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("doneTodos"));
  }

  const getIndex = todos.indexOf(item);
  todos.splice(getIndex, 1);

  localStorage.setItem("doneTodos", JSON.stringify(todos));
};

function setPreferredColorTheme(mode = "dark") {
  /*  for (var i = document.styleSheets[0].rules.length - 1; i >= 0; i--) {
    //dod
    let rule = document.styleSheets[0].rules[i].media;
    // if(rule = )
    if (rule.mediaText.includes("prefers-color-scheme")) {
      console.log("includes");
    }
  } */
}

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

const clearCompletedTodos = (e) => {
  if (!confirm("Are you sure you want to clear all your completed TODOs?"))
    return;
  let checkedArray = [];
  const todosBtns = document.querySelectorAll(".todoListBtn");
  todosBtns.forEach((todoBtn) => {
    if (todoBtn.classList.contains("checked")) {
      todoBtn.parentElement.parentElement.remove();
      removefromLocalStorage(todoBtn.nextElementSibling.innerText);

      checkedArray.push(todoBtn);
    }
  });

  checkedArray.length === 0
    ? alert("You have not completed any TODOs!")
    : checkedArray;
  countItemsLeft();
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

const dragStart = (e) => {
  dragStartIndex = listArray.indexOf(e.target);
};
const dragEnd = (e) => {
  e.target.style.display = "flex";
};
const dragEnter = (e) => {
  e.currentTarget.classList.add("draggedOver");
};
const dragOver = (e) => {
  e.preventDefault();
};
const dragLeave = (e) => {
  e.currentTarget.classList.remove("draggedOver");
};
const dragDrop = (e) => {
  e.preventDefault();
  e.target.classList.remove("draggedOver");
  let dragEndIndex = listArray.indexOf(e.target);

  const itemOne = listArray[dragStartIndex];
  const itemTwo = listArray[dragEndIndex];

  listArray.splice(dragEndIndex, 1, itemOne);
  listArray.splice(dragStartIndex, 1, itemTwo);
  // listArray.splice(dragStartIndex, 1);

  const todoListElem = document.querySelector(".todoList");
  todoListElem.innerHTML = "";
  listArray.forEach((todo) => {
    todoListElem.appendChild(todo);

    saveToLocalStorage(todo.firstElementChild.lastElementChild.innerText);
  });
  //listArray.splice(dragStartIndex, 1);
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
