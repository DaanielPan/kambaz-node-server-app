export default function EnrollmentsDao(db) {
    const enrollments = db.enrollments;
  
    const findEnrollmentsForUser = (userId) =>
      enrollments.filter((e) => e.user === userId);
  
    const enrollUser = (enrollment) => {
      enrollments.push(enrollment);
      return enrollment;
    };
  
    const unenrollUser = (userId, courseId) => {
      const index = enrollments.findIndex(
        (e) => e.user === userId && e.course === courseId
      );
      if (index !== -1) enrollments.splice(index, 1);
      return { status: "ok" };
    };
  
    return {
      findEnrollmentsForUser,
      enrollUser,
      unenrollUser,
    };
  }
  