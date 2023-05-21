"use strict";

const gameboard = (() => {
    let board = [
        null, null, null,
        null, null, null,
        null, null, null
    ];

    const changeBoard = (player, index) => {
        board[index] = player.getMarker();
    };

    const getBoard = () => {
        return board;
    };

    const reset = () => {
        board = [
            null, null, null,
            null, null, null,
            null, null, null
        ];
    };

    return { changeBoard, getBoard, reset };
})();

const Player = (name, marker) => {
    let score = 0;

    const getName = () => {
        return name;
    };

    const getMarker = () => {
        return marker;
    };

    const getScore = () => {
        return score;
    }

    const incrementScore = () => {
        score++;
    }

    const resetScore = () => {
        score = 0;
    }

    return { getName, getMarker, getScore, incrementScore, resetScore };
};

const gameController = (() => {
    const winningCombinations = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6],
    ];

    let currentPlayer = null;
    let winner = null;
    let tie = false;

    const changeTurn = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    };

    const initialize = () => {
        currentPlayer = playerOne;
    };

    const checkIfValidMove = (move) => {
        if (
            gameboard.getBoard()[move] === playerOne.getMarker() ||
            gameboard.getBoard()[move] === playerTwo.getMarker()
        ) {
            alert("Case déjà utilisée par un joueur !");
            return false;
        } else {
            return true;
        }
    };

    const checkGameWinner = () => {
        if (winner.getScore() >= 3) {
            alert(`${winner.getName()} est le grand vainqueur du jeu ! 🎊`)
        }
    }

    const checkWinner = () => {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;

            if (
                gameboard.getBoard()[a] !== null &&
                gameboard.getBoard()[a] === gameboard.getBoard()[b] &&
                gameboard.getBoard()[a] === gameboard.getBoard()[c]
            ) {
                winner = currentPlayer;
                alert(`${winner.getName()} a gagné ce round !`);
                winner.incrementScore();
                checkGameWinner();
            }
        }
    };

    const checkTie = () => {
        const isNotNull = (value) => value !== null;
        if (gameboard.getBoard().every(isNotNull)) {
            tie = true;
            alert("Égalité !");
        }
    };

    const makeMove = (index) => {
        gameboard.changeBoard(currentPlayer, index);
    };

    const playRound = (index) => {
        if (!winner &&
            !tie &&
            checkIfValidMove(index)) {
            makeMove(index);
            checkGameStatus();
            changeTurn();
            display.render();

            if (winner || tie) {
                display.displayResetBtn();
            }
        }
    }

    const checkGameStatus = () => {
        checkWinner();
        checkTie();
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    };

    const reset = () => {
        if (winner.getScore() >= 3) {
            playerOne.resetScore();
            playerTwo.resetScore();
        }

        winner = null;
        tie = false;
        gameboard.reset();
        display.render();
        display.displayResetBtn();
    };

    return { initialize, playRound, getCurrentPlayer, reset };
})();

const display = (() => {
    const [...cells] = document.querySelectorAll(".cell");
    const currentPlayerEl = document.querySelector("h2 span");
    const resetBtnEl = document.querySelector("button");;
    const playerOneNameEl = document.querySelector("#player-1-name");
    const playerTwoNameEl = document.querySelector("#player-2-name");
    const playerOneScoreEl = document.querySelector("#player-1-score");
    const playerTwoScoreEl = document.querySelector("#player-2-score");

    const displayResetBtn = () => {
        resetBtnEl.classList.toggle("hidden");
    };

    const handleClick = (clickedCell) => {
        gameController.playRound(clickedCell.dataset.index);
    };

    const render = () => {
        cells.forEach((cell) => {
            cell.textContent = gameboard.getBoard()[cell.dataset.index];
        });

        currentPlayerEl.textContent = `
        ${gameController.getCurrentPlayer().getName()} 
        (${gameController.getCurrentPlayer().getMarker()})`;

        playerOneNameEl.textContent = playerOne.getName();
        playerTwoNameEl.textContent = playerTwo.getName();

        playerOneScoreEl.textContent = playerOne.getScore();
        playerTwoScoreEl.textContent = playerTwo.getScore();
    };

    const initialize = () => {
        cells.forEach((cell) => {
            cell.addEventListener("click", (event) => {
                handleClick(event.target);
            });
        });

        resetBtnEl.addEventListener("click", () => {
            gameController.reset();
        });

        render();
    };

    return { render, initialize, displayResetBtn };
})();

const playerOne = Player("Lux", "X");
const playerTwo = Player("Computer", "O");
gameController.initialize();
display.initialize();
