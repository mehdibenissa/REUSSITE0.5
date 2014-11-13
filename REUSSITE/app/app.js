var reApp = angular.module('reApp', ['ngRoute']);


//Les Parametres de Routage
reApp.config(function ($routeProvider) {
    $routeProvider.
        when('/welcome', {
            templateUrl: 'app/partials/Welcome-page.html'
        }).
        when('/tutoriel:id', {
            templateUrl: 'app/partials/Tutorial-page.html',
            controller: "reTutorialCtrl"
        }).
        when('/question:id', {
            templateUrl: 'app/partials/Question-page.html',
            controller: "reQuestionCtrl"
        }).
        when('/fin', {
            templateUrl: 'app/partials/fin.html',
            controller: "finCtrl"
        }).
        otherwise({
            redirectTo: '/welcome'
        });
});


//La directive reChronometre 
reApp.directive('reChronometre', function ($rootScope, QuizPersistenceSvc) {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: "app/partials/reChronometre-tmpl.html",

        link: function ($scope, $element) {
            //Variable de directive
            var passedTime = 0;
            var myTimer = null;            



            //private functions
            var startChrono = function () {
                passedTime = 0;
                $element.show();
                $scope.hh = parseInt(passedTime / 3600);
                $scope.mm = parseInt(passedTime / 60);
                $scope.ss = parseInt(passedTime % 60);
                myTimer = setInterval(function () {
                    passedTime++;
                    $scope.$apply(function () {
                        $scope.hh = parseInt(passedTime / 3600);
                        $scope.mm = parseInt(passedTime / 60);
                        $scope.ss = parseInt(passedTime % 60);
                        QuizPersistenceSvc.setduration(passedTime + "s");
                    });
                }, 1000);
            }

            var stopChrono = function() {
                hideMe();
                clearInterval(myTimer);
            }


            var hideMe = function () {
                $element.hide();
            };

            var initMe = function () {
                passedTime = 0;
            };

            $rootScope.$off('reChronometreStartChrono', 'startChrono');
            $rootScope.$off('reChronometreStopChrono', 'stopChrono');
            $rootScope.$off('reChronometreHide', 'hideMe');
            $rootScope.$off('reChronometreInit', 'initMe');

            //Events
            $rootScope.$on('reChronometreStartChrono', startChrono);

            $rootScope.$on('reChronometreStopChrono', stopChrono);

            $rootScope.$on('reChronometreHide', hideMe);

            $rootScope.$on('reChronometreInit', initMe);

            //onLoad
            hideMe();
            initMe();
        },
    }
});


//la directive reNavigation
reApp.directive('reNavigation', function ($location, $timeout, reConstants) {
    return {
        restrict: 'E',
        replace: false,
        template: '<a class="btn {{direction}}"" data-ng-click="navigate()">{{directionLabel}}</a>',
        scope: {},
        link: function ($scope, $element, $attr) {
            //Gestion les buttons de navigation selon l'indice courant du Tutoriel
            var currentTutoIndex = parseInt($location.$$path.replace("/tutoriel", ""));
            if ($attr.direction == "prec") {
                if (currentTutoIndex == 1)
                    $element.hide();
                else
                    $scope.directionLabel = "Précédent";
            }
            else if ($attr.direction == "suiv") {
                if (currentTutoIndex == reConstants.TUTO_PAGES_COUNT)
                    $scope.directionLabel = "Fin";
                else
                    $scope.directionLabel = "Suivant";
            }

            //Comportement lors de CLICK sur les buttons de navigation selon l'indice courant du Tutorial
            $scope.navigate = function () {
                var currentTutoIndex = parseInt($location.$$path.replace("/tutoriel", ""));
                var nextTutoIndex = 1;

                if ($attr.direction == "prec") {
                    nextTutoIndex = currentTutoIndex - 1;
                }
                else if ($attr.direction == "suiv") {
                    nextTutoIndex = currentTutoIndex + 1;
                }

                $timeout(function () {
                    $location.path("/tutoriel" + nextTutoIndex);
                });
            }
        }
    }
});



//Le service de Persistence QuizPersistenceSvc
reApp.service("QuizPersistenceSvc", function () {

    //Attributs : Le Model Quiz
    var Quiz = {
        startDate: null,
        endDate: null,
        duration: null,
        question1: null,
        question2: null
    }

    //Test Attribute
    var greetingMsg = "Hello";

    //Methods
	//Getters and Setters
    function _getQuiz() {
        return Quiz;
    }

    function _setQuiz(quiz) {
        this.Quiz = quiz;
    }

    function _setquestion1(q) {
        Quiz.question1 = q;
    }

    function _setquestion2(q) {
        Quiz.question2 = q;
    }

    function _setstartDate() {
        d = new Date();
        Quiz.startDate = d.toLocaleString();
    }

    function _setendDate() {
        d = new Date();
        Quiz.endDate = d.toLocaleString();
    }

    function _setduration(d) {
        Quiz.duration = d;
    }
	
	//Test
    function _testSvc(msg) {
        alert(msg + ": " + greetingMsg);
    }
	
	//Int to String avec une longueur bien determinee
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

	//Fonction de Persistence
    function _Persiste() {
        var path = require('path-extra');
        var write = require('write');
        var os = require("os");
        d = new Date;
        var date = d.getFullYear() + '-' + zeroPad(d.getMonth()+1, 2) + '-' + zeroPad(d.getUTCDate(), 2) + '-' + zeroPad(d.getHours(), 2) + zeroPad(d.getMinutes(), 2);
        var filepath = path.homedir() + '\\Documents\\REUSSITE\\AUTO\\REUSTEST-' + date + '-' + os.hostname() + '.json';
        try{
			write.sync(filepath, JSON.stringify(Quiz));
			alert('Fichier enregistré sous : '+path.homedir() + '\\Documents\\REUSSITE\\AUTO');
			}
		catch(err){	
			alert('Erreur d enregistrement');
					}
    }
	
	//Mapping des Fonction
    return {
        getQuiz: _getQuiz,
        setQuiz: _setQuiz,
        testSvc: _testSvc,
        setquestion1: _setquestion1,
        setquestion2: _setquestion2,
        setstartDate: _setstartDate,
        setendDate: _setendDate,
        setduration: _setduration,
        Persiste: _Persiste
    }
});

//Regler le probleme du broadcast lié aux Listeners
reApp.run(function ($rootScope) {
    // Eliminer les Listeners déjà insrits 
    $rootScope.$off = function (name, listener) {
        var namedListeners = this.$$listeners[name];
        if (namedListeners) {
            // Loop sur la liste des Listeners
            for (var i = 0; i < namedListeners.length; i++) {
                if (namedListeners[i] === listener) {
                    return namedListeners.splice(i, 1);
                }
            }
        }
    }
});