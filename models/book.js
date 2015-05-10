var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacher = require('./teacher');
var teacher = require('./classroom');

var BookSchema = new Schema({
	title: { type: String, default: 'unNom' },
	author: { type: String, default: 'unNom' },
	nbChapter: { type: Number, default: 1 },
	chapterUnlock: { type: Number, default: 1 },
	isLocked: { type: Boolean, default: false },
	classroom: { type: Schema.Types.ObjectId, ref: 'classroom' },
	chapter: [{
		titleChapter: { type: String, default: 'unNom' },
		textChapter: { type: String, default: 'mon texte' },
		numChapter: { type: Number, default: 1 },
		activity: { type: String, default: 'id de mon activity' },
		isLocked: { type: Boolean, default: false }
	}],
	resume: { type: String, default: 'Résumé'},
	teacher : { type: Schema.Types.ObjectId, ref: 'teacher'}
});

mongoose.model('book', BookSchema);