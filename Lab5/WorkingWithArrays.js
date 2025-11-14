let todos = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
  ];
  
  export default function WorkingWithArrays(app) {
    // GET /lab5/todos
    const getTodos = (req, res) => {
      const { completed } = req.query;
      if (completed !== undefined) {
        const completedBool = completed === "true";
        const completedTodos = todos.filter(
          (t) => t.completed === completedBool
        );
        res.json(completedTodos);
        return;
      }
      res.json(todos);
    };
  
    // GET /lab5/todos/:id
    const getTodoById = (req, res) => {
      const { id } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      res.json(todo);
    };
  
    // OLD CREATE (GET version)
    // GET /lab5/todos/create
    const createNewTodo = (req, res) => {
      const newTodo = {
        id: new Date().getTime(),
        title: "New Task",
        completed: false,
      };
      todos.push(newTodo);
      res.json(todos);
    };
  
    // POST /lab5/todos/create
    const postNewTodo = (req, res) => {
      const newTodo = { ...req.body, id: new Date().getTime() };
      todos.push(newTodo);
      res.json(newTodo);
    };
  
    // OLD DELETE (GET version)
    // GET /lab5/todos/:id/delete
    const removeTodoGet = (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      todos.splice(todoIndex, 1);
      res.json(todos);
    };
  
    // NEW DELETE method
    // DELETE /lab5/todos/:id
    const deleteTodo = (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        return;
      }  
      todos.splice(todoIndex, 1);
      res.sendStatus(200);
    };
  
    // UPDATE title (old GET route)
    // GET /lab5/todos/:id/title/:title
    const updateTodoTitle = (req, res) => {
      const { id, title } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      todo.title = title;
      res.json(todos);
    };
  
    // UPDATE description
    // GET /lab5/todos/:id/description/:description
    const updateTodoDescription = (req, res) => {
      const { id, description } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      todo.description = description;
      res.json(todos);
    };
  
    // UPDATE completed (old GET route)
    // GET /lab5/todos/:id/completed/:completed
    const updateTodoCompleted = (req, res) => {
      const { id, completed } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      todo.completed = completed === "true";
      res.json(todos);
    };
  
    // PUT update (new correct implementation)
    // PUT /lab5/todos/:id
    const updateTodo = (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
     if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
        return;
     }

      todos = todos.map((t) => {
        if (t.id === parseInt(id)) {
          return { ...t, ...req.body };
        }
        return t;
      });
      res.sendStatus(200);
    };
  
    // ROUTES
    app.get("/lab5/todos", getTodos);
    app.get("/lab5/todos/:id", getTodoById);
  
    app.get("/lab5/todos/create", createNewTodo);
    app.post("/lab5/todos/create", postNewTodo);
  
    app.get("/lab5/todos/:id/delete", removeTodoGet);
    app.delete("/lab5/todos/:id", deleteTodo);
  
    app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
    app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
    app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  
    app.put("/lab5/todos/:id", updateTodo);
  }
  