// var express = require('express');
var mongoose = require('mongoose');

var Teacher = require('../models/teacher.js');
var TeacherMod = mongoose.model('teacher');
var ClassroomMod = mongoose.model('classroom');
var PupilMod = mongoose.model('pupil');
var BookMod = mongoose.model('book');
var SubjectMod = mongoose.model('subject');


/**** CREATE TEACHER ****/

exports.createTeacher = function (req, res) {
	if (req.body.passwordOne == req.body.passwordTwo && req.body.passwordOne != "") {
		var teach = new TeacherMod ({
		  firstName: req.body.lastName,
		  lastName: req.body.firstName,
		  email: req.body.mail,
		  password: req.body.passwordOne
		});

		TeacherMod.findOne({ email: req.body.mail }, function(err, teacherExist) {
		  	if (err) return console.error(err);
			if (teacherExist == null) {
			  	teach.save(function(err, teach) {
				  if (err) return console.error(err);
				  console.dir(teach);
				});
		  	} else {
		  		res.redirect("/creerCompte");
		  	}
		});
		sess.teacher = teach;
		sess.classrooms = 0;
		sess.pupils = 0;
		sess.books = 0;
		res.redirect("/dashboard");
	}
}

/**** CONNECTION ****/

exports.connection = function (req, res) {
	TeacherMod.findOne({ email: req.body.email }, function(err, teacher) {
	  	if (err) return console.error(err);
		if (teacher != null) {
		  	if(teacher.password == req.body.password) {
		  		sess.teacher = teacher;
		  		// ClassroomMod.find({teacher: sess.teacher._id}, function (err, classrooms) {
		  		// 	if (err) return console.error(err);
		  		// 	sess.classrooms = classrooms;
		  		// });	

			  	ClassroomMod.find({teacher: sess.teacher._id}).sort({name: 'asc'}).exec(function (err, classrooms) {
		  			if (err) return console.error(err);
		  			sess.classrooms = classrooms;
		  		});

		  		BookMod.find({teacher: sess.teacher._id}, function (err, books) {
		  			if (err) return console.error(err);
		  			sess.books = books;
		  		});

		  		PupilMod.find({teacher: sess.teacher._id}, function (err, pupils) {
		  			if (err) return console.error(err);
		  			sess.pupils = pupils;
		  			res.redirect("/dashboard");
		  		});

		  	} else {
		  		res.redirect("/");
		  	}
	  	} else {
	  		res.redirect("/creerCompte");
	  	}
	});
}

/**** TRY CONNECTION ****/

exports.tryConnection = function(req, res) {
	var ok;
	if (sess.teacher == null) {
		ok = false;
		res.redirect('/');
		console.log('Connection required');
	} else {
		ok = true;
	}

	return ok;
}

/**** CREATE CLASSROOM ****/

exports.createClassroom = function (req, res) {
	if (req.body.name != "" && req.body.grade != "") {
		classroom = new ClassroomMod ({
			name: req.body.name,
			grade: req.body.grade,
			teacher: sess.teacher._id
		});

		ClassroomMod.findOne({ teacher: sess.teacher._id, name: req.body.name }, function(err, classExist){
			if (classExist == null) {
				classroom.save(function(err, teach) {
					if (err) return console.error(err);

					ClassroomMod.find({teacher: sess.teacher._id}, function (err, classrooms) {
			  			if (err) return console.error(err);
			  			sess.classrooms = classrooms;
			  			res.redirect("/classe/"+ req.body.name);
			  		});	 				
				});		        
			} else {
				console.log("Déjà existante ...");
				res.redirect("/classes");
			}
		});


	}
}

/**** REQUEST CLASSROOM ****/

exports.queryClassroom = function (req, res) {
	ClassroomMod.findOne({ name: req.params.className, teacher: sess.teacher._id }, function(err, classroom) {
	  	if (err) return console.error(err);
		if (classroom != null) {
			sess.currentClassroom = classroom;
			PupilMod.find({ classroom: classroom._id}, function (err, pupils) {
				if (err) return console.error(err);
			});

			BookMod.findOne({ classroom: classroom._id, isLocked: true}, function (err, book) {
				if (err) return console.error(err);
				res.render('dash/classroomHome.ejs', { teacher:sess.teacher, classroom: sess.currentClassroom, book: book});
			});
	  	}
	});	
}

/**** DELETE CLASSROOM ****/

