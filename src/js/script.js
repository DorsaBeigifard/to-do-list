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
const clearMobile = document.querySelector(".filter-option-clear");

// for storage:
document.addEventListener("DOMContentLoaded", (e) => {
  const toDos = getAllToDos();
  createInDOM(toDos);
});

// when the form is submitted => create new to-do
form.addEventListener("submit", addNewToDo);
// add to array ToDos
function addNewToDo(e) {
  e.preventDefault(); // It prevents refreshing every time something is submitted

  if (!formInput) return;

  const newToDo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: formInput.value,
    isCompleted: false,
  };

  saveToLocalStorage(newToDo);
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
                  <button  data-todo-id = ${todo.id} class="todo__edit">
                    <i class="far fa-edit"></i>
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

  const editBtn = [...document.querySelectorAll(".todo__edit")];
  editBtn.forEach((btn) => {
    btn.addEventListener("click", openEditForm);
  });
}

function removeToDo(e) {
  let toDos = getAllToDos();
  const todoId = Number(e.target.dataset.todoId);
  toDos = toDos.filter((todo) => todo.id !== todoId);
  saveAllToDos(toDos);
  filtertoDos();
}

function checkToDo(e) {
  let toDos = getAllToDos();
  const todoId = Number(e.target.dataset.todoId);
  const toDo = toDos.find((todo) => todo.id === todoId);
  toDo.isCompleted = !toDo.isCompleted;
  saveAllToDos(toDos);
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
  const toDos = getAllToDos();
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
  let toDos = getAllToDos();
  toDos = toDos.filter((todo) => !todo.isCompleted);
  filtertoDos(toDos);
  saveAllToDos(toDos);
}

//----------FILTER mobile:

selectedFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filtertoDos();
});

clearMobile.addEventListener("click", clearAllCompleted);

//----------- MODAL - EDIT

const closeModalBtns = document.querySelectorAll(".close-modal"); //discard and close window
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");

function openModal(e) {
  backdrop.classList.remove("hidden");
}

closeModalBtns.forEach((btn) => btn.addEventListener("click", closeModal));
backdrop.addEventListener("click", closeModal);
function closeModal(e) {
  backdrop.classList.add("hidden");
}

const editToDoInput = document.querySelector("#edit-todo");
const updateToDoBtn = document.querySelector("#update-todo");
updateToDoBtn.addEventListener("click", updateTodo);

let toDoToEditId;

function openEditForm(e) {
  toDoToEditId = Number(e.target.dataset.todoId);
  const toDos = getAllToDos();
  const toDoToEdit = toDos.find((t) => t.id === toDoToEditId); // which todo will be edited ?
  editToDoInput.value = toDoToEdit.title;
  openModal();
}

function updateTodo(e) {
  const toDos = getAllToDos();
  const toDo = toDos.find((t) => t.id === toDoToEditId);
  toDo.title = editToDoInput.value;
  saveAllToDos(toDos);
  filtertoDos();
  closeModal();
}

const modalContent = document.querySelector(".modal");
modalContent.addEventListener("click", (e) => {
  e.stopPropagation();
});

//------------- local storage

function getAllToDos() {
  const savedToDos = JSON.parse(localStorage.getItem("toDos")) || [];
  return savedToDos;
}

function saveToLocalStorage(toDo) {
  const savedToDos = getAllToDos();
  savedToDos.push(toDo);
  localStorage.setItem("toDos", JSON.stringify(savedToDos));
  return savedToDos;
}

function saveAllToDos(toDos) {
  localStorage.setItem("toDos", JSON.stringify(toDos));
}
