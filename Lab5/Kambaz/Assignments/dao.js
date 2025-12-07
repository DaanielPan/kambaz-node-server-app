import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function AssignmentsDao(db) {
  async function findCourseIdByModuleId(moduleId) {
    const course = await model.findOne({ "modules._id": moduleId });
    return course ? course._id : null;
  }

  async function findAssignmentsForModule(courseId, moduleId) {
    const course = await model.findById(courseId);
    if (!course) return [];
    const module = course.modules.id(moduleId);
    return module ? module.assignments : [];
  }

  async function findAssignmentsForModuleById(moduleId) {
    const course = await model.findOne({ "modules._id": moduleId });
    if (!course) return [];
    const module = course.modules.id(moduleId);
    return module ? module.assignments : [];
  }

  async function createAssignment(courseId, moduleId, assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    await model.updateOne(
      { _id: courseId, "modules._id": moduleId },
      { $push: { "modules.$.assignments": newAssignment } }
    );
    return newAssignment;
  }

  async function createAssignmentByModuleId(moduleId, assignment) {
    const courseId = await findCourseIdByModuleId(moduleId);
    if (!courseId) throw new Error("Module not found");
    return createAssignment(courseId, moduleId, assignment);
  }

  async function updateAssignment(courseId, moduleId, assignmentId, assignmentUpdates) {
    const course = await model.findById(courseId);
    if (!course) throw new Error("Course not found");
    const module = course.modules.id(moduleId);
    if (!module) throw new Error("Module not found");
    const assignment = module.assignments.id(assignmentId);
    if (!assignment) throw new Error("Assignment not found");
    Object.assign(assignment, assignmentUpdates);
    await course.save();
    return assignment;
  }

  async function updateAssignmentByModuleId(moduleId, assignmentId, assignmentUpdates) {
    const courseId = await findCourseIdByModuleId(moduleId);
    if (!courseId) throw new Error("Module not found");
    return updateAssignment(courseId, moduleId, assignmentId, assignmentUpdates);
  }

  async function deleteAssignment(courseId, moduleId, assignmentId) {
    const course = await model.findById(courseId);
    if (!course) throw new Error("Course not found");
    const module = course.modules.id(moduleId);
    if (!module) throw new Error("Module not found");
    module.assignments.pull({ _id: assignmentId });
    await course.save();
    return { status: "ok" };
  }

  async function deleteAssignmentByModuleId(moduleId, assignmentId) {
    const courseId = await findCourseIdByModuleId(moduleId);
    if (!courseId) throw new Error("Module not found");
    return deleteAssignment(courseId, moduleId, assignmentId);
  }

  return {
    findCourseIdByModuleId,
    findAssignmentsForModule,
    findAssignmentsForModuleById,
    createAssignment,
    createAssignmentByModuleId,
    updateAssignment,
    updateAssignmentByModuleId,
    deleteAssignment,
    deleteAssignmentByModuleId,
  };
}
