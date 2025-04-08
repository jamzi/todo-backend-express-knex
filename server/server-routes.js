const _ = require("lodash");
const todos = require("./database/todo-queries.js");
const users = require("./database/user-queries.js");

function createToDo(req, data) {
  const protocol = req.protocol,
    host = req.get("host"),
    id = data.id;

  return {
    title: data.title,
    order: data.order,
    completed: data.completed || false,
    url: `${protocol}://${host}/${id}`,
  };
}

function createUser(req, data) {
  const protocol = req.protocol,
    host = req.get("host"),
    id = data.id;

  return {
    name: data.name,
    url: `${protocol}://${host}/${id}`,
  };
}

async function getAllTodos(req, res) {
  const allEntries = await todos.all();
  return res.send(allEntries.map(_.curry(createToDo)(req)));
}

async function getTodo(req, res) {
  const todo = await todos.get(req.params.id);
  return res.send(todo);
}

async function postTodo(req, res) {
  const created = await todos.create(req.body.title, req.body.order);
  return res.send(createToDo(req, created));
}

async function patchTodo(req, res) {
  const patched = await todos.update(req.params.id, req.body);
  return res.send(createToDo(req, patched));
}

async function deleteAllTodos(req, res) {
  const deletedEntries = await todos.clear();
  return res.send(deletedEntries.map(_.curry(createToDo)(req)));
}

async function deleteTodo(req, res) {
  const deleted = await todos.delete(req.params.id);
  return res.send(createToDo(req, deleted));
}

async function getAllUsers(req, res) {
  const allEntries = await users.all();
  return res.send(allEntries.map(_.curry(createUser)(req)));
}

async function getUser(req, res) {
  const user = await users.get(req.params.id);
  return res.send(user);
}

async function postUser(req, res) {
  const created = await users.create(req.body.name);
  return res.send(createUser(req, created));
}

async function patchUser(req, res) {
  const patched = await users.update(req.params.id, req.body);
  return res.send(createUser(req, patched));
}

async function deleteUser(req, res) {
  const deleted = await users.delete(req.params.id);
  return res.send(createUser(req, deleted));
}

async function deleteAllUsers(req, res) {
  const deletedEntries = await users.clear();
  return res.send(deletedEntries.map(_.curry(createUser)(req)));
}

async function assignUserToTodo(req, res) {
  const assigned = await todos.assignUserToTodo(req.params.id, req.body.todoId);
  return res.send(createToDo(req, assigned));
}

async function unassignUserFromTodo(req, res) {
  const unassigned = await todos.unassignUserFromTodo(req.body.todoId);
  return res.send(createToDo(req, unassigned));
}

async function getAllTodosForUser(req, res) {
  const allEntries = await todos.getAllTodosForUser(req.params.id);
  return res.send(allEntries.map(_.curry(createToDo)(req)));
}

function addErrorReporting(func, message) {
  return async function (req, res) {
    try {
      return await func(req, res);
    } catch (err) {
      console.log(`${message} caused by: ${err}`);

      // Not always 500, but for simplicity's sake.
      res.status(500).send(`Opps! ${message}.`);
    }
  };
}

const toExport = {
  getAllTodos: {
    method: getAllTodos,
    errorMessage: "Could not fetch all todos",
  },
  getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
  postTodo: { method: postTodo, errorMessage: "Could not post todo" },
  patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
  deleteAllTodos: {
    method: deleteAllTodos,
    errorMessage: "Could not delete all todos",
  },
  deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
  getAllUsers: {
    method: getAllUsers,
    errorMessage: "Could not fetch all users",
  },
  getUser: { method: getUser, errorMessage: "Could not fetch user" },
  postUser: { method: postUser, errorMessage: "Could not post user" },
  patchUser: { method: patchUser, errorMessage: "Could not patch user" },
  deleteAllUsers: {
    method: deleteAllUsers,
    errorMessage: "Could not delete all users",
  },
  deleteUser: { method: deleteUser, errorMessage: "Could not delete user" },
  assignUserToTodo: {
    method: assignUserToTodo,
    errorMessage: "Could not assign user to todo",
  },
  unassignUserFromTodo: {
    method: unassignUserFromTodo,
    errorMessage: "Could not unassign user from todo",
  },
  getAllTodosForUser: {
    method: getAllTodosForUser,
    errorMessage: "Could not fetch all todos for user",
  },
};

for (let route in toExport) {
  toExport[route] = addErrorReporting(
    toExport[route].method,
    toExport[route].errorMessage
  );
}

module.exports = toExport;
