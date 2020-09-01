
//import UserInput from 'formProcessing';

class instanceOfGrid {
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