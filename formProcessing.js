class instanceOfForm {
<<<<<<< HEAD
    constructor() {
=======
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
        for(let i = 0; i < this.areaSize; i++){
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
    mapDivs(instanceOfGrid) {
        let index = 0;
        for(let i = 0; i < this.userInput.height; i++) {
            for(let k = 0; k < this.userInput.width; k++) {
                if(this.form.divElements[index].getAttribute('class') == 'alive'){
                    instanceOfGrid.grid[i][k] = 1;
                } else {
                    instanceOfGrid.grid[i][k] = 0;
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

    renderStep(instanceOfGrid) {
        this.mapDivs();
        instanceOfGrid.calcNeighbours();
        instanceOfGrid.copyGrid();
        this.setDivs();
    }
}

// this packs all the user input data -> easier to read and maintain !!
class UserInput{ 
    constructor(height = 3, width = 3){
        this.height = height;
        this.width = width;
    }
}
>>>>>>> parent of 54cc8d0... bug fix

    }
}