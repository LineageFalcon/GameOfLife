let userInput = new UserInput(50, 50);
let grid = new Grid(userInput); 
let form = new Interface(userInput, new Form(userInput));
let time;

play(grid, form);

function play(grid, form, evolution = true) {
    if (evolution) {
        form.renderStep(grid); //redering is done from form with params (grid)
        time = setTimeout(play, 100, grid, form, evolution);
    } else {
        clearTimeout(time);
    }
}