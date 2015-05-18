$(document).ready(function () {
	
	/* DASHBOARD HOME */
	initDashHome ();

	/* PUPILS PAGE */
	menuSelect ();	

	function initDashHome () {
		/* LEFTBAR */
		var classes = $(".classroom, #createClassroom");
		var width = classes.width();

		classes.css({
			height: width
		});

		/* PROFIL */
		var name = $(".teacher-name p span").width();
		var divName = $(".teacher-name p");

		divName.width(name);
	}

	function menuSelect () {
		var content = $(".content");

		if (content.hasClass("dashHomeClassroom")) {
			$("#menu li:first-child").addClass("on");
		} else if (content.hasClass("dashPupil")) {
			$("#menu li:first-child + li").addClass("on");
			showPupil ();
		} else if (content.hasClass("dashTeam")) {
			$("#menu li:first-child + li + li").addClass("on");
			showTeam ();
		} else if (content.hasClass("dashBook")) {
			$("#menu li:first-child + li + li + li").addClass("on");
			showBook ();
		} else if (content.hasClass("dashRessources")) {
			$("#menu li:last-child").addClass("on");
			showRessources ();
		} else if (content.hasClass("dashHome")) {
			modify ();
		}
	}

	function showPupil () {
		/* MENU */
		$(".list-type ul li:first-child").addClass("on");
		$(".middle-content .my-pupil:first-child").addClass("on");
		var pupilsRight = $(".list ul li");
		var pupilMiddle = $(".middle-content .my-pupil");

		pupilsRight.click(function() {
			pupilsRight.removeClass("on");
			$(this).addClass("on");

			var indexList = $(".list ul li").index($(this)) + 1;

			pupilMiddle.removeClass("on");

			$(".middle-content .my-pupil:nth-child("+ indexList +")").addClass("on");			
		});

		/* NUMBER */
		var number = $(".stats p span");
		number.each(function() {
			truncateNumber($(this));
		});

		var percent = $(".percent-act-pupil span");
		percent.each(function() {
			truncateNumber($(this));
		});

		/* SHOW THE CORRECT PUPIL WITH URL */
		var pathname = window.location.pathname;
		var codeUrl = pathname.split("/")[4];
		
		pupilsRight.each(function() {
			var code = $(this).find($(".code")).html();
			if (codeUrl == code && code != null) {
				pupilsRight.removeClass("on");
				$(this).addClass("on");

				var indexList = $(".list ul li").index($(this)) + 1;
				$(".middle-content .my-pupil:first-child").removeClass("on");
				$(".middle-content .my-pupil:nth-child("+ indexList +")").addClass("on");			
			}	
		});

		/* PROGRESS BAR */
		var progressBar = $(".progress-act-pupil");
		var barTotalWidth = $(".progress-act-pupil").width();

		progressBar.each(function() {
			/* PROGRESS BAR WIDTH */
			var progressBarRead = $(this).find($(".progress-act-pupil span"))
			var value = (progressBarRead.attr("data-progress") / 100) * barTotalWidth;
			progressBarRead.width(value);
		});

	}

	function showTeam () {
		/* TAB */
		$(".team:first-child").addClass("on");
		$(".list-team li:first-child").addClass("on");

		var teamsRight = $(".list ul li");
		var teamsMiddle = $(".middle-content .team");

		teamsRight.click(function() {
			teamsRight.removeClass("on");
			$(this).addClass("on");

			var indexList = $(".list ul li").index($(this)) + 1;

			teamsMiddle.removeClass("on");
			$(".middle-content .team:nth-child("+ indexList +")").addClass("on");
		});

		/* NB PERSON IN TEAM */
		teamsMiddle.each(function () {
			var nbPupil = $(this).find($(".pupilTeam")).length;
			var readNb = $(this).find($(".progress-read"));
			var actNb = $(this).find($(".moy-activities"));

			readNb.html(readNb.html() / nbPupil);
			actNb.html(actNb.html() / nbPupil);
		});

		/* NUMBER */
		var number = $(".nb-truncate");
		number.each(function() {
			truncateNumber($(this));
		});

		/* PROGRESS BAR */
		var progressBar = $(".progress-bar");
		var barTotalWidth = $(".progress-bar").width();

		progressBar.each(function() {
			/* PROGRESS BAR WIDTH */
			var progressBarRead = $(this).find($(".progress-bar-read"))
			var value = (progressBarRead.attr("data-progress") / 100) * barTotalWidth;
			progressBarRead.width(value);

			/* POSITION INDIC. */
			var indic = $(this).siblings(".indic-current").css({
				left: value-72+"px"
			});
		});
	}

	function showBook () {
		$(".my-book:first-child").addClass("on");
		$(".book-list ul li:first-child").addClass("on");

		var booksRight = $(".book-list ul li");
		var booksMiddle = $(".middle-content .my-book");

		$(".toggle-bg").click(function() {
			var href = $(this).siblings(".link-lock").attr("href");
			window.location.href = href;
		});

		booksRight.click(function() {
			booksRight.removeClass("on");
			$(this).addClass("on");

			var indexList = $(".book-list ul li").index($(this)) + 1;

			booksMiddle.removeClass("on");
			$(".middle-content .my-book:nth-child("+ indexList +")").addClass("on");
		});

		/* SHOW THE CORRECT BOOK WITH URL */
		var pathname = window.location.pathname;
		var idUrl = pathname.split("/")[4];
		
		booksRight.each(function() {
			var id = $(this).find($(".hidden")).html();
			if (idUrl == id && id != null) {
				booksRight.removeClass("on");
				$(this).addClass("on");

				var indexList = $(".list ul li").index($(this)) + 1;
				$(".middle-content .my-book:first-child").removeClass("on");
				$(".middle-content .my-book:nth-child("+ indexList +")").addClass("on");			
			}	
		});
	}

	function showRessources () {
		var ressourcesRightFirst = $(".ressources-list .first-lvl-menu");
		var ressourcesRightFirstLink = $(".ressources-list .first-lvl-menu-link");
		var ressourcesRightSecond = $(".ressources-list .second-lvl-menu");
		var type;

		var liSelected = $(".first-lvl-menu.on .second-lvl-menu:first-child");
		var liParent = $(".first-lvl-menu:first-child");

		$(".container-subject:first-child").addClass("on");
		$(".container-subject:first-child .my-subject:first-child").addClass("on");
		$(".first-lvl-menu.on .second-lvl-menu:first-child").addClass("onSecond");

		ressourcesRightFirstLink.on('click', clickLi);
		ressourcesRightSecond.on('click', clickLi);

		$(".toggle-bg").click(function() {
			var href = $(this).siblings(".link-lock").attr("href");
			window.location.href = href;
		});

		function clickLi () {
			ressourcesRightSecond.removeClass("onSecond");
			$(".my-subject").removeClass("on");
			
			if ($(this).hasClass("first-lvl-menu-link")) {
				liParent = $(this).parent(".first-lvl-menu");
				ressourcesRightFirst.removeClass("on");
				liParent.addClass("on");
				liSelected = ressourcesRightFirst.find($(".second-lvl-menu:first-child"));
			} else {
				liParent = $(this).parents(".first-lvl-menu");
				liSelected = $(this);
			}

			liSelected.addClass("onSecond");

			var indexFirst = liParent.index() + 1;
			var indexSecond = liSelected.index() + 1;

			$(".container-subject").removeClass("on");

			switch (indexFirst) {
				case 1: 
					type = $(".middle-ortho");
					$(".middle-ortho").addClass("on");
				break;
				case 2: 
					type = $(".middle-gram");
					$(".middle-gram").addClass("on");
				break;
				case 3: 
					type = $(".middle-voca");
					$(".middle-voca").addClass("on");
				break;
				case 4: 
					type = $(".middle-conj");
					$(".middle-conj").addClass("on");
				break;
			}

			type.find($(".my-subject:nth-child("+indexSecond+")")).addClass("on");
		}
	}

	function modify () {
		var btnModif = $("#modify");
		var classrooms = $(".classroom");

		btnModif.click(function () {
			if (btnModif.hasClass("click")) {
				btnModif.removeClass("click");
				classrooms.removeClass("move");
			} else {
				btnModif.addClass("click");
				classrooms.addClass("move");
			}
			
		});
	}

	/* NUMBER */
	function truncateNumber (number) {
		var value = Math.floor(number.html());
		number.html(value);
	}

});