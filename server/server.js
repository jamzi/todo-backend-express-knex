const app = require("./server-config.js");
const routes = require("./server-routes.js");

const port = process.env.PORT || 5000;

app.get("/todos", routes.getAllTodos);
app.get("/todos/:id", routes.getTodo);

app.post("/todos", routes.postTodo);
app.patch("/todos/:id", routes.patchTodo);

app.delete("/todos", routes.deleteAllTodos);
app.delete("/todos/:id", routes.deleteTodo);

app.post("/todos/users/:id/assign", routes.assignUserToTodo);
app.post("/todos/users/:id/unassign", routes.unassignUserFromTodo);

app.get("/users", routes.getAllUsers);
app.get("/users/:id/todos", routes.getAllTodosForUser);
app.get("/users/:id", routes.getUser);

app.post("/users", routes.postUser);
app.patch("/users/:id", routes.patchUser);

app.delete("/users", routes.deleteAllUsers);
app.delete("/users/:id", routes.deleteUser);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