exports.deleteClassroom = function (req, res) {
	var idClassroom = req.params.idClassroom;
	ClassroomMod.remove({ _id: idClassroom}, function (err) {
		if (err) {
			return console.error(err);
		} else {
			ClassroomMod.find({teacher: sess.teacher._id}, function (err, classrooms) {
			  	if (err) return console.error(err);
			  	sess.classrooms = classrooms;
			});	 	
			console.log("Classe supprimée");
		}		
	});

	PupilMod.remove({ classroom: idClassroom}, function (err, pupils) {
		if (err) {
			return console.error(err)
		} else {
			console.log("Élèves de la classe supprimés");
			res.redirect("/classes");
		}
	});	
}

/**** CREATE PUPILS ****/

exports.createPupils = function (req, res) {
	var nbPupils = parseInt(req.params.nbPupils) + 1;

	ClassroomMod.findOne({ name: req.params.classroom, teacher: sess.teacher._id }, function(err, classroom) {
	  	if (err) return console.error(err);
		if (classroom != null) {
			for (var i = 1; i < nbPupils; i++) {
				// i.toString();
				var firstName = eval("req.body.firstName" + i);
				var lastName = eval("req.body.lastName" + i);
				var team = eval("req.body.team" + i);
				var password = Math.random().toString(36).slice(-8);

				if (firstName != "" || lastName != "") {
					pupil = new PupilMod ({
						firstName: firstName,
						lastName: lastName,
						grade: classroom.grade,
						teacher: sess.teacher._id,
						classroom: classroom._id,
						passwordApp: password,
						team: team
					});

					ClassroomMod.update({ name: req.params.classroom, teacher: sess.teacher._id},{$push: {pupils: pupil._id}}, {upsert:true},function(err){
					    if(err){
					        console.log(err);
					    }else{
					        console.log("Successfully added");
					    }
				    });

				    pupil.save(function(err, teach) {
						if (err) return console.error(err);
					});
				} else {
					res.redirect("/classe/"+sess.currentClassroom.name+"/eleves");
				}
			}

		    res.redirect("/classe/"+sess.currentClassroom.name+"/eleves");
	  	}
	});	
}

/**** REQUEST PUPIL ****/

exports.queryPupil = function (req, res) {
	ClassroomMod.findOne({ name: req.params.className, teacher: sess.teacher._id}, function(err, classroom) {
	  	if (err) return console.error(err);

	  	PupilMod.find({ classroom: classroom._id }).sort({lastName: 'asc'}).exec(function(err, pupils) {
		  	if (err) return console.error(err);
			if (req.path == "/classe/"+classroom.name+"/equipes") {
				res.render('dash/classroomTeam.ejs', { teacher: sess.teacher, classroom: classroom, pupils: pupils, className: req.params.className, books: sess.books });
			} else if (req.path == "/classe/"+classroom.name+"/eleves") {
				res.render('dash/classroomPupil.ejs', { teacher: sess.teacher, classroom: classroom, pupils: pupils, className: req.params.className, books: sess.books });
			} else {
				res.render('dash/classroomPupil.ejs', { teacher: sess.teacher, classroom: classroom, pupils: pupils, className: req.params.className, books: sess.books });
			}		
		});
	});	
}

exports.queryPupilAlone = function (req, res) {
	PupilMod.findOne({ _id: req.params.idPupil }, function(err, pupil) {
	  	if (err) return console.error(err);	
		res.render('dash/pupil.ejs', { teacher: sess.teacher, classroom: sess.classrooms, pupil: pupil, className: req.params.className });
	});	
}

/**** CREATE BOOK ****/

exports.createBook = function (req, res) {
	var nbChapter = parseInt(req.params.nbChapter);
	console.log(nbChapter);

	BookMod.findOne({ title: req.body.title , teacher: sess.teacher._id }, function(err, book) {
	  	if (err) return console.error(err);
		if (book == null) {
			var title = req.body.title;
			var author = req.body.author;
			var resume = req.body.resume;

			if (title != "" || author != "" || resume !="" || nbChapter > 0) {
				book = new BookMod ({
					title: title,
					author: author,
					nbChapter: nbChapter,
					teacher: sess.teacher._id,
					classroom: req.params.classroomID,
					resume: resume
				});

				book.save(function(err, book) {
					if (err) return console.error(err);

					if (book =! null) {
						for (var i = 1; i < nbChapter + 1; i++) {
							var titleChapter = eval("req.body.chapterTitle" + i);
							var numChapter = eval("req.body.chapterNum" + i);
							var textChapter = eval("req.body.chapterText" + i);
							var isLocked;	

							if (i == 1) {
								isLocked = true;
							} else {
								isLocked = false;
							}

							BookMod.update({ title: title, teacher: sess.teacher._id},{$push: {
								chapter: {
									titleChapter: titleChapter,
									textChapter: textChapter,
									numChapter: numChapter,
									isLocked: isLocked
								}
							}}, {upsert:true},function(err){
							    if(err){
							        console.log(err);
							    }else{
							        BookMod.find({teacher: sess.teacher._id}, function (err, books) {
							  			if (err) return console.error(err);
							  			sess.books = books;
							  			res.render('dash/books.ejs', { teacher:sess.teacher, classroom: sess.currentClassroom, books: sess.books});
							  		});
							    }
						    });
						}	
					}
				});				
			}		
	  	} else {
	  		console.log("fail");
	  	}
	});
}

