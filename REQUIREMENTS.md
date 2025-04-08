Group Todos App

Tables

- todos (id (inc), text - var, completed - boolean, userId - key to the user, projectId - key to the project)

Apis

- /todos (GET - all todos, POST - add todo, PATCH - update todo)
- /todos/users/:id/assign (POST - assign user to the todo)
- /todos/users/:id/unassign (POST - unassign user to the todo)

---

Features

Tables

- users (id (inc), name - var)

Apis

- /users (GET - all users, specific user, POST - add user, PATCH - update user)
- /users/:id/todos (GET - only the user's todos)
