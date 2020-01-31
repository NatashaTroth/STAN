const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const motivationalSayingsSchema = new Schema({
  content: String,
  mood: Number
})

module.exports = mongoose.model('MotivationalSayings', motivationalSayingsSchema)