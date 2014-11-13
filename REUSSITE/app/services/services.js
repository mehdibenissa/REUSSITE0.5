reApp.service("reQuestionSvc", function () {

    var Questions = [
        { index: 1 , title: "Question 1" },
        { index: 2 , title: "Question 2" }
    ];

    var getQuestion = function () {
        return Questions;
    }

    return {
        getQuestion: getQuestion
    }
});