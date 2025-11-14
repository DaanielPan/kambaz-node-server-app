export default function AssignmentsDao(db) {
    return {
      findAssignmentsForModule: (moduleId) =>
        db.assignments.filter((a) => a.module === moduleId),
  
      createAssignment: (assignment) => {
        const newAssignment = { ...assignment, _id: Date.now().toString() };
        db.assignments.push(newAssignment);
        return newAssignment;
      },
  
      updateAssignment: (assignmentId, assignment) => {
        const index = db.assignments.findIndex((a) => a._id === assignmentId);
        db.assignments[index] = { ...db.assignments[index], ...assignment };
        return db.assignments[index];
      },
  
      deleteAssignment: (assignmentId) => {
        db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
        return { status: "ok" };
      },
    };
  }
  