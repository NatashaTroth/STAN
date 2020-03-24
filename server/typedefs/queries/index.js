// import { userQueries } from "./userQueries";
// import { examQueries } from "./examQueries";
const { userQueries } = require("./userQueries");
const { examQueries } = require("./examQueries");
const queries = [userQueries, examQueries];
module.exports = { queries };
