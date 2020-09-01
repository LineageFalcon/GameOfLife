//import 'gameOfLifeClass';
//import 'formProcessing';

let userInput = new UserInput(50, 50);
let grid = new Grid(userInput); 
let form = new FormHandler(userInput, new Form(userInput));

play(grid, form);

function play(grid, form, evolution = true) {
    if (evolution) {
        form.renderStep(grid); //redering is done from form with params (grid)
        let time = setTimeout(play, 100, grid, form, evolution);
    } else {
        clearTimeout(time);
    }
}