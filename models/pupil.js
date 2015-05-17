var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var book = require('./book');
var teacher = require('./teacher');
var message = require('./message');

var PupilSchema = new Schema({
  	firstName: { type: String, default: 'unNom' },
  	lastName: { type: String, default: 'unNomDeFamille'},
  	grade: { type: String, default: 'CM2' },
  	team: { type: String, default: 'Alone'},
  	classroom: { type: Schema.Types.ObjectId, ref: 'classroom'},
  	teacher: { type: Schema.Types.ObjectId, ref: 'teacher'},
  	passwordApp: { type: String, default: 'xxx'},
  	currentBook: { type: Schema.Types.ObjectId, ref: 'book' },
  	currentChapter: { type: String, default: '0' },
  	readTime: { type: Number, default: '0' },
    wordsBag: [{type: String, default: 'unMot'}],
    messageSend: [{ type: Schema.Types.ObjectId, ref: 'message'}],
    messageReceived: [{
      message: { type: Schema.Types.ObjectId, ref: 'message'},
      authorID: { type: Schema.Types.ObjectId, ref: 'pupils'},
      created_at: { type: Date },
      isReading: { type: String, default: 'false'},
      authorName: {type: String, default: 'Toto'},
      title: {type: String, default: 'Title'},
      text: {type: String, default: 'Text'},
    }],
    activities: [{
      name: { type: String, default: 'Champs Lexical'},
      chapter: { type: Number, default: 1 },
      percent: { type: Number, default: 0 },
      nbTry: { type: Number, default: 0 }
    }]
});

mongoose.model('pupil', PupilSchema);