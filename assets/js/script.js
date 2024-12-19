// --------- Date
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
document.getElementById("date").textContent = formattedDate;

// 1- when the form is submitted => create new to-do
const toDos = [];

const formInput = document.querySelector(".form__input");
const form = document.querySelector(".form");
const toDoList = document.querySelector(".todo__list");

form.addEventListener("submit", addNewToDo);

function addNewToDo(e) {
  e.preventDefault(); // It prevents refreshing every time something is submitted

  if (!formInput) return null;

  const newToDo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: formInput.value, // Corrected here
    isCompleted: false,
  };

  toDos.push(newToDo);

  // ADD TO DOM
  let result = "";
  toDos.forEach((todo) => {
    result += `
            <li class="todo__item">
                <p class="todo__title">${todo.title}</p>
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
}

console.log(toDos);
