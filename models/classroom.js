var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacher = require('./teacher');
var pupil = require('./pupil');

var ClassroomSchema = new Schema({
  	name: { type: String, default: 'unNom' },
  	grade : { type: String, default: 'CM2' },
  	teacher : { type: Schema.Types.ObjectId, ref: 'teacher'},
  	pupils : [{
  		type: Schema.Types.ObjectId, ref: 'pupil'
  	}]
});

mongoose.model('classroom', ClassroomSchema);