exports.queryBook = function (req, res) {
	ClassroomMod.findOne({ name: req.params.className, teacher: sess.teacher._id}, function(err, classroom) {
	  	if (err) return console.error(err);

	  	BookMod.find({ classroom: classroom._id }, function(err, books) {
		  	if (err) return console.error(err);
			if (books != null) {
				res.render('dash/books.ejs', { teacher: sess.teacher, classroom: classroom, books: books });
		  	}
		});
	});	
}

exports.lockBook = function (req, res) {
	var idBook = req.params.idBook;
	var isLocked;

	if (req.params.isLocked != "true") {
		isLocked = "true";
	} else {
		isLocked = "false";
	}

	BookMod.update({},{isLocked: false}, {multi:true}, function (err) {
		if(err){
			console.log(err);
		} else {
			PupilMod.update({classroom: sess.currentClassroom},{currentChapter: 0, readTime: 0}, {multi: true}, function (err){
				BookMod.update({ _id: idBook},{isLocked: isLocked}, {upsert:true}, function (err) {
					BookMod.find({teacher: sess.teacher._id}, function (err, books) {
						if (err) return console.error(err);
						sess.books = books;
						res.redirect("/classe/"+sess.currentClassroom.name+"/livres/"+idBook);
					});
				});
			});
		}
	});
}

/**** REQUEST RESSOURCES ****/

exports.createSubject = function(req, res) {
	var subject = new SubjectMod ({
		name: req.body.name,
		type: req.body.type,
		level: req.body.level,
		lesson: req.body.lesson
	});

	subject.save(function(err, subject) {
		if (err) return console.error(err);
		res.redirect("/classe/"+sess.currentClassroom.name+"/ressources");
	});
}

exports.createActivity = function(req, res) {
	SubjectMod.findOne({_id: req.params.subjectID}, function(err, subject) {
		var countAct = subject.nbActivity + 1;
		SubjectMod.update({ _id: req.params.subjectID},{$push: {
			subActivity: {
				name: req.body.name, 
				order: req.body.order,
				number: countAct
			}
		}, nbActivity: countAct}, {upsert:true}, function (err) {
			if (err) return console.error(err);
			res.redirect("/classe/"+sess.currentClassroom.name+"/ressources");
		});
	});
}

exports.activeActivity = function (req, res) {
	BookMod.update({_id: req.params.bookID, 'chapter.activity': req.params.activityID}, {'$set': { 
		'chapter.$.activity': "Pas d'activité"
	}}, {upsert: true}, function(err) {
		BookMod.update({_id: req.params.bookID, 'chapter.numChapter': req.body.chapter}, {'$set': { 
			'chapter.$.activity': req.params.activityID
		}}, {upsert: true}, function(err) {
			res.redirect("/classe/"+sess.currentClassroom.name+"/ressources");
		});
	});
}

exports.queryRessources = function (req, res) {
	var orthoVar = 0;
	var grammaireVar = 0;
	var vocVar = 0;
	var conjugVar = 0;

	ClassroomMod.findOne({ name: req.params.className, teacher: sess.teacher._id}, function(err, classroom) {
	  	if (err) return console.error(err);

		SubjectMod.find({type: "Orthographe"}, function(err, ortho) {
			if (err) return console.error(err);
			orthoVar = ortho; 

			SubjectMod.find({type: "Grammaire"}, function(err, grammaire) {
				if (err) return console.error(err);
				grammaireVar = grammaire

				SubjectMod.find({type: "Vocabulaire"}, function(err, voc) {
					if (err) return console.error(err);
					vocVar = voc;	

					SubjectMod.find({type: "Conjuguaison"}, function(err, conjug) {
						if (err) return console.error(err);
						conjugVar = conjug;
						BookMod.findOne({teacher: sess.teacher._id, isLocked: true}, function (err, book) {
							res.render('dash/classroomRessources.ejs', { teacher: sess.teacher, classroom: classroom, ortho: orthoVar, grammaire: grammaireVar, vocabulaire: vocVar, conjuguaison: conjugVar, book: book});					
						});
					});	
				});
			});
		});
	});
}


/**** DECONNECTION ****/

exports.deconnection = function (req, res) {
	sess.destroy;
	res.redirect("/");
}
