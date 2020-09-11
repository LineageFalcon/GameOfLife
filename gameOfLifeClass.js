class instanceOfGrid {
    constructor(height = 3, width = 3) {
        this.height = height;// going to be a user input
        this.width = width;// going to be a user input
        this.areaSize = height * width;//used in for-loops
        this.divElements = [];//holds the div obj from the DOM
        this.wrapper = document.createElement('section');
        this.gridArray = [];//will be fused to a twodimensional array
        this.renderGridArray = [];//same here
        
        this.createGrid().getDivs().createArray();// prepare methods
    }

    renderStep() {
        this.renderGridArray = JSON.parse(JSON.stringify(this.gridArray));;
        this.mapDivs().calcNeighbours().copyGrid().setDivs();
    }

    createGrid() { //wrapper needs to be looked into, if it is realy necessary to be in global scope !! Getter ?
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(this.wrapper);
        this.wrapper.setAttribute('class', 'grid');
        this.wrapper.style.gridTemplateColumns = 'repeat(' + this.height + ', auto)';
        this.wrapper.style.gridTemplateRows = 'repeat(' + this.width + ', auto)';
        for(let i = 0; i < this.areaSize; i++){
            let div = document.createElement('div');
            let ran = Math.round(Math.random());
            if (ran == 1) {
                this.wrapper.appendChild(div).setAttribute('class', 'alive');
            }
            else {
                this.wrapper.appendChild(div).setAttribute('class', 'dead');
            }
        }
        return this;
    }

    getDivs() {
        for(let i = 0; i < (this.areaSize); i++) {
            this.divElements[i] = this.wrapper.getElementsByTagName('div')[i];
        }
        return this;
    }

    createArray() {
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                this.gridArray[i] = [];
            }
        }
        this.renderGridArray = this.gridArray;

        return this;
    }

    //get the value of divs and push it into the Grid-Array in 0 and 1 as dead and alive
    mapDivs() {
        let index = 0;
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                if(this.divElements[index].getAttribute('class') == 'alive'){
                    this.gridArray[i][k] = 1;
                } else {
                    this.gridArray[i][k] = 0;
                }
                index++;
            }
        }
        return this;
    }

    calcNeighbours() {
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++){
                let count = 0;
                if(i - 1 >= 0) {
                    if(this.gridArray[i - 1][k] == 1) {count++;}
                }
                if(i + 1 < this.height) {
                    if(this.gridArray[i + 1][k] == 1) {count++;}
                }
                if(k - 1 >= 0) {
                    if(this.gridArray[i][k - 1] == 1) {count++;}
                }
                if(k + 1 < this.width) {
                    if(this.gridArray[i][k + 1] == 1) {count++;}
                }
                if(i - 1 >= 0 && k - 1 >= 0) {
                    if(this.gridArray[i - 1][k - 1]) {count++;}
                }
                if(i - 1 >= 0 && k + 1 < this.width) {
                    if(this.gridArray[i - 1][k + 1]) {count++;}
                }
                if(i + 1 < this.height && k + 1 < this.width) {
                    if(this.gridArray[i + 1][k + 1]) {count++;}
                }
                if(i + 1 < this.height && k - 1 >= 0) {
                    if(this.gridArray[i + 1][k - 1]) {count++;}
                }
                this.applyRules(i, k, count);
            }
        }
        return this;
    }

    applyRules(i, k, count) {
        switch(this.gridArray[i][k]) {
            case 1: switch(count) {
                case 2: this.renderGridArray[i][k] = 1;
                break;
                case 3: this.renderGridArray[i][k] = 1;
                break;
                default: this.renderGridArray[i][k] = 0;
                break;
                }
            break;
            case 0: if(count == 3) {this.renderGridArray[i][k] = 1;} else {this.renderGridArray[i][k] = 0;}
            break;
        }
    }

    copyGrid() {
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                this.gridArray[i][k] = this.renderGridArray[i][k];
            }
        }
        return this;
    }

    setDivs() {
        let index = 0;
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                if(this.gridArray[i][k] == 1) {
                    this.divElements[index].setAttribute('class', 'alive');
                } else {
                    this.divElements[index].setAttribute('class', 'dead');
                }
                index++;
            }
        }
        return this;
    }
}

document.getElementById('start').addEventListener('click', function() {
    let height = document.getElementById('height').value;// could be getters from a binded class obj
    let width = document.getElementById('width').value;
    let grid = new instanceOfGrid(height, width); 
    play(grid);
});

// play(grid); //regular function call -> not yet needed and revised

function play(obj, evolution = true) {
    if (evolution) {
        obj.renderStep(); //redering is done from form with params (grid)
        time = setTimeout(play, 100, obj,  evolution);
    } else {
        clearTimeout(time);
    }
}