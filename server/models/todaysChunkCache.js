import mongoose from "mongoose";
const Schema = mongoose.Schema;

const todaysChunkCacheSchema = new Schema({
  examId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  numberPagesToday: {
    type: Number,
    required: true
  },
  // timePerPage: {
  //   type: Number,
  //   required: true
  // },
  durationToday: {
    type: Number,
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
  daysLeft: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  durationAlreadyLearned: {
    type: Number,
    default: 0
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

module.exports = mongoose.model("TodaysChunkCache", todaysChunkCacheSchema);
// export default mongoose.model('User', userSchema)
