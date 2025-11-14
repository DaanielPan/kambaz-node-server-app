import CoursesDao from "./dao.js";
import EnrollmentsDao from "../../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // CREATE COURSE
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);

  // FIND ALL COURSES
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  };

  // ⭐ DELETE COURSE
  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  };
  app.delete("/api/courses/:courseId", deleteCourse);

  // ⭐ GREEN — UPDATE COURSE (PUT)
  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  // ⭐ GREEN — REGISTER PUT ROUTE
  app.put("/api/courses/:courseId", updateCourse);

  // REGISTER find all route
  app.get("/api/courses", findAllCourses);

  // ⭐ find courses for enrolled user
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  // REGISTER enrolled user courses route
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}
