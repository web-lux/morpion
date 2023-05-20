"use strict";

const gameboard = (() => {
    let board = [
        null, null, null,
        null, null, null,
        null, null, null
    ];

    const changeBoard = (player, index) => {
        board[index] = player.getMarker();
    }

    const getBoard = () => {
        return board
    }

    return { changeBoard, getBoard }
})();

const Player = (name, marker) => {
    const getName = () => {
        return name;
    };

    const getMarker = () => {
        return marker
    }

    return { getName, getMarker }
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
        [2, 4, 6]
    ];

    let currentPlayer = null;
    let winner = null;
    let tie = false;

    const changeTurn = () => {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    const initializeGame = () => {
        currentPlayer = playerOne;
        playGame();
    }

    const playGame = () => {
        while (winner === null && tie === false) {
            gameboard.changeBoard(currentPlayer, getMove());
            console.log(gameboard.getBoard());
            checkWinner();
            checkTie();
            changeTurn();
        }
    }

    const getMove = () => {
        let move = prompt("À quel index souhaitez vous apposer votre marque ?");
        if (checkIfValidMove(move)) {
            return move
        } else {
            getMove();
        }
    }

    const checkIfValidMove = (move) => {
        if (
            gameboard.getBoard()[move] === playerOne.getMarker() ||
            gameboard.getBoard()[move] === playerTwo.getMarker()
        ) {
            alert("Case déjà utilisée par un joueur ! Voir console.");
            console.warn(gameboard.getBoard());
            return false
        } else if (gameboard.getBoard()[move] === undefined) {
            alert("Merci d'entrer un index entre 0 et 8 !")
            return false
        } else {
            return true
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
                console.log(`Gagnant : ${winner.getName()}`)
            }

        }

    }

    const checkTie = () => {
        const isNotNull = (value) => value !== null;
        if (gameboard.getBoard().every(isNotNull)) {
            tie = true;
            alert("It's a tie !")
        }
    }

    return { initializeGame }

})();

const playerOne = Player("Lux", "X");
const playerTwo = Player("Computer", "O");
gameController.initializeGame();