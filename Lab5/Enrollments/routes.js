import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Get all enrollments for a user
  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });

  // Enroll a user into a course
  app.post("/api/users/:userId/enrollments/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    const newEnrollment = dao.enrollUserInCourse(userId, courseId);
    res.json(newEnrollment);
  });

  // Unenroll
  app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    const result = dao.unenrollUserFromCourse(userId, courseId);
    res.json(result);
  });
}
