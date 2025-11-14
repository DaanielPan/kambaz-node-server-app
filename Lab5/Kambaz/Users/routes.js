import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  // CREATE USER (not part of auth)
  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  // DELETE USER
  const deleteUser = (req, res) => {
    const { userId } = req.params;
    dao.deleteUser(userId);
    res.sendStatus(200);
  };

  // FIND ALL USERS
  const findAllUsers = (req, res) => {
    res.json(dao.findAllUsers());
  };

  // FIND USER BY ID
  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = dao.findUserById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  };

  // ⭐⭐⭐ SIGNIN — EXACTLY like screenshot
  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);

    if (currentUser) {
      req.session["currentUser"] = currentUser;   // ⭐ store in session
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  // ⭐⭐⭐ PROFILE — EXACTLY like screenshot
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];   // ⭐ read session
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // ⭐⭐⭐ SIGNOUT — EXACTLY like screenshot
  const signout = (req, res) => {
    req.session.destroy();                            // ⭐ clear session
    res.sendStatus(200);
  };

  // ⭐⭐⭐ SIGNUP — assigns new user to session like earlier instructions
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;         // ⭐ store in session
    res.json(currentUser);
  };

  // ⭐⭐⭐ UPDATE USER — keep session updated (green box)
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;

    dao.updateUser(userId, userUpdates);

    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;         // ⭐ keep session in sync

    res.json(currentUser);
  };

  // ROUTES
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);

  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
