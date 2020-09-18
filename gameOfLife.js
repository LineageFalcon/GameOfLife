/* document.addEventListener("DOMContentLoaded", function(event) {
    let formBinding = new guiRender();
    let runtime = new integrationFunction(d);
}); 
//shall work as a dom ready function to call all other stuff when needed

*/
class controller {
    constructor() {		
		this.areaSize = height * width;//used in for-loops
    }

    static renderStep() { //integration class or stays in logic
        let divArray = this.getDivs();
        let gridArray = this.createArray(this.height, this.width);
        gridArray = this.mapDivs(divArray, gridArray);

        let onlyChangesArray = [];
        for(let i = 0; i < this.height; i++) 
        {
            for(let k = 0; k < this.width; k++)
            {
                let count = this.calcNeighbours(i, k, gridArray);
                if(undefined !== this.applyRules(i, k, count, gridArray[i][k]))// not efficient
                    onlyChangesArray.push(this.applyRules(i, k, count, gridArray[i][k]));
            }
        }
        //method for logic to get new array for the new grid --> maybe this can replace the acutal if closure
        this.setDivs(onlyChangesArray, divArray);
    }

    static checkEvolution(ITERATIONS, runtime) {
        if (runtime < ITERATIONS || ITERATIONS == -1) {
            return true
        }
        else {
            return false;
        }
    }

    static play(obj, ANIMATION_SPEED = 100, ITERATIONS = true, runtime = 0) {
        let time; //make sure all vars are declared in the needed scope -> {}
        if (checkEvolution(ITERATIONS, runtime)) {
            obj.renderStep(); //rendering is done from form with params (grid)
            runtime++;
            time = setTimeout(controller.play, ANIMATION_SPEED, obj, ANIMATION_SPEED, ITERATIONS, runtime); //maybe use requestAnimationFrame
        } else {
            clearTimeout(time);
        }
    }
}

class logicRender {
    constructor(guiRender) {
        this.gui = guiRender;
    }

    setDivs(onlyChangesArray, divArray) { //logic --> instanceOfLife class
        onlyChangesArray.forEach(elem => this.applyChanges(elem, divArray));
    }

    copyGrid() { //logic --> instanceOfLife class
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                this.gridArray[i][k] = this.renderGridArray[i][k];
            }
        }
        return this;
    }

    applyRules(i, k, count, gridArrayCell) { //logic --> instanceOfLife class

        //DO MATH
        let uiIndex = ((this.width)*i)+k;

        if(count < 2 || count > 3 && gridArrayCell == 1) 
            return {gridArrayCell: 0, index: uiIndex};
        else if(count == 3 && gridArrayCell == 0) 
            return {gridArrayCell: 1, index: uiIndex};  
    }

    calcNeighbours(i, k, gridArray) { //logic --> instanceOfLife class
        let count = 0;
        if(i - 1 >= 0) {
            if(gridArray[i - 1][k] == 1) {count++;}
        }
        if(i + 1 < this.height) {
            if(gridArray[i + 1][k] == 1) {count++;}
        }
        if(k - 1 >= 0) {
            if(gridArray[i][k - 1] == 1) {count++;}
        }
        if(k + 1 < this.width) {
            if(gridArray[i][k + 1] == 1) {count++;}
        }
        if(i - 1 >= 0 && k - 1 >= 0) {
            if(gridArray[i - 1][k - 1]) {count++;}
        }
        if(i - 1 >= 0 && k + 1 < this.width) {
            if(gridArray[i - 1][k + 1]) {count++;}
        }
        if(i + 1 < this.height && k + 1 < this.width) {
            if(gridArray[i + 1][k + 1]) {count++;}
        }
        if(i + 1 < this.height && k - 1 >= 0) {
            if(gridArray[i + 1][k - 1]) {count++;}
        }
        return count;
    }

    mapDivs(divArray, gridArray) { //logic --> instanceOfLife class or DOM access --> DOM class
        let index = 0;
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                if(divArray[index].getAttribute('class') == 'alive'){
                    gridArray[i][k] = 1;
                } else {
                    gridArray[i][k] = 0;
                }
                index++;
            }
        }
        return gridArray;
    }

    createArray(height, width) { //logic --> instanceOfLife class
        let gridArray = [];
        for(let i = 0; i < height; i++) {
            for(let k = 0; k < width; k++) {
                gridArray[i] = [];
            }
        }
        return gridArray;
    }

    getDivs() { //logic --> instanceOfLife class or DOM access --> DOM class
        let uIDivs = [];
        for(let i = 0; i < (this.areaSize); i++) {
            uIDivs[i] = this.wrapper.getElementsByTagName('div')[i];
        }
        return uIDivs;
    }
}

class guiRender {
    constructor() {
        this.height = document.getElementById('height').value;// could be getters from a binded class obj
        this.width = document.getElementById('width').value;
        this.iterations = document.getElementById('iterations').value;
        this.animationSpeed = getOptionsValue('evoSpeed');
        this.wrapper = document.createElement('section');

        this.createGrid();
        
        document.getElementById('start').addEventListener('click', function() {
                this.setValues();
                controller.play();
            });
    }

    setValues() {
        this.height = document.getElementById('height').value;// could be getters from a binded class obj
        this.width = document.getElementById('width').value;
        this.iterations = document.getElementById('iterations').value;
        this.animationSpeed = getOptionsValue('evoSpeed');
    }

    createGrid() { //DOM access --> DOM class
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(this.wrapper);
        this.wrapper.setAttribute('class', 'grid');
        this.wrapper.style.gridTemplateColumns = 'repeat(' + this.width+ ', auto)';
        this.wrapper.style.gridTemplateRows = 'repeat(' + this.height + ', auto)';
            for(let i = 0; i < this.areaSize; i++) {
                let div = document.createElement('div');
                let ran = Math.round(Math.random());
                if (ran == 1) {
                    this.wrapper.appendChild(div).setAttribute('class', 'alive');
                }
                else {
                    this.wrapper.appendChild(div).setAttribute('class', 'dead');
                }
            }
        }

        getOptionsValue(htmlElement) {
            let value;
            const ELEM = document.getElementById(htmlElement);
            for (let i = 0; i < ELEM.options.length; i++ ) {
                value = ELEM.options[i];
                if ( value.selected === true ) {
                    break;
                }
            }
            return value.text;
        }

    applyChanges(elem, divArray) { //DOM access --> DOM class
        if(elem.gridArrayCell == 1) {
            divArray[elem.index].setAttribute('class', 'alive');
        } 
        else {
            divArray[elem.index].setAttribute('class', 'dead');
        }
    }
}