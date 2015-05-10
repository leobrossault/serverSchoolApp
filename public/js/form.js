$(document).ready(function() {
	var formContainer = $('#forms-pupils form');
	var formBook = $('#form-book');

	if (formContainer != null) {
		addPupils();
	}

	if (formBook != null) {
		addChapter();
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
});