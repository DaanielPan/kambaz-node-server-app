import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  app.get("/api/modules/:moduleId/assignments", (req, res) => {
    const assignments = dao.findAssignmentsForModule(req.params.moduleId);
    res.json(assignments);
  });

  app.post("/api/modules/:moduleId/assignments", (req, res) => {
    const newAssignment = dao.createAssignment({
      ...req.body,
      module: req.params.moduleId,
    });
    res.json(newAssignment);
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const updated = dao.updateAssignment(
      req.params.assignmentId,
      req.body
    );
    res.json(updated);
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const result = dao.deleteAssignment(req.params.assignmentId);
    res.json(result);
  });
}
