// --------- Date
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
document.getElementById("date").textContent = formattedDate;

//Select from DOM
const formInput = document.querySelector(".form__input");
const form = document.querySelector(".form");
const toDoList = document.querySelector(".todo__list");

const allToDosFilter = document.querySelector(".filter-option:nth-child(1)");
const allFilterOption = document.querySelector(".filter-option:nth-child(1)");
const completedFilterOption = document.querySelector(
  ".filter-option:nth-child(2)"
);
const notCompletedFilterOption = document.querySelector(
  ".filter-option:nth-child(3)"
);
const clearCompletedFilterOption = document.querySelector(
  ".filter-option:nth-child(4)"
);

const selectedFilter = document.querySelector(".filter-options-select");

// for storage:
let toDos = [];

// when the form is submitted => create new to-do
form.addEventListener("submit", addNewToDo);
// add to array ToDos
function addNewToDo(e) {
  e.preventDefault(); // It prevents refreshing every time something is submitted

  if (!formInput) return null;

  const newToDo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: formInput.value,
    isCompleted: false,
  };

  toDos.push(newToDo);
  filtertoDos();
}
// -------- Add the task to DOM
function createInDOM(toDos) {
  let result = "";
  toDos.forEach((todo) => {
    result += `
            <li class="todo__item">
                <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
                <div class="todo__details">
                  <span class="todo__created-at">${new Date(
                    todo.createdAt
                  ).toLocaleDateString("en")}</span>
                  <button  data-todo-id = ${todo.id} class="todo__check">
                    <i class="far fa-check-square"></i>
                  </button>
                  <button data-todo-id = ${todo.id} class="todo__remove">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </div>
              </li>`;
  });

  toDoList.innerHTML = result;
  formInput.value = ""; // Clear the input after adding the to-do

  // buttons
  const removeBtn = [...document.querySelectorAll(".todo__remove")];
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", removeToDo);
  });

  const checkBtn = [...document.querySelectorAll(".todo__check")];
  checkBtn.forEach((btn) => {
    btn.addEventListener("click", checkToDo);
  });
}

function removeToDo(e) {
  // console.log(e.target.dataset.todoId); // * Data attribute: in this way we can access to do id
  //data-todo-id={} => todoId (we should select it this way.)

  const todoId = Number(e.target.dataset.todoId);

  toDos = toDos.filter((todo) => todo.id !== todoId);

  filtertoDos();
  // console.log(toDos);
}

function checkToDo(e) {
  const todoId = Number(e.target.dataset.todoId);

  const toDo = toDos.find((todo) => todo.id === todoId);
  toDo.isCompleted = !toDo.isCompleted;
  filtertoDos();
}

//----------FILTER DESKTOP:

let filterValue = "all";

allFilterOption.addEventListener("click", () => {
  (filterValue = "all"), filtertoDos();
  allFilterOption.classList.add("filter-option--active");
  completedFilterOption.classList.remove("filter-option--active");
  notCompletedFilterOption.classList.remove("filter-option--active");
});
completedFilterOption.addEventListener("click", (e) => {
  filterValue = "completed";
  filtertoDos();
  allFilterOption.classList.remove("filter-option--active");
  completedFilterOption.classList.add("filter-option--active");
  notCompletedFilterOption.classList.remove("filter-option--active");
});
notCompletedFilterOption.addEventListener("click", () => {
  filterValue = "not-completed";
  filtertoDos();

  allFilterOption.classList.remove("filter-option--active");
  completedFilterOption.classList.remove("filter-option--active");
  notCompletedFilterOption.classList.add("filter-option--active");
});
clearCompletedFilterOption.addEventListener("click", clearAllCompleted);

function filtertoDos() {
  let filteredToDos;
  switch (filterValue) {
    case "all":
      createInDOM(toDos);
      break;
    case "completed":
      filteredToDos = toDos.filter((todo) => todo.isCompleted);
      createInDOM(filteredToDos);
      break;
    case "not-completed":
      filteredToDos = toDos.filter((todo) => !todo.isCompleted);
      createInDOM(filteredToDos);
      break;
    default:
      createInDOM(toDos);
  }
}

function clearAllCompleted() {
  toDos = toDos.filter((todo) => !todo.isCompleted);
  createInDOM(toDos);
}

//----------FILTER mobile:

selectedFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterMobile();
});

function filterMobile() {
  switch (filterValue) {
    case "all": {
      createInDOM(toDos);
      break;
    }
    case "completed": {
      const filteredToDos = toDos.filter((todo) => todo.isCompleted);
      createInDOM(filteredToDos);
      break;
    }
    case "not-completed": {
      const filteredToDos = toDos.filter((todo) => !todo.isCompleted);
      createInDOM(filteredToDos);
      break;
    }
    default:
      createInDOM(toDos);
  }
}
