import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mascot: {
    type: Number,
    default: 0
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  googleLogin: {
    type: Boolean,
    default: false
  },
  //TODO: updated at
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("User", userSchema);
// export default mongoose.model('User', userSchema)
