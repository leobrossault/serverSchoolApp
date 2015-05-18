var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classroom = require('./classroom');
var teacher = require('./teacher');

var SubjectSchema = new Schema({
    name: { type: String, default: 'activité 1' },
    type: { type: String, default: 'orthographe' },
    level: { type: Number, default: 1 },
    lesson : { type: String, default: 'orthographe/champs_lexical.pdf'},
    nbActivity : { type: Number, default: 0 },
    subActivity : [{ 
    	name: { type: String, default: 'activité 1' },
    	order: { type: String, default : 'Calculer' },
    	number: { type: Number, default: 1 }
    }],
    classroom: [{
        classroomID: { type: String },
        isLocked: { type: String, default: 'false'}
    }]
});

mongoose.model('subject', SubjectSchema);