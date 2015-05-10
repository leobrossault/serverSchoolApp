var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classroom = require('./classroom');
var book = require('./book');
var subject = require('./subject');

var TeacherSchema = new Schema({
  	firstName: { type: String, default: 'unPrénom' },
  	lastName: { type: String, default: 'unNom' },
  	email: { type: String, default: 'unNom@gmail.com' },
  	password: { type: String, default: '' },
  	classrooms: [{
  		type: Schema.Types.ObjectId, ref: 'classroom'
  	}],
  	books: [{
  		type: Schema.Types.ObjectId, ref: 'book'
  	}]
});

mongoose.model('teacher', TeacherSchema);
