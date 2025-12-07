import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    lessons: [{_id: String, name: String, description: String}],
    assignments: [{
      _id: String,
      title: String,
      due: String,
      points: Number
    }],
  }
);
export default schema;

