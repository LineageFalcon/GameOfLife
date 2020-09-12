class instanceOfGrid {
    constructor(height = 3, width = 3) {
        this.height = height;// going to be a user input
        this.width = width;// going to be a user input
        this.areaSize = height * width;//used in for-loops
        this.wrapper = document.createElement('section');
        
        this.createGrid();
    }

    renderStep() {
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
    }

    getDivs() {
        let uIDivs = [];

        for(let i = 0; i < (this.areaSize); i++) {
            uIDivs[i] = this.wrapper.getElementsByTagName('div')[i];
        }

        return uIDivs;
    }

    createArray(height, width) {
        let grid = [];
        for(let i = 0; i < height; i++) {
            for(let k = 0; k < width; k++) {
                grid[i] = [];
            }
        }
        return grid;
    }

    //get the value of divs and push it into the Grid-Array in 0 and 1 as dead and alive
    mapDivs(divArray, gridArray) {
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

    calcNeighbours(i, k, gridArray)
    {
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

    applyRules(i, k, count, gridArrayCell) {
                if(count < 2 || count > 3 && gridArrayCell == 1) 
                    return {gridArrayCell: 0, index: ((this.width)*i)+k};
                else if(count == 3 && gridArrayCell == 0) 
                    return {gridArrayCell: 1, index: ((this.width)*i)+k};  
    }

    copyGrid() {
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                this.gridArray[i][k] = this.renderGridArray[i][k];
            }
        }
        return this;
    }
    
    applyChanges(elem, divArray)
    {
            if(elem.gridArrayCell == 1) {
                divArray[elem.index].setAttribute('class', 'alive');
            } 
            else {
                divArray[elem.index].setAttribute('class', 'dead');
            }
    }

    setDivs(onlyChangesArray, divArray) {
        onlyChangesArray.forEach(elem => this.applyChanges(elem, divArray));
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
        obj.renderStep(); //rendering is done from form with params (grid)
        time = setTimeout(play, 100, obj,  evolution);
    } else {
        clearTimeout(time);
    }
}