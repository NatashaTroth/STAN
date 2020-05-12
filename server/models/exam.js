import mongoose from "mongoose";
const Schema = mongoose.Schema;
//validation: https://mongoosejs.com/docs/validation.html

//this object describes properties and datatypes
//Mongodb automatically creates new id for each file added to the db
const examSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    default: new Date(),
    required: true
  },
  totalNumberDays: {
    type: Number,
    required: true
  },
  numberPages: {
    type: Number,
    required: true
  },
  timePerPage: {
    type: Number,
    required: true
  },
  timesRepeat: {
    type: Number,
    default: 1,
    required: true
  },
  startPage: {
    type: Number,
    default: 1,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1,
    required: true
  },
  notes: {
    type: String
  },
  studyMaterialLinks: {
    type: [String],
    default: []
  },
  color: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
});

//model is like a collection in mongodb
//This collection will be called Book and have objects inside it that look like this schema
module.exports = mongoose.model("Exam", examSchema);
