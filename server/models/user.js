import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mascot: {
    type: Number,
    default: 0
  },
  tokenVersion: {
    type: Number,
    default: 0
  }
  //TODO: add created at and updated at
  // createdAt: {
  //   type: Date
  // }
});
//TODO: default tokenversion = 0

//todo creted at timestamphttps://www.youtube.com/watch?v=TIAfjBXsY2E&list=PLcCp4mjO-z9_y8lByvIfNgA_F18l-soQv&index=6
// userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", userSchema);
// export default mongoose.model('User', userSchema)
