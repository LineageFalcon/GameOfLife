class Grid {
    constructor(userInput) {

        this.userInput = userInput;

        this.grid = [];//will be fused to a twodimensional array
        this.renderGrid = [];//same here

        this.createGridArray();// prepare methods
    }

    createGridArray() {
        for(let i = 0; i < this.userInput.height; i++) {
            for(let k = 0; k < this.userInput.width; k++) {
                this.grid[i] = [];
                this.renderGrid[i] = [];
            }
        }
    }

    copyGrid() {
        for(let i = 0; i < this.userInput.height; i++) {
            for(let k = 0; k < this.userInput.width; k++) {
                this.grid[i][k] = this.renderGrid[i][k];
                this.renderGrid[i][k] = 0;
            }
        }
    }

    applyRules(i, k, count) {
        switch(this.grid[i][k]) {
            case 1: switch(count) {
                case 2: this.renderGrid[i][k] = 1;
                break;
                case 3: this.renderGrid[i][k] = 1;
                break;
                default: this.renderGrid[i][k] = 0;
                break;
                }
            break;
            case 0: if(count == 3) {this.renderGrid[i][k] = 1;} else {this.renderGrid[i][k] = 0;}
            break;
        }
    }

    calcNeighbours() {
        for(let i = 0; i < this.userInput.height; i++) {
            for(let k = 0; k < this.userInput.width; k++){
                let count = 0;
                if(i - 1 >= 0) {
                    if(this.grid[i - 1][k] == 1) {count++;}
                }
                if(i + 1 < this.userInput.height) {
                    if(this.grid[i + 1][k] == 1) {count++;}
                }
                if(k - 1 >= 0) {
                    if(this.grid[i][k - 1] == 1) {count++;}
                }
                if(k + 1 < this.userInput.width) {
                    if(this.grid[i][k + 1] == 1) {count++;}
                }
                if(i - 1 >= 0 && k - 1 >= 0) {
                    if(this.grid[i - 1][k - 1]) {count++;}
                }
                if(i - 1 >= 0 && k + 1 < this.width) {
                    if(this.grid[i - 1][k + 1]) {count++;}
                }
                if(i + 1 < this.userInput.height && k + 1 < this.userInput.width) {
                    if(this.grid[i + 1][k + 1]) {count++;}
                }
                if(i + 1 < this.userInput.height && k - 1 >= 0) {
                    if(this.grid[i + 1][k - 1]) {count++;}
                }
                this.applyRules(i, k, count);
            }
        }
    }
}

class Interface {
    constructor(userInput, form) {

        this.userInput = userInput;
        this.form = form;
        
        this.createFormGrid();
        this.getDivs();
    }

    createFormGrid() {
        let body = document.getElementsByTagName('body')[0];
        let section = document.createElement('section');
        body.appendChild(section);
        this.form.wrapper = section;
        section.style.gridTemplateColumns = 'repeat(' + this.userInput.height + ', auto)';
        section.style.gridTemplateRows = 'repeat(' + this.userInput.width + ', auto)';
        for(let i = 0; i < this.form.areaSize; i++){
            let div = document.createElement('div');
            let ran = Math.round(Math.random());
            if (ran == 1) {
                section.appendChild(div).setAttribute('class', 'alive');
            }
            else {
                section.appendChild(div).setAttribute('class', 'dead');
            }
        }
    }

    getDivs() {
        for(let i = 0; i < (this.form.areaSize); i++) {
            this.form.divElements[i] = this.form.wrapper.getElementsByTagName('div')[i];
        }
    }

    
    //get the value of divs and push it into the Grid-Array in 0 and 1 as dead and alive
    mapDivs(gridInstance) {
        let index = 0;
        for(let i = 0; i < this.userInput.height; i++) {
            for(let k = 0; k < this.userInput.width; k++) {
                if(this.form.divElements[index].getAttribute('class') == 'alive'){
                    gridInstance.grid[i][k] = 1;
                } else {
                    gridInstance.grid[i][k] = 0;
                }
                index++;
            }
        }
    }

    setDivs(instanceOfGrid) {
        let index = 0;
        for(let i = 0; i < this.userInput.height; i++) {
            for(let k = 0; k < this.userInput.width; k++) {
                if(instanceOfGrid.grid[i][k] == 1) {
                    this.form.divElements[index].setAttribute('class', 'alive');
                } else {
                    this.form.divElements[index].setAttribute('class', 'dead');
                }
                index++;
            }
        }
    }

    renderStep(gridInstance) {
        this.mapDivs(gridInstance);
        gridInstance.calcNeighbours();
        gridInstance.copyGrid();
        this.setDivs(gridInstance);
    }
}

// this packs all the user input data -> easier to read and maintain !!
class UserInput{ 
    constructor(height = 3, width = 3){
        this.height = height;
        this.width = width;
    }
}

//this packs all form related data
class Form{
    constructor(userInput){
        this.areaSize = userInput.height * userInput.width;//used in for-loops
        this.divElements = [];//holds the div obj from the DOM
        this.wrapper;
    }
}