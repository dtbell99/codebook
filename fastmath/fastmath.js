
var signs = ["+", "-", "x"]
var number1 = 0;
var number2 = 0;
var type = "";
var correct = 0;
var wrong = 0;
var correctAnswer = 0;
var gameRunning = false;

var largeNumberOnTop = true;

var seconds;

function locker(shouldLock) {
    document.getElementById('guess').disabled = shouldLock;
    document.getElementById('guessButton').disabled = shouldLock;
}

function startTimer() {
    gameRunning = true;
    if (!document.getElementById('name').value) {
        alert("Please enter your name");
        return;
    }
    setProblem();
    correct = 0;
    wrong = 0;
    seconds = 60;
    updateResultsView();
    locker(false);

    document.getElementById('guess').focus();
    var t = setInterval(function () {
        document.getElementById('timer').innerHTML = seconds-- + 's remaining';
        if (seconds < 0) {
            gameRunning = false;
            clearInterval(t);
            locker(true);
            document.getElementById('timerButton').innerHTML = 'Start Timer'
            var scores = [];
            if (localStorage.getItem('scores')) {
                scores = JSON.parse(localStorage.getItem('scores'));
            }
            var name = document.getElementById('name').value;
            scores.push({ 'name': name, 'correct': correct, 'wrong': wrong });
            localStorage.setItem('scores', JSON.stringify(scores));
            updateScores();
        }
    }, 1000);
    document.getElementById('timerButton').innerHTML = 'Restart Game';
}

function setProblem() {

    number1 = Math.floor(Math.random() * 9) + 1;
    number2 = Math.floor(Math.random() * 9) + 1;

    var n1 = number1;
    var n2 = number2;
    if (largeNumberOnTop && n2 > n1) {
        n1 = number2;
        n2 = number1;
    }

    type = signs[Math.floor(Math.random() * signs.length)];

    if (type === '+') {
        correctAnswer = n1 + n2;
    } else if (type === '-') {
        correctAnswer = n1 - n2;
    } else if (type === 'x') {
        correctAnswer = n1 * n2;
    }

    document.getElementById("question").innerHTML = n1 + "<br/> " + type + " " + n2 + "<br/><hr/>";

}

function updateResultsView() {
    document.getElementById('correct').innerHTML = correct + " Correct";
    document.getElementById('wrong').innerHTML = wrong + " Wrong";
}

function keyupGuess() {
    var yourGuess = document.getElementById('guess').value;
    if (yourGuess == correctAnswer) {
        makeGuess();
    }
}

function makeGuess() {
    if (!gameRunning) {
        return;
    }
    var yourGuess = document.getElementById('guess').value;
    if (!yourGuess) { return; }
    if (yourGuess == correctAnswer) {
        correct++;
    } else {
        wrong++;
    }
    updateResultsView();
    document.getElementById('guess').value = '';
    document.getElementById('guess').focus();
    setProblem();
}

function updateScores() {
    var scores = [];
    if (localStorage.getItem('scores')) {
        scores = JSON.parse(localStorage.getItem('scores'));
    }
    scores.sort(function (a, b) {
        if (a.correct > b.correct) {
            return -1;
        } else if (a.correct < b.correct) {
            return 1;
        }
        return 0;
    });
    var rslt = "<ol>";
    scores.forEach(score => {
        rslt = rslt + "<li>" + score.name + "  :  " + score.correct + "</li>";
    });
    rslt = rslt + "</ol>";

    document.getElementById('scores').innerHTML = rslt;
}


document.getElementById('guess').addEventListener("keyup", function (event) {
    // keyCode 13 is enter key
    if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        makeGuess();
    } else {
        keyupGuess();
    }

});
document.getElementById('name').focus();
locker(true);
updateScores();