
/* IMPORT CONTROLLER */
var teacher = require('../controller/teacher');
var pupil = require('../controller/pupilAppController');

/* ROUTES DASHBOARD */
module.exports = function (app) {
	app.get('/', function(req, res) {
		sess = req.session;

		if (sess.teacher != null) {
			res.render('dash.ejs');
		} else {
			res.render('connection.ejs');
		}
	  	
		app.get('/creerCompte', function(req, res) {
		  	res.render('subscribe.ejs', {existant: false});
		});

		/**** TEACHER CONNECTED ****/

		app.get('/dashboard', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/dash.ejs', { teacher:sess.teacher, classrooms: sess.classrooms, books: sess.books, pupils: sess.pupils });
			}		
		});

		app.get('/profil', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/profil.ejs', { teacher:sess.teacher, classrooms: sess.classrooms, books: sess.books });
			}		
		});
		app.get('/classes', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/allClassroom.ejs', { teacher: sess.teacher, classrooms: sess.classrooms });
			}		
		});
		app.get('/livres', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/books.ejs', { teacher: sess.teacher, books: sess.books });
			}		
		});
		app.get('/creerLivre', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/forms/createBook.ejs', { teacher: sess.teacher, books: sess.books, classroom: sess.currentClassroom });
			}		
		});
		app.get('/creerSujet', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/forms/createSubject.ejs', { teacher: sess.teacher, books: sess.books, classroom: sess.currentClassroom });
			}		
		});
		app.get('/creerActivite/:idSubject', function(req, res) {
			if(teacher.tryConnection(req, res) == true) {
				res.render('dash/forms/createActivity.ejs', { teacher: sess.teacher, books: sess.books, classroom: sess.currentClassroom, subject: req.params.idSubject });
			}		
		});
  	});


  	/**** TRAITMENT ****/

  	/* GLOBAL */
  	app.post('/connection', teacher.connection);
  	app.get('/deconnexion', teacher.deconnection);
  	app.post('/createTeacher', teacher.createTeacher);

  	/* CLASSROOM */
  	app.post('/createClassroom', teacher.createClassroom);
  	app.get('/classe/:className', teacher.queryClassroom);
  	app.get('/classe/delete/:idClassroom', teacher.deleteClassroom);

  	/* PUPILS */
  	app.get('/classe/:className/eleves', teacher.queryPupil);
  	app.get('/classe/:className/eleves/:password', teacher.queryPupil);
  	app.get('/classe/:className/equipes', teacher.queryPupil);
	app.get('/eleve/:className/:idPupil', teacher.queryPupilAlone); 
  	app.post('/createPupils/:classroom/:nbPupils', teacher.createPupils);

  	/* BOOK */
  	app.get('/classe/:className/livres', teacher.queryBook);
  	app.get('/classe/:className/livres/:idBook', teacher.queryBook);
  	app.post('/:classroomID/createBook/:nbChapter', teacher.createBook);
  	app.get('/book/lock/:idBook/:isLocked', teacher.lockBook);

  	/* RESSOURCES */
  	app.get('/classe/:className/ressources', teacher.queryRessources);
  	app.get('/classe/:className/ressources/:idSubject', teacher.queryRessources); 	 	
  	app.post('/:classroomID/createSubject', teacher.createSubject);
  	app.get('/unLockSubject/:classroomID/:subjectID/:activeOrNot', teacher.unLockSubject)
  	app.post('/:classroomID/:subjectID/createActivity', teacher.createActivity);
  	app.post('/:bookID/:activityID/activeActivity', teacher.activeActivity);

  	/***** RESTFUL API *****/

  	/* GET */
  	app.get('/app/pupils', pupil.findAllPupils);
	app.get('/app/pupils/:password', pupil.findPupil);
	app.get('/app/book/:teacher', pupil.findBook);
	app.get('/app/team/:pupilID', pupil.findPupilsTeam);

	/* POST */
	app.get('/app/pupil/currentChapter/:pupilID/:currentChapter', pupil.setCurrentChapter);
	app.get('/app/pupil/addReadTime/:pupilID/:readTime', pupil.addReadTime);
	app.get('/app/pupil/addWordBag/:pupilID/:word', pupil.addWordBag);
	app.get('/app/pupil/chapter/unlock/:pupilID/:numChapter', pupil.unlockChapter);
	app.get('/app/pupil/message/:pupilID', pupil.queryMessage);
	app.post('/app/send/message', pupil.sendMessage);
	app.get('/app/pupil/activity/:pupilID/:numChapter/:goodAnswers', pupil.goodAnswers);
	app.get('/app/pupil/activity/try/:pupilID/:numChapter/:nbTry', pupil.nbTry);
	app.get('/app/pupil/message/okRead/:pupilID/:messageID', pupil.okRead);
}
