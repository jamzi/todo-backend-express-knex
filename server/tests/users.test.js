/*
    Tests taken from the todo-backend spec located at:
    https://github.com/TodoBackend/todo-backend-js-spec/blob/master/js/specs.js
    
    And transcribed from Mocha/Chai to Jest with async/await/promises and other ES6+ features
    for ease of extension of this project (any additional testing).
*/
process.env.NODE_ENV = "test";
const _ = require("lodash");
const url = require("url");
const request = require("./util/httpRequests.js");

// Relative paths are used for supertest in the util file.
const urlFromTodo = (todo) => new URL(todo.url)["pathname"];
const getRoot = (_) => request.get("/users");
const getBody = (response) => response.body;

describe(`Todo-Backend API residing at http://localhost:${process.env.PORT}/users`, () => {
  function createFreshUserAndGetItsUrl(params) {
    var postParams = _.defaults(params || {}, { title: "blah" });
    return request.post("/users", postParams).then(getBody).then(urlFromTodo);
  }

  describe("The pre-requsites", () => {
    it("the api root responds to a GET (i.e. the server is up and accessible, CORS headers are set up)", async () => {
      const response = await request.get("/users");
      expect(response.status).toBe(200);
    });

    it("the api root responds to a POST with the todo which was posted to it", async () => {
      const starting = { title: "a todo" };
      const getRoot = await request.post("/users", starting).then(getBody);
      expect(getRoot).toMatchObject(expect.objectContaining(starting));
    });

    it("the api root responds successfully to a DELETE", async () => {
      const deleteRoot = await request.delete("/users");
      expect(deleteRoot.status).toBe(200);
    });

    it("after a DELETE the api root responds to a GET with a JSON representation of an empty array", async () => {
      var deleteThenGet = await request
        .delete("/users")
        .then(getRoot)
        .then(getBody);
      expect(deleteThenGet).toEqual([]);
    });
  });

  describe("storing new users by posting to the url", () => {
    beforeEach(async () => {
      return await request.delete("/users");
    });

    it("adds a new user to the list of users", async () => {
      const starting = { name: "janez" };
      var getAfterPost = await request
        .post("/users", starting)
        .then(getRoot)
        .then(getBody);
      expect(getAfterPost).toHaveLength(1);
      expect(getAfterPost[0]).toMatchObject(expect.objectContaining(starting));
    });

    function createUserAndVerifyItLooksValidWith(verifyUserExpectation) {
      return request
        .post("/users", { name: "blah" })
        .then(getBody)
        .then(verifyUserExpectation)
        .then(getRoot)
        .then(getBody)
        .then((usersFromGet) => {
          verifyUserExpectation(usersFromGet[0]);
        });
    }

    it("each user has a name", async () => {
      await user((user) => {
        expect(user).toHaveProperty("name");
        expect(typeof user["name"]).toBe("string");
        return user;
      });
    });
  });
});
