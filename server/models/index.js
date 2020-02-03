const User = require("./User");
const Exam = require("./Exam");
// const User = require("../models/user");
// const Exam = require("../models/exam");
const { MotivationalSayings } = require("./MotivationalSayings");

// import {User} from "./User"
console.log("usereer: " + User);
module.exports = {
  User,
  Exam,
  MotivationalSayings
};
