var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pupil = require('./pupil');

var MessageSchema = new Schema({
  created_at: { type: Date },
  author: {type: Schema.Types.ObjectId, ref: 'pupil'},
  authorName: {type: String, default: 'Toto'},
  title: {type: String, default: 'Title'},
  object: {type: String, default: 'Object'},
  text: {type: String, default: 'Text'},
  team: {type: String, default: '1'},
  isReading: {type: String, default: "false"}
});

mongoose.model('message', MessageSchema);
