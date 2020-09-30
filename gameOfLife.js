document.addEventListener("DOMContentLoaded", function(event) {
    let modelInstance = new logicRender();
    let viewInstance = new guiRender(modelInstance);
    let controllerInstance = new controller();


    controller.setView(viewInstance);
    controller.setModel(modelInstance);
}); 
//shall work as a dom ready function to call all other stuff when needed

class controller {
    constructor(model, view) {
        //this._instances = [];
        this._modelInstance;
        this._viewInstance;

        document.getElementById('start').addEventListener('click', function() {
            //const CURRENT_INSTANCE = controller.viewInstance;
            //viewInstance.setValues();
            //logicRender.setInstance(CURRENT_INSTANCE);
            controller.play(controller._viewInstance.animationSpeed, controller._viewInstance.iterations);
        });
    }

    static setInstance(newInstance) {
        this._instances = newInstance;
    }

    static setView(view) {
        this._viewInstance = view;
    }

    static setModel(model) {
        this._modelInstance = model;
    }

    static getInstance() {
        return this._instances;
    }

    static checkEvolution(ITERATIONS, runtime) {
        if (runtime < ITERATIONS || ITERATIONS == -1) {
            return true
        }
        else {
            return false;
        }
    }

    static play(ANIMATION_SPEED = 100, ITERATIONS = true, runtime = 0) {
        let time; //make sure all vars are declared in the needed scope -> {}
        if (checkEvolution(ITERATIONS, runtime)) {
            logicRender.renderStep(); //rendering is done from form with params (grid)
            runtime++;
            time = setTimeout(controller.play, ANIMATION_SPEED, ANIMATION_SPEED, ITERATIONS, runtime); //maybe use requestAnimationFrame
        } else {
            clearTimeout(time);
        }
    }
}

class logicRender {
    constructor() {}

    static renderStep() { //integration class or stays in logic
        let divArray = logicRender.getDivs();
        let gridArray = logicRender.createArray(controller._viewInstance.height, controller._viewInstance.width);
        gridArray = logicRender.mapDivs(divArray, gridArray);

        let onlyChangesArray = [];
        for(let i = 0; i < controller._viewInstance.height; i++) 
        {
            for(let k = 0; k < controller._viewInstance.width; k++)
            {
                let count = logicRender.calcNeighbours(i, k, gridArray);
                if(undefined !== logicRender.applyRules(i, k, count, gridArray[i][k]))// not efficient
                    onlyChangesArray.push(logicRender.applyRules(i, k, count, gridArray[i][k]));
            }
        }
        //method for logic to get new array for the new grid --> maybe this can replace the acutal if closure
        logicRender.setDivs(onlyChangesArray, divArray);
    }

    static setDivs(onlyChangesArray, divArray) { //logic --> instanceOfLife class
        onlyChangesArray.forEach(elem => logicRender.applyChanges(elem, divArray));
    }

    static copyGrid() { //logic --> instanceOfLife class
        for(let i = 0; i < this._instance.height; i++) {
            for(let k = 0; k < this._instance.width; k++) {
                logicRender.gridArray[i][k] = logicRender.renderGridArray[i][k];
            }
        }
        return this;
    }

    static applyRules(i, k, count, gridArrayCell) { //logic --> instanceOfLife class

        //DO MATH
        let uiIndex = ((this._instance.width)*i)+k;

        if(count < 2 || count > 3 && gridArrayCell == 1) 
            return {gridArrayCell: 0, index: uiIndex};
        else if(count == 3 && gridArrayCell == 0) 
            return {gridArrayCell: 1, index: uiIndex};  
    }

    static calcNeighbours(i, k, gridArray) { //logic --> instanceOfLife class
        let count = 0;
        if(i - 1 >= 0) {
            if(gridArray[i - 1][k] == 1) {count++;}
        }
        if(i + 1 < this._instance.height) {
            if(gridArray[i + 1][k] == 1) {count++;}
        }
        if(k - 1 >= 0) {
            if(gridArray[i][k - 1] == 1) {count++;}
        }
        if(k + 1 < this._instance.width) {
            if(gridArray[i][k + 1] == 1) {count++;}
        }
        if(i - 1 >= 0 && k - 1 >= 0) {
            if(gridArray[i - 1][k - 1]) {count++;}
        }
        if(i - 1 >= 0 && k + 1 < this._instance.width) {
            if(gridArray[i - 1][k + 1]) {count++;}
        }
        if(i + 1 < this._instance.height && k + 1 < this._instance.width) {
            if(gridArray[i + 1][k + 1]) {count++;}
        }
        if(i + 1 < this._instance.height && k - 1 >= 0) {
            if(gridArray[i + 1][k - 1]) {count++;}
        }
        return count;
    }

    static mapDivs(divArray, gridArray) { //logic --> instanceOfLife class or DOM access --> DOM class
        let index = 0;
        for(let i = 0; i < controller._viewInstance.height; i++) {
            for(let k = 0; k < controller._viewInstance.width; k++) {
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

    static createArray(height, width) { //logic --> instanceOfLife class
        let gridArray = [];
        for(let i = 0; i < height; i++) {
            for(let k = 0; k < width; k++) {
                gridArray[i] = [];
            }
        }
        return gridArray;
    }

    static getDivs() { //logic --> instanceOfLife class or DOM access --> DOM class
        let uIDivs = [];
        for(let i = 0; i < (controller._viewInstance.height * controller._viewInstance.width); i++) {
            uIDivs[i] = controller._viewInstance.wrapper.getElementsByTagName('div')[i];
        }
        return uIDivs;
    }
}

class guiRender {
    constructor(model) {
        this.height = document.getElementById('height').value;// could be getters from a binded class obj
        this.width = document.getElementById('width').value;
        this.iterations = document.getElementById('iterations').value;
        this.animationSpeed = getOptionsValue('evoSpeed');
        this.wrapper = document.createElement('section');

        this.modelInstance = model

        this.createGrid();
    }

    setValues() {
        this.height = document.getElementById('height').value;// could be getters from a binded class obj
        this.width = document.getElementById('width').value;
        this.iterations = document.getElementById('iterations').value;
        this.animationSpeed = getOptionsValue('evoSpeed');
    }

    createGrid() { //DOM access --> DOM class
        let container = document.getElementById('container');
        container.appendChild(this.wrapper);
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