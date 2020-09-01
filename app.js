//import instanceOfGrid from 'gameOfLifeClass';
let X = new instanceOfGrid(50, 50);

play(X);

function play(obj, evolution = true) {
    let time;
    if (evolution) {
        obj.renderStep();
        time = setTimeout(play, 100, obj, evolution);
    } else {
        clearTimeout(time);
    }
}