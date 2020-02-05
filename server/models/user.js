const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  mascot: Number,
  tokenVersion: Number
});
//TODO: default tokenversion = 0

//todo creted at timestamphttps://www.youtube.com/watch?v=TIAfjBXsY2E&list=PLcCp4mjO-z9_y8lByvIfNgA_F18l-soQv&index=6
// userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", userSchema);
// export default mongoose.model('User', userSchema)
