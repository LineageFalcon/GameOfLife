//import instanceOfGrid from 'gameOfLifeClass';
let X = new instanceOfGrid(50, 50);

play(X);

function play(obj, evolution = true) {
    if (evolution) {
        obj.renderStep();
        let time = setTimeout(play, 100, obj, evolution);
    } else {
        clearTimeout(time);
    }
}