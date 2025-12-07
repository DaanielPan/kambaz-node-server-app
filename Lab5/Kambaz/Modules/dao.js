import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";

export default function ModulesDao(db) {
    async function findModulesForCourse(courseId) {
      //- // const {modules} = Database;
      //- // return modules.filter((module) => module.course === courseId);
      const course = await model.findById(courseId);
      return course.modules;
    }

    async function createModule(courseId, module) {
      const newModule = { ...module, _id: uuidv4() };
      // const newModule = { ...module, _id: uuidv4() };
      // Database.modules = [...Database.modules, newModule];
      // return newModule;
      await model.updateOne({ _id: courseId }, { $push: { modules: newModule } });
      return newModule;
    }

    async function deleteModule(courseId, moduleId) {
      // const { modules } = Database;
      // Database.modules = modules.filter((module) => module._id !== moduleId);
      const status = await model.updateOne({ _id: courseId }, { $pull: { modules: { _id: moduleId } } });
      return status;
    }

    async function updateModule(courseId, moduleId, moduleUpdates) {
      // const { modules } = db;
      // const module = modules.find((module) => module._id === moduleId);
      // Object.assign(module, moduleUpdates);
      // return module;
      const course = await model.findById(courseId);
      const module = course.modules.id(moduleId);
      Object.assign(module, moduleUpdates);
      await course.save();
      return module;
    }

    return {
      findModulesForCourse,
      createModule,
      deleteModule,
      updateModule,
    };
}
   
   