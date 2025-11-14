const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  };
  const moduleObject = {
    id: "m101",
    name: "Intro to Web Dev",
    description: "Basics of React and Node",
    course: "CS4550",
  };
  export default function WorkingWithObjects(app) {
    const getAssignment = (req, res) => {
      res.json(assignment);
    };
    const getAssignmentTitle = (req, res) => {
        res.json(assignment.title);
    };
    const setAssignmentTitle = (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
      };
    app.get("/lab5/assignment/title", getAssignmentTitle);
    app.get("/lab5/assignment", getAssignment);
    app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);

    const getModule = (req, res) => {
        res.json(moduleObject);
      };
      app.get("/lab5/module", getModule);
    
      app.get("/lab5/assignment/title", getAssignmentTitle);
      app.get("/lab5/assignment", getAssignment);
      app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
    
    const getModuleName = (req, res) => {
        res.json(moduleObject.name);
      };
      app.get("/lab5/module/name", getModuleName);

    const setModuleName = (req, res) => {
        const { newName } = req.params;
        moduleObject.name = newName;
        res.json(moduleObject);
      };
      app.get("/lab5/module/name/:newName", setModuleName);
    
      const setModuleDescription = (req, res) => {
        const { newDescription } = req.params;
        moduleObject.description = newDescription;
        res.json(moduleObject);
      };
      app.get("/lab5/module/description/:newDescription", setModuleDescription);
    
      const setAssignmentScore = (req, res) => {
        const { newScore } = req.params;
        assignment.score = parseInt(newScore);
        res.json(assignment);
      };
      app.get("/lab5/assignment/score/:newScore", setAssignmentScore);

      const setAssignmentCompleted = (req, res) => {
        const { completed } = req.params;
        assignment.completed = completed === "true";  // convert string → boolean
        res.json(assignment);
      };
      app.get("/lab5/assignment/completed/:completed", setAssignmentCompleted);
      
  }