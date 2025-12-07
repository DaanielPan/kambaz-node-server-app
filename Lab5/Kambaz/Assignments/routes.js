import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // FIND ASSIGNMENTS FOR MODULE
  const findAssignmentsForModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const assignments = await dao.findAssignmentsForModule(courseId, moduleId);
    res.json(assignments);
  };
  app.get("/api/courses/:courseId/modules/:moduleId/assignments", findAssignmentsForModule);

  // CREATE ASSIGNMENT
  const createAssignment = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const newAssignment = await dao.createAssignment(courseId, moduleId, req.body);
    res.json(newAssignment);
  };
  app.post("/api/courses/:courseId/modules/:moduleId/assignments", createAssignment);

  // UPDATE ASSIGNMENT
  const updateAssignment = async (req, res) => {
    const { courseId, moduleId, assignmentId } = req.params;
    const updated = await dao.updateAssignment(courseId, moduleId, assignmentId, req.body);
    res.json(updated);
  };
  app.put("/api/courses/:courseId/modules/:moduleId/assignments/:assignmentId", updateAssignment);

  // DELETE ASSIGNMENT
  const deleteAssignment = async (req, res) => {
    const { courseId, moduleId, assignmentId } = req.params;
    const result = await dao.deleteAssignment(courseId, moduleId, assignmentId);
    res.json(result);
  };
  app.delete("/api/courses/:courseId/modules/:moduleId/assignments/:assignmentId", deleteAssignment);

  // BACKWARD COMPATIBILITY: Old API pattern (moduleId only)
  const findAssignmentsForModuleOld = async (req, res) => {
    const { moduleId } = req.params;
    const assignments = await dao.findAssignmentsForModuleById(moduleId);
    res.json(assignments);
  };
  app.get("/api/modules/:moduleId/assignments", findAssignmentsForModuleOld);

  const createAssignmentOld = async (req, res) => {
    const { moduleId } = req.params;
    try {
      const newAssignment = await dao.createAssignmentByModuleId(moduleId, req.body);
      res.json(newAssignment);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  app.post("/api/modules/:moduleId/assignments", createAssignmentOld);

  const updateAssignmentOld = async (req, res) => {
    const { assignmentId } = req.params;
    const { moduleId, ...assignmentUpdates } = req.body;
    if (!moduleId) {
      res.status(400).json({ message: "moduleId is required in request body" });
      return;
    }
    try {
      const updated = await dao.updateAssignmentByModuleId(moduleId, assignmentId, assignmentUpdates);
      res.json(updated);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  app.put("/api/assignments/:assignmentId", updateAssignmentOld);

  const deleteAssignmentOld = async (req, res) => {
    const { assignmentId } = req.params;
    // For old API, we need moduleId in body or query
    const { moduleId } = req.body || req.query;
    if (!moduleId) {
      res.status(400).json({ message: "moduleId is required" });
      return;
    }
    try {
      const result = await dao.deleteAssignmentByModuleId(moduleId, assignmentId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  app.delete("/api/assignments/:assignmentId", deleteAssignmentOld);
}
