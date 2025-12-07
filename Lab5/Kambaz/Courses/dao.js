import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {

  function findAllCourses() {
    return model.find({}, { _id: 1, name: 1, description: 1 });
  }

  // ⭐ GREEN HIGHLIGHT — find courses for a specific enrolled user
  async function findCoursesForEnrolledUser(userId) {
    const { enrollments } = db;
    const courses = await model.find({}, { _id: 1, name: 1, description: 1 });
    const enrolledCourses = courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId &&
          enrollment.course === course._id
      )
    );

    return enrolledCourses;
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    // const newCourse = { ...course, _id: uuidv4() };
    // Database.courses = [...Database.courses, newCourse];
    // return newCourse;
    return model.create(newCourse);
  }
  

  function deleteCourse(courseId) {
    // const { courses, enrollments } = db;
    // db.courses = courses.filter((course) => course._id !== courseId);
    // db.enrollments = enrollments.filter(
    //   (enrollment) => enrollment.course !== courseId
    // );
    return model.deleteOne({ _id: courseId });
  }

  function updateCourse(courseId, courseUpdates) {
    // const { courses } = Database;
    // const course = courses.find((course) => course._id === courseId);
    // Object.assign(course, courseUpdates);
    // return course;
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  

  return {
    findAllCourses,
    findCoursesForEnrolledUser,   // ⭐ GREEN export
    createCourse,
    deleteCourse,
    updateCourse
  };
}
