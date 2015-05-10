// var express = require('express');
var mongoose = require('mongoose');

var Teacher = require('../models/teacher.js');
var Message = require('../models/message.js');
var TeacherMod = mongoose.model('teacher');
var ClassroomMod = mongoose.model('classroom');
var PupilMod = mongoose.model('pupil');
var BookMod = mongoose.model('book');
var MessageMod = mongoose.model('message');
var SubjectMod = mongoose.model('subject');


exports.findAllPupils = function (req, res) {
	PupilMod.find({}, function(err, pupils) {
		if (err) return console.dir(err);

		if (pupils != null) {
			res.json(pupils);
		}
	});
}

exports.findPupil = function (req, res) {
	PupilMod.findOne({passwordApp: req.params.password}, function(err, pupil) {
		if (err) return console.dir(err);

		if (pupil != null) {
			res.json(pupil);			
		}
	});
}

exports.findBook = function (req, res) {
	BookMod.findOne({teacher: req.params.teacher, isLocked: true}, function(err, book) {
		if (err) return console.dir(err);

		if (book != null) {
			res.json(book);			
		}
	});
}

exports.findPupilsTeam = function (req, res) {
	PupilMod.findOne({_id: req.params.pupilID}, function(err, pupil) {
		if (err) return console.dir(err);

		if (pupil != null) {
			PupilMod.find({team: pupil.team, _id : {$ne: req.params.pupilID}}, function(err, pupilsTeam) {
				if (err) return console.dir(err);

				if (pupilsTeam != null) {
					res.json(pupilsTeam);					
				}
			});
		}
	});
}

exports.setCurrentChapter = function (req, res) {
	PupilMod.update({ _id: req.params.pupilID},{currentChapter: req.params.currentChapter}, {upsert:true}, function(err) {
		if (err) return console.dir(err);
		res.send(200);
	});
}

exports.queryMessage = function (req, res) {
	PupilMod.find({_id: req.params.pupilID}).sort({created_at: 'desc'}).exec(function (err, messages) {
		if (err) return console.dir(err);
		res.json(messages[0].messageReceived);
	});
}

exports.sendMessage = function (req, res) {
	res.send(200);

	var messageApp = req.body.message;
	console.log(messageApp.authorName);

	message = new MessageMod ({
		author: messageApp.author,
		authorName: messageApp.authorName,
		title: messageApp.title,
		object: messageApp.object,
		text: messageApp.text,
		team: messageApp.team,
		created_at: new Date 
	});

	message.save(function(err, teach) {
		if (err) return console.error(err);		

		PupilMod.update({_id: message.author}, {$push: {messageSend: message._id}}, {upsert:true}, function(err) {
			if (err) return console.dir(err);
			
			PupilMod.update({team: message.team}, {$push: {
				messageReceived: {
					author: message.author, 
					authorName: message.authorName,
					message: message._id,
					title: message.title,
					text: message.text,
					created_at: new Date 
				}}}, {upsert:true, multi: true}, function(err) {
				console.log("Message add with success !");
			});
		});
	});	
}

exports.okRead = function (req, res) {
	PupilMod.update({'messageReceived._id': req.params.messageID}, {'$set': { 
		'messageReceived.$.isReading': "true"
	}}, {upsert: true}, function (err) {
		if (err) console.log(err);
		res.send(200);
	});
}

exports.addReadTime = function (req, res) {
	PupilMod.update({ _id: req.params.pupilID},{readTime: req.params.readTime}, {upsert:true}, function(err) {
		if (err) return console.dir(err);
		res.send(200);
	});
}

exports.addWordBag = function (req, res) {
	PupilMod.update({ _id: req.params.pupilID},{$push: { wordsBag: req.params.word }}, {upsert:true}, function(err) {
		if (err) return console.dir(err);
		res.send(200);
	});
}

exports.unlockChapter = function (req, res) {
	PupilMod.update({_id: req.params.pupilID},{currentChapter: req.params.numChapter}, {upsert: true}, function(err) {
		if (err) return console.dir(err);
		res.send(200);
	});
}

exports.goodAnswers = function (req, res) {
	var chapter = parseInt(req.params.numChapter) + 1;
	var percent = (req.params.goodAnswers/6) * 100;
	var chapter = parseInt(req.params.numChapter) + 1;
	console.log("Mon chapitre : "+chapter);
	PupilMod.findOne({_id: req.params.pupilID, 'activities.chapter': chapter}, {'activities.$': 1}, function (err, pupil) {
		if (err) return console.dir(err);
		console.log(pupil);
		if (pupil == null) {
			console.log("Pupil null");
			BookMod.findOne({'chapter.numChapter': chapter}, {'chapter.$': 1}, function (err, book) {
				if (err) return console.dir(err);
				console.log("book");
				SubjectMod.findOne({'subActivity._id': book.chapter[0].activity}, {'subActivity.$': 1}, function (err, subject) {
					if (err) return console.dir(err);
					console.log("subject");
					PupilMod.update({_id: req.params.pupilID}, {$push: {
						activities: {
							name: subject.subActivity[0].name,
							chapter: chapter,
							percent: percent,
							nbTry: 1
						}
					}}, {upsert: true}, function (err) {
						if(err) console.log(err);
						console.log("Update Pupil !");
						res.send(200);
					});
				});
			});
		}
	});
}

exports.nbTry = function (req, res) {
	var nbTry = req.params.nbTry;
	var chapter = parseInt(req.params.numChapter) + 1;
	console.log("Nombre essai : "+nbTry);
	PupilMod.findOne({'activities.chapter': chapter}, {'activities.$': 1}, function (err, pupil) {
		if (pupil.activities[0].nbTry != null) {
			nbTry = parseInt(nbTry) + parseInt(pupil.activities[0].nbTry);
			PupilMod.update({'activities.chapter': chapter}, {'$set': { 
				'activities.$.nbTry': nbTry
			}}, {upsert: true}, function (err) {
				if (err) console.log(err);
				res.send(200);
			});
		}
	});
}


