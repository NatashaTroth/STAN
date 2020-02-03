const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//this object describes properties and datatypes
//Mongodb automatically creates new id for each file added to the db
const examSchema = new Schema({
  subject: String,
  examDate: Date,
  startDate: Date,
  numberPages: Number,
  timePerPage: Number,
  timesRepeat: Number,
  currentPage: Number,
  notes: String,
  pdfLink: String,
  completed: Boolean,
  userId: String
});

//model is like a collection in mongodb
//This collection will be called Book and have objects inside it that look like this schema
module.exports = mongoose.model("Exam", examSchema);
