const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// declare variables
let grid = " "
let gridArr = []
let gameOngoing = false
let bombGen = false
let count = 0

const unrevealed = 0
const clear = "'"
const bomb = "b"
const flagged = "F"
const flaggedBomb = "FB"


// startGame(x, y) - creates a 2 dimentional array with x number of subarrays and y number of elements in each subarray
// -> prints the initial grid string on the first call
function startGame(x, y) {
    gridArr = []
    console.clear()
        // loop x amount of times (the columns ||)
        for(let i = 0; i < y; i++) {
            gridArr.push([]);

            // for each of those subarrays, push(0) x amount of times (the rows =)
            for(let j = 0; j < x; j++) {
            gridArr[i].push(0);
        }  
    }

    // -> prints the initial grid string on the first call
    console.log("-------NEW-------BOARD-------STATE------- ")
    // adding the column numbers to the grid string
    // NOTE - FAULTY (works fine for 3x3 purposes so not a priority to fix)
    for(let i = 0; i < gridArr.length; i++) {
        grid += "  " + (i + 1)
    }
    // breaks each line and adds the row numbers to the grid string
    for(let i = 0; i < gridArr.length; i++) {
        if(grid != "") {
            grid += "\n"
        }
        grid += i + 1 + ":"	
        // add the visual representation of each element in each subarray to the grid string
        for(let j = 0; j < gridArr[i].length; j++) {
            grid += " ☐ "
        }
    }

    // print the grid string and call getCoordinates()
    console.log(grid)
    getCoordinates()
}


// getCoordinates() - asks the user for input and updates the gridArr accordingly
// -> edits gridArr and calls gridUpdate()
function getCoordinates() {
    // debugging
    //console.log("gridArr before user input: ", gridArr);

    // REVIEW - ask user for input - flag / reveal, x coordinate, y coordinate
    rl.question('Flag or reveal: F/R: ', (flag) => {
        rl.question('Enter x coordinate: ', (coordX) => {
            rl.question('Enter y coordinate: ', (coordY) => {
                // check if user input is within range
                if (coordX < 1 || coordX > gridArr.length || coordY < 1 || coordY > gridArr[0].length) {
                    console.log("Invalid coordinate. Please enter a value between 1 and " + gridArr[0].length + " for x and y.");
                    getCoordinates();

                // if user input is valid, update gridArr accordingly
                } else {

                    // logic for flagging 
                    if (flag === "F" || flag === "f") {
                        if(gridArr[coordY - 1][coordX - 1] === flagged) {
                            gridArr[coordY - 1][coordX - 1] = unrevealed;
                        } else if(gridArr[coordY - 1][coordX - 1] === bomb) {
                            gridArr[coordY - 1][coordX - 1] = flaggedBomb;
                        } else if(gridArr[coordY - 1][coordX - 1] === flaggedBomb) {
                            gridArr[coordY - 1][coordX - 1] = bomb;
                        } else if(gridArr[coordY - 1][coordX - 1] === clear) {
                            getCoordinates();
                        } else {
                        gridArr[coordY - 1][coordX - 1] = flagged;
                        }
                        gridUpdate();

                    // logic for revealing
                    } else if (flag === "R" || flag === "r") {
                        // game over condition 
                        if (gridArr[coordY - 1][coordX - 1] === bomb) {
                            console.log("You have selected a bomb. Game over.");
                            process.exit();
                        } if (gridArr[coordY - 1][coordX - 1] === flaggedBomb || gridArr[coordY - 1][coordX - 1] === flagged) {
                            console.log("Cannot reveal a flagged cell");
                            getCoordinates()
                        } 
                        else {
                            // invoke bombGeneration() if the user has selected a cell for the first time
                            gridArr[coordY - 1][coordX - 1] = clear;
                            if (!gameOngoing) {
                                gameOngoing = true;
                                bombGeneration();
                            }
                            gridUpdate();
                        }
                    // show error message if user input is invalid
                    } else {
                        console.log("Invalid input. Please enter F or R.");
                        getCoordinates();
                    }
                }
            });
        });
    });
}


// bombGeneration() -> randomally generate two bombs within gridArr
function bombGeneration() {
    let safeLocations = []

    // find all possible locations where the user has not selected and where there is not already a bomb
    for(let i = 0; i < gridArr.length; i++) {
        for(let j = 0; j < gridArr[i].length; j++) { 
            if (gridArr[i][j] === unrevealed || gridArr[i][j] !== bomb) {
                // push those locations to the safeLocations array
                safeLocations.push([i, j])
            }
        }
    }
    // debugging
    //console.log("safeLocations: ", safeLocations)

    // randomly generate a bomb within the safeLocations array
    let loc = safeLocations[Math.floor(Math.random() * safeLocations.length)] 
    gridArr[loc[0]][loc[1]] = bomb

    // run the function again to generate a second bomb
    if (!bombGen) {
        bombGen = true;
        bombGeneration();
    }
    // invoke gridUpdate() to update the gridArr with the newly generated bombs
    calculateNumbers()
}


// gridUpdate() - updates and prints the grid string in relation to gridArr board state
function gridUpdate() {
    let win = true;
    let run = false;
    //let flaggedBombsRemaining = false;
    console.clear();
    let grid = "   "; // Initial spacing for column numbers
    //console.log("-------NEW-------BOARD-------STATE------- ");
    //console.log(gridArr);

    for(let i = 0; i < gridArr.length; i++) {
        for(let j = 0; j < gridArr[i].length; j++) {
            if(gridArr[i][j] === bomb || gridArr[i][j] === unrevealed) {
                win = false;
            }
        }
    }

    run = true;

    if(win ===  true) {
        console.log("You have won the game!")
        process.exit()
    }



    // Adding the column numbers to the grid string
        for (let i = 0; i < gridArr.length; i++) {
        grid += "" + (i + 1) + "  " // Spacing between column numbers
    }

    // Breaks each line and adds the row numbers to the grid string
    for (let i = 0; i < gridArr.length; i++) {
        grid += "\n";
        grid += (i + 1) + ":" + " "; // Adding the row number with double tab spacing

        // Adding the visual representation of each element in each subarray to the grid string
        for (let j = 0; j < gridArr[i].length; j++) {
        if (gridArr[i][j] === clear) {
            grid += "   "; 
        } else if (gridArr[i][j] === flagged || gridArr[i][j] === flaggedBomb) {
            grid += "⚑  "; 
        } else if (gridArr[i][j] === unrevealed || gridArr[i][j] === bomb) {
            grid += "☐  "; 
        } else {
            // count variable displays the number of bombs adjacent to each cell
            grid += gridArr[i][j] + "  "; 
        }
        }
    }
    // print the grid string and call getCoordinates()
    console.log(grid)
    //console.log("gridArr before user input: ", gridArr)
    getCoordinates()
}


// TODO - WORK ON THIS
// calculateNumbers() - calculates the number of bombs surrounding each cell and updates gridArr accordingly
function calculateNumbers() {
    for (let i = 0; i < gridArr.length; i++) {
      for (let j = 0; j < gridArr[i].length; j++) {
        if (gridArr[i][j] === bomb) {
          continue;
        } else {
          count = 0;
  
          // Check the surrounding cells for bombs
          for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, gridArr.length - 1); x++) {
            for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, gridArr[i].length - 1); y++) {
              if (gridArr[x][y] === bomb) {
                count++;
              }
            }
          }
  
          gridArr[i][j] = count;
        }
      }
    }
  
    gridUpdate();
  }
  


// call startGame() to begin the game
startGame(5, 5)