const dom = {
  todosList: document.querySelector("#todos-list"),
  nameToDo: document.querySelector("#form-input-add"),
  buttonAdd: document.querySelector("#btn-add"),
  checkedButton: document.querySelector('input[name="radio"]:checked'),
};

const ui = {
  renderTodos(todos) {
    todos.forEach((todo) => {
      dom.todosList.insertAdjacentHTML(
        "beforeend",
        `<li>
        <input type="checkbox" ${
          todo.done ? "checked" : ""
        } class="todo-checkbox" data-id="${todo.id}"/>
        <label for="${todo.id}">${todo.title}</label>
        <button type="button" class="btn-delete"  data-id="${todo.id}">
        <span class="glyphicon glyphicon-trash"></span> 
        </button>
        </li>`
      );
    });
    document.querySelectorAll(".btn-delete").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const id = e.target.closest("button").dataset.id;
        await server.deleteTodo(id);
        e.target.closest("li").remove();
      });
    });

    document.querySelectorAll(".todo-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", async (e) => {
        const id = e.target.dataset.id;
        const isDone = e.target.checked;

        await server.updateTodo({ done: isDone }, id);

        console.log(`Todo ${id} updated to done: ${isDone}`);
      });
    });
  },
  addToDo() {
    dom.buttonAdd.addEventListener("click", async (e) => {
      e.preventDefault();

      const title = dom.nameToDo.value.trim();
      const isDone =
        document.querySelector('input[name="radio"]:checked').value === "yes";

      const newTodo = { title, done: isDone };
      const savedTodo = await server.addTodo(newTodo);

      dom.nameToDo.value = "";
      document.querySelector("#radio-no").checked = true;
      const todos = await server.getTodos();
      ui.renderTodos(todos);
    });
  },
};
