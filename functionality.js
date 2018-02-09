let view = {
    displayMessage : function(msg){
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit : function(location){
        let cell = document.getElementById(location);
        cell.setAttribute('class','hit');
    },
    displayMiss : function(location){
        let cell = document.getElementById(location);
        cell.setAttribute('class','miss');
    }
};
// 		--test code--
// view.displayMiss('00');
// view.displayHit('34');
// view.displayMessage("check itt");

let model = {
    boardSize : 7,
    numShips : 3,
    shipLength : 3,
    shipsSunk : 0,

    generateShipLocations : function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {        //generate new set of locations for each ship        
                locations = this.generateShip();
            } while (this.collision(locations));// check to see if new locations of ships overlap with existing
            this.ships[i].locations = locations;// assign viable locations to ships array at locations property
        }
    },

    generateShip : function() {
        let direction = Math.floor(Math.random() * 2);//number between 0 & 2, not including 2
        let row, col;

        if (direction === 1) { // if its 1, ship will be horizontal direction

            row = Math.floor(Math.random() * this.boardSize);// generate ship starting location
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

        } else { // if its 0, ship will be vertical direction
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

    let newShipLocations = []; //empty array, locations will be added 
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) { 
                //(col + i)make sure i is added to col before converting to string 
                newShipLocations.push(row + '' + (col + i));//push string to array

            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },

    collision : function(locations) {
        for (let i = 0; i < this.numShips; i++) { //for each ship already on the board
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) { 
                if (ship.locations.indexOf(locations[j]) >= 0) { //check to see if the location is already occupied
                    return true; //returning from loop inside loop stops iteration of both loops and fuction-returns true
                } 
            }
        }
        return false; //returns false if no match found - no collision
        
    },
    
    //--test code--
    // ships : [ 
    //     {locations : ["06","16","26"], hits : ["","",""] },	
    //     {locations : ["24","34","44"], hits : ["","",""] },
    //     {locations : ["10","11","12"], hits : ["","",""] }
    //     ],

    ships : [
        {locations : ["0","0","0"], hits : ["","",""] }, 
        {locations : ["0","0","0"], hits : ["","",""] },
        {locations : ["0","0","0"], hits : ["","",""] }
        ],       

    fire : function(guess) {
        for (let i=0; i < this.numShips; i++){
                let ship = this.ships[i];
                // let locations = ship.locations;
                let index = ship.locations.indexOf(guess); //if guess is in the locations array itz a hit
                if (index >= 0) {
                ship.hits[index] = "hit"; //mark index of hits array as a hit
                view.displayHit(guess); //notify view of hit at that location
                view.displayMessage('HiT!'); //display message from view
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship');
                    this.shipsSunk++;
                }
                return true; // return true for a hit
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed');
        return false;// Otherwize return a false/'miss'
    },

    //take ship and check every possible location for a hit
    isSunk : function(ship)	{
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false; //if therez a location that doeszn't have a hit - ship iz still floating
            }
        }
        return true;
    }
}; //end model object
// --testcode
// model.fire("53");
// model.fire("06");
// model.fire("16");
// model.fire("26");
// model.fire("34");
// model.fire("24");
// model.fire("44");
// model.fire("12");
// model.fire("11");
// model.fire("10");
let controller = {
    guesses : 0,
    processGuess : function(guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all of my battleships, in '+ this.guesses +' guesses');
            }
        }
    }
}

//check validty of guess - length and type of input
function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        alert('Oopz, Please enter a letter and a number');
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar); // change inputted letter to number
        let column = guess.charAt(1); //grab 2nd char in string representing the column

        if (isNaN(row) || isNaN(column)) { //check if row or column is NAN
            alert('Oopz, that iznt on the board');
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
            alert('Oopz, thatz off the board');
        } else {
            return row + column;
        }
    }
    return null;
}
//  --testcode
// console.log(parseGuess("A0"));
// console.log(parseGuess("B6"));
// console.log(parseGuess("G3"));
// console.log(parseGuess("H0"));
// console.log(parseGuess("A7"));

// controller.processGuess("A0");
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");
// controller.processGuess("B0");
// controller.processGuess("B1");
// controller.processGuess("B2");
window.onload = init;

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress; // handler for press event of HTML input field

    model.generateShipLocations();
}

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) { // sets keycode property to 13 when RETURN is pressed on keyboard
        fireButton.click(); // and invokes fireButton click method
        return false;//return false to avoid form taking any further action
    }
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = '';
}

    
