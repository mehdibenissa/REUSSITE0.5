
//Le controleur des Tutos
reApp.controller('reTutorialCtrl', function ($scope, $routeParams, $location, $timeout, reConstants) {
	//Le contenu de la page
    if ($routeParams.id >= 1 && $routeParams.id <= reConstants.TUTO_PAGES_COUNT) {
        $scope.content = "app/partials/tutorielContent-" + $routeParams.id + ".html";
    }
	//Redirection vers la page d'accueil avec un timeout  
    else {
        $timeout(function () {
            $location.path("/welcome");
            console.log("TUTO_PAGES_COUNT is " + reConstants.TUTO_PAGES_COUNT);
        });
    }
});

//Le controleur des Questions
reApp.controller('reQuestionCtrl', function ($scope, $rootScope, QuizPersistenceSvc, $routeParams, $location, $timeout, reConstants, reQuestionSvc) {
	//Le contenu des pages Questions
    if ($routeParams.id >= 1 && $routeParams.id <= reConstants.QUESTIONS_COUNT) {
        $scope.content = "app/partials/questionContent-" + $routeParams.id + ".html";
        $scope.title = reQuestionSvc.getQuestion()[$routeParams.id - 1].title;

        //Navigation 'Suivant'
        var nexPageIndex = parseInt($routeParams.id) + 1;
        if (nexPageIndex <= reConstants.QUESTIONS_COUNT) {
            $scope.nextPageUrl = "#question" + nexPageIndex;
        }
        else {
            $scope.nextPageUrl = "#fin";
        }

        //ajouter la classe 'active' du breadcrumb selon l'index de la Question
        $('#breadcrumb .crumbs li:eq(' + ($routeParams.id - 1) + ')').addClass("active");
    }
	//Redirection vers la page d'accueil avec un timeout  
    else {
        $timeout(function () {
            $location.path("/welcome");
            console.log("QUESTIONS_COUNT is " + reConstants.QUESTIONS_COUNT);
        });
    }

    //Questions & Réponses
	//Question 1
    if ($routeParams.id == 1) {
        //Start chronometre
        $rootScope.$broadcast('reChronometreStartChrono');
        //Save StartDatetime
        QuizPersistenceSvc.setstartDate();
		//Listener sur la selection de la reponse pour la Question 1
        $timeout(function () {
            //Comportement choix du réponse
            $(".small").bind('click', function () {
                $(".small").css("background-color", "white");
                $(this).css("background-color", "#ffd800");
                //Save Réponse
                QuizPersistenceSvc.setquestion1($(this).text());
            });
        }, 200);
    }
	//Question 2
    else if ($routeParams.id == 2) {
		//Listener sur la selection de des reponses pour la Question 2
        $timeout(function () {
            //Auto Focus to fist TextInput
            $(".answer:eq(0)").focus();
            $(".answer").keyup(function () {
                if ($(this).val().length) {
                    $(this).next().focus();
                }
            });
			//Recuperation de la reponse
            $(".suiv").click(function () {
                QuizPersistenceSvc.setendDate();
                var i1 = $("#i1").val(); if (i1 == "") { i1 = "X" };
                var i2 = $("#i2").val(); if (i2 == "") { i2 = "X" };
                var i3 = $("#i3").val(); if (i3 == "") { i3 = "X" };
                var i4 = $("#i4").val(); if (i4 == "") { i4 = "X" };
                var i = "-" + i1 + "-" + i2 + "-" + i3 + "-" + i4 + "-";
			
                QuizPersistenceSvc.setquestion2(i);
                var x = QuizPersistenceSvc.getQuiz();
            });
        },200);
    }
});

//Le controleur de la fin
reApp.controller('finCtrl', function ($rootScope, QuizPersistenceSvc) {
	//Arreter le chrono
    $rootScope.$broadcast('reChronometreStopChrono');    
    $rootScope.$broadcast('reChronometreHide');
	//Listener sur le bouton save
    $(".save").click(function () {
        QuizPersistenceSvc.Persiste();        
    });
})