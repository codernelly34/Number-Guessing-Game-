document.addEventListener("DOMContentLoaded", () => {
    const gameDisplay = document.getElementById("gameDisplay");
    const playButton = document.getElementById("playGame");
    const scoresUi = document.getElementById("scores");
    const S = document.querySelector(".S");
    const playTimesUi = document.querySelector(".playTimes");
    const cgt = document.querySelector(".cgt");
    const wgt = document.querySelector(".wgt");

    let randomNumber = 0;
    let Scores;
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Function to start the Game
    function initGame() {
        if (!JSON.parse(localStorage.getItem("Scores")))
            localStorage.setItem("Scores", JSON.stringify(0));
        scoresUi.textContent = `${JSON.parse(localStorage.getItem("Scores"))}`;
        S.textContent = `${JSON.parse(localStorage.getItem("Scores"))}`;

        if (!JSON.parse(localStorage.getItem("numberOfPlay")))
            localStorage.setItem("numberOfPlay", JSON.stringify(0));
        playTimesUi.textContent = `${JSON.parse(
            localStorage.getItem("numberOfPlay")
        )}`;

        if (!JSON.parse(localStorage.getItem("numberOfCorrectGues")))
            localStorage.setItem("numberOfCorrectGues", JSON.stringify(0));
        cgt.textContent = `${JSON.parse(
            localStorage.getItem("numberOfCorrectGues")
        )}`;

        if (!JSON.parse(localStorage.getItem("numberOfWrongGues")))
            localStorage.setItem("numberOfWrongGues", JSON.stringify(0));
        wgt.textContent = `${JSON.parse(
            localStorage.getItem("numberOfWrongGues")
        )}`;
        Scores = JSON.parse(localStorage.getItem("Scores"));
    }
    initGame();

    // Function to shuffle numbers
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to generate buttons with shuffled numbers
    function generateButtons() {
        shuffleArray(numbers);

        gameDisplay.innerHTML = `<p class='gameIntroction'>Loading... Loading...</p>`;
        const gameBtn = document.createElement("div");
        gameBtn.className = "gameBtn";

        setTimeout(function () {
            gameDisplay.innerHTML = `<p class='gameIntroction2'>Gues the correct
            Number</p>`;

            numbers.forEach(number => {
                const button = document.createElement("button");
                button.className = "option";
                button.type = "button";
                button.textContent = `${number}`;
                button.onclick = () => checkGuess(number);

                gameBtn.appendChild(button);
            });
            gameDisplay.appendChild(gameBtn);
        }, 1000);
    }

    // Function to check user's guess
    function checkGuess(guess) {
        playTimes();
        if (guess === randomNumber) {
            addSound("./sounds/btnSucces.mp3");
            setTimeout(function () {
                gameDisplay.innerHTML = `<p class='success'>
                    🎉 Congratulations! You guessed it right. The number was
                    ${randomNumber}. You earned 5 points!. Well done! Click the
                    "Play" button to start a new round.
                </p>`;
                Scores += 5;
                localStorage.setItem("Scores", JSON.stringify(Scores));
                S.textContent = `${Scores}`;
                scoresUi.textContent = `${Scores}`;
                correctGuesTimes();
            }, 150);
        } else {
            addSound("./sounds/btnFail.mp3", 0.6);
            setTimeout(() => {
                gameDisplay.innerHTML = `<p class='faild'>
               ❌ Oops! Wrong guess. The number was ${randomNumber}. 
               Click the "Play" button to try again.
              </p>`;
                wrongGuesTimes();
            }, 150);
        }
    }

    // Function to start the game
    function startGame() {
        randomNumber = Math.floor(Math.random() * numbers.length) + 1;
        generateButtons();
    }

    // Attach event listener to the Play button
    playButton.addEventListener("click", startGame);

    function playTimes() {
        let numberOfPlay = JSON.parse(localStorage.getItem("numberOfPlay"));
        numberOfPlay += 1;
        localStorage.setItem("numberOfPlay", JSON.stringify(numberOfPlay));
        playTimesUi.textContent = `${numberOfPlay}`;
    }

    function correctGuesTimes() {
        let numberOfCorrectGues = JSON.parse(
            localStorage.getItem("numberOfCorrectGues")
        );
        numberOfCorrectGues += 1;
        localStorage.setItem(
            "numberOfCorrectGues",
            JSON.stringify(numberOfCorrectGues)
        );
        cgt.textContent = `${numberOfCorrectGues}`;
    }

    function wrongGuesTimes() {
        let numberOfWrongGues = JSON.parse(
            localStorage.getItem("numberOfWrongGues")
        );
        numberOfWrongGues += 1;
        localStorage.setItem(
            "numberOfWrongGues",
            JSON.stringify(numberOfWrongGues)
        );
        wgt.textContent = `${numberOfWrongGues}`;
    }
    document.querySelector(".resetBtn").addEventListener("click", () => {
        setTimeout(function () {
            localStorage.setItem("Scores", JSON.stringify(0));
            localStorage.setItem("numberOfPlay", JSON.stringify(0));
            localStorage.setItem("numberOfCorrectGues", JSON.stringify(0));
            localStorage.setItem("numberOfWrongGues", JSON.stringify(0));
            gameDisplay.innerHTML = `<div class="gameIntroction">
                    <p>
                        Click the Play button belowe to start playing the game
                    </p>
                    <br/>
                    <br/>
                    <p>
                        Click the Arrow button belowe to get help on how to play
                        the game
                    </p>
                </div>`;
            initGame();
            togolManu();
        }, 300);
    });
});
