document.addEventListener('DOMContentLoaded', (event) => {
const initialTime = 75;
	let time = 75;
	let score = 0;
	let qCount = 0;
	let timeset;
	let answers = document.querySelectorAll('#quizHolder button');
    let recordsArray=[];

    let queryElement = (element) => {
		return document.querySelector(element);
    }
    //calling all elements
    let onlyDisplaySection = (element) => {
		let sections = document.querySelectorAll("section");
		Array.from(sections).forEach((userItem) => {
			userItem.classList.add('hide');
		});
		queryElement(element).classList.remove('hide');
	}
    //i need to use a function to hide and unhide elements

    let recordsHtmlReset = () => {
		queryElement('#highScores div').innerHTML = "";
		var i = 1;
		recordsArray.sort((a, b) => b.score - a.score);
		Array.from(recordsArray).forEach(check =>
		{
			var scores = document.createElement("div");
			scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
			queryElement('#highScores div').appendChild(scores);
			i = i + 1
		});
		i = 0;
		Array.from(answers).forEach(answer => {
			answer.classList.remove('disable');
		});
	}
    //resets display for score
    let setQuestionData = () => {
		queryElement('#quizHolder p').innerHTML = questions[qCount].title;
		queryElement('#quizHolder button:nth-of-type(1)').innerHTML = `1. ${questions[qCount].choices[0]}`;
		queryElement('#quizHolder button:nth-of-type(2)').innerHTML = `2. ${questions[qCount].choices[1]}`;
		queryElement('#quizHolder button:nth-of-type(3)').innerHTML = `3. ${questions[qCount].choices[2]}`;
		queryElement('#quizHolder button:nth-of-type(4)').innerHTML = `4. ${questions[qCount].choices[3]}`;
	}
    //makes questions appear

    let quizUpdate = (answerCopy) => {
		queryElement('#scoreIndicator p').innerHTML = answerCopy;
		queryElement('#scoreIndicator').classList.remove('invisible', scoreIndicator());
		Array.from(answers).forEach(answer =>
		{
			answer.classList.add('disable');
		});

		setTimeout(() => {
			if (qCount === questions.length) {
				onlyDisplaySection("#finish");
				time = 0;
				queryElement('#time').innerHTML = time;
			} else {
				// Updates copy in questions with the net array's question text.
				setQuestionData();
				// Removed disabled status.
				Array.from(answers).forEach(answer => {
					answer.classList.remove('disable');
				});
			}
		}, 1000);
	}
    //function to change question, see if its right or wrong, and if all
    //questions are answered the quiz exits

    let myTimer = () => {
		if (time > 0) {
			time = time - 1;
			queryElement('#time').innerHTML = time;
		} else {
			clearInterval(clock);
			queryElement('#score').innerHTML = score;
			onlyDisplaySection("#finish");
		}
	}
    //timer

    let clock;
	queryElement("#intro button").addEventListener("click", (e) => {
		setQuestionData();
		onlyDisplaySection("#quizHolder");
		clock = setInterval(myTimer, 1000);
	});
    //on click the quiz starts and timer starts

    let scoreIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
		    queryElement('#scoreIndicator').classList.add('invisible');
		}, 1000);
	}
    //quiz in progress.....

    Array.from(answers).forEach(check => {
		check.addEventListener('click', function (event) {
			if (this.innerHTML.substring(3, this.length) === questions[qCount].answer) {
				score = score + 1;
				qCount = qCount + 1;
				quizUpdate("Correct");
			}else{
				time = time - 10;
				qCount = qCount + 1;
				quizUpdate("Wrong");
			}
		});
	});
    //if questions are answered correctly or not

    queryElement("#records button").addEventListener("click", () => {
		let initialsRecord = queryElement('#initials').value;
		if (initialsRecord === ''){
			queryElement('#errorIndicator p').innerHTML = "You need at least 1 character";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
			queryElement('#errorIndicator p').innerHTML = "Only letters for initials allowed.";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.length > 5) {
			queryElement('#errorIndicator p').innerHTML = "Maximum of 5 characters allowed.";
			queryElement('#errorIndicator').classList.remove('invisible', errorIndicator());
		} else {
			recordsArray.push({
				"initialRecord": initialsRecord,
				"score": score
			});
			localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
			queryElement('#highScores div').innerHTML = '';
			onlyDisplaySection("#highScores");
			recordsHtmlReset();
			queryElement("#initials").value = '';
		}
	});
    //loops user input to make sure its letters, pushes it to array and saves it locally

    queryElement("#clearScores").addEventListener("click", () => {
		recordsArray = [];
		queryElement('#highScores div').innerHTML = "";
		localStorage.removeItem('recordsArray');
	});

//clears scores

queryElement("#reset").addEventListener("click", () => {
    time = initialTime;
    score = 0;
    qCount = 0;
    onlyDisplaySection("#intro");
});
//resets quiz
queryElement("#scores").addEventListener("click", (e) => {
    e.preventDefault();
    clearInterval(clock);
    queryElement('#time').innerHTML = 0;
    time = initialTime;
    score = 0;
    qCount = 0;
    onlyDisplaySection("#highScores");
    recordsHtmlReset();
});
//if user clicks high scores then it exits quiz and takes user there
});