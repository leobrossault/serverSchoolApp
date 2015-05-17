$(document).ready(function() {
	var formContainer = $('#forms-pupils form');
	var formBook = $('#form-book');
	var formSub = $('.subscribe');
	var formClass = $('#createClassroom');
	var formConnection = $('.connexion');

	if (formContainer != null) {
		addPupils();
	}

	if (formBook != null) {
		addChapter();
	}

	if (formSub != null) {
		subscribe();
	}

	if (formClass != null) {
		createClassroom();
	}

	if (formConnection != null) {
		connection ();
	}

	function addPupils () {
		var btn = $('#btn-add-pupils');
		var form = $('#forms-pupils form > div');
		var fields = $('.pupils-fields');
		var count = 1;
		var route = formContainer.attr('action');

		btn.click(function() {
			count ++;

			var newField = fields.clone().appendTo(form);
			var id = 'pupil-' + count;
			var firstName = 'firstName' + count;
			var lastName = 'lastName' + count;
			var team = 'team' + count;

			route = route.substring(0, route.length-1);
			route = route +""+ count;

			newField.attr('id', id);
			newField.find($('.firstName')).attr('name', firstName);
			newField.find($('.lastName')).attr('name', lastName);
			newField.find($('.team-form')).attr('name', team);

			formContainer.attr('action', route);
		});
	}

	function addChapter () {
		var btn = $('#btn-add-chapter');
		var form = $('#form-book > div');
		var fields = $('.chap-fields');
		var count = 1;
		var route = formBook.attr('action');

		btn.click(function() {
			count ++;

			var newField = fields.clone().appendTo(form);
			var id = 'chap-' + count;
			var title = 'chapterTitle' + count;
			var number = 'chapterNum' + count;
			var text = 'chapterText' + count;

			route = route.substring(0, route.length-1);
			route = route +""+ count;

			newField.attr('id', id);
			newField.find($('.chapterTitle')).attr('name', title);
			newField.find($('.chapterNum')).attr('name', number);
			newField.find($('.chapterText')).attr('name', text);

			formBook.attr('action', route);
		});
	}

	function subscribe () {
		var form = ('#form-subscribe');
		var detect = $('#detect-click');
		var btnValidate = $('#form-subscribe input[type=submit]');
		var input = $('#form-subscribe input');
		var infoError = $('.error-form');
		var count = 0;
		var index;

		detect.click(function () {
			count = 0;
			infoError.removeClass('active-error');
			input.each(function () {
				if ($(this).val() != "") {
					count ++;
				} else {
					index = $(this).index() - 2;

					infoError.each(function() {
						if (index == $(this).index()) {
							$(this).addClass('active-error');
						}
					});
				}
			});

			count = count - 2;
			if (count == 5) {
				btnValidate.trigger('click');
			}	
		});
	}

	function createClassroom () {
		var overlay = $("#overlay-create-class");
		var radio = $("input[type=radio]");
		var linkBottom = $("#createClassroom a:last-child");

		overlay.click(function() {
			$(this).addClass("disappear");
		});

		linkBottom.click(function() {
			overlay.removeClass("disappear");
		});

		radio.click(function () {
			radio.removeClass("check");
			$(this).addClass("check");
		});
	}

	function connection () {
		setInterval(function () {
			var input = $('.connexion input');
			var count = 0;
			var btn = $('.connexion input[type=submit]');

			input.each(function () {
				if ($(this).val() != "") {
					count ++;
				}
			});

			if (count - 1 == 2) {
				btn.addClass('active');
			} else {
				btn.removeClass('active');
			}
		}, 250);
	}

});