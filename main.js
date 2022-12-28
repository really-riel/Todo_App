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

  /* completed */
  let completedElems = document.querySelectorAll(".completed");
  completedElems.forEach((completedElem) => {
    completedElem.addEventListener("click", displayCompletedTodos);
  });

  /* Active */

  let activeElems = document.querySelectorAll(".active");
  activeElems.forEach((activeElem) => {
    activeElem.addEventListener("click", displayActiveTodos);
  });

  /* drag over and drag drop */
  const todos = document.querySelectorAll(".todoListItem");
  const todoDragChangables = document.querySelectorAll(".cover");
  todos.forEach((todo, index) => {
    todo.addEventListener("dragstart", dragStart);
  });
  todoDragChangables.forEach((todoDragChangable) => {
    //console.log(todoDragChangable);
    todoDragChangable.addEventListener("dragover", dragOver);
    todoDragChangable.addEventListener("dragenter", dragEnter);
    todoDragChangable.addEventListener("dragleave", dragLeave);
    todoDragChangable.addEventListener("drop", dragDrop);
  });

  /* mouse Over */
  const todoListitems = document.querySelectorAll(".todoListItem");
  todoListitems.forEach((todoListitem) => {
    todoListitem.addEventListener("mouseover", () => {
      todoListitem.lastElementChild.style.display = "flex";
    });
    todoListitem.addEventListener("mouseleave", () => {
      todoListitem.lastElementChild.style.display = "none";
    });
  });

  /* count items left */
  countItemsLeft();
};
document.addEventListener("DOMContentLoaded", initApp);

/* save in local storage */
const saveToLocalStorage = (item) => {
  //do

  let todos;
  if (localStorage.getItem("todoList") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todoList"));
  }

  todos.push(item);

  localStorage.setItem("todoList", JSON.stringify(todos));
};

const deleteTodo = (e) => {
  const todoItem = e.target.parentElement;
  todoItem.remove();

  removefromLocalStorage(todoItem.innerText.trim());
  countItemsLeft();
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
  const text = e.target.nextElementSibling;

  text.classList.toggle("checkedText");
  //e.target.nextSiblingElem.classList.toggle("checkedText");
  countItemsLeft();
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
  const todosBtns = document.querySelectorAll(".todoListBtn");
  todosBtns.forEach((todoBtn) => {
    if (todoBtn.classList.contains("checked")) {
      todoBtn.parentElement.parentElement.remove();
      removefromLocalStorage(todoBtn.nextElementSibling.innerText);
    }
  });
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
  const todosBtns = document.querySelectorAll(".todoListBtn");

  todosBtns.forEach((todoBtn) => {
    if (!todoBtn.classList.contains("checked")) {
      todoBtn.parentElement.parentElement.classList.add("none");
    } else {
      todoBtn.parentElement.parentElement.classList.remove("none");
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
  const todosBtns = document.querySelectorAll(".todoListBtn");

  todosBtns.forEach((todoBtn) => {
    if (todoBtn.classList.contains("checked")) {
      todoBtn.parentElement.parentElement.classList.add("none");
    } else {
      todoBtn.parentElement.parentElement.classList.remove("none");
    }
  });
};

const dragStart = (e) => {
  dragStartIndex = listArray.indexOf(e.target);
};
const dragEnter = (e) => {
  e.target.classList.add("draggedOver");
};
const dragOver = (e) => {
  e.preventDefault();
};
const dragLeave = (e) => {
  e.target.classList.remove("draggedOver");
};
const dragDrop = (e) => {
  e.target.classList.remove("draggedOver");
  let dragEndIndex = listArray.indexOf(e.target);
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
