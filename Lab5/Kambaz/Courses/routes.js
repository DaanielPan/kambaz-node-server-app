import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // CREATE COURSE
  const createCourse = async (req, res) => {
    const newCourse = await dao.createCourse(req.body);
    const currentUser = req.session["currentUser"];
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/courses", createCourse);

  // FIND ALL COURSES
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  // ⭐ DELETE COURSE
  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };
  app.delete("/api/courses/:courseId", deleteCourse);

  // ⭐ GREEN — UPDATE COURSE (PUT)
  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  // ⭐ GREEN — REGISTER PUT ROUTE
  app.put("/api/courses/:courseId", updateCourse);

  // REGISTER find all route
  app.get("/api/courses", findAllCourses);

  // ⭐ find courses for enrolled user
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  // REGISTER enrolled user courses route
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // ENROLL USER IN COURSE
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);

  // UNENROLL USER FROM COURSE
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  // FIND USERS FOR COURSE
  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };
  app.get("/api/courses/:cid/users", findUsersForCourse);
}
