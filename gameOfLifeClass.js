class instanceOfGrid {
    constructor(height = 3, width = 3) {
        this.height = height;// going to be a user input
        this.width = width;// going to be a user input
        this.areaSize = height * width;//used in for-loops
        this.divElements = [];//holds the div obj from the DOM
        this.wrapper = document.createElement('section');
        this.gridArray = [];//will be fused to a twodimensional array
        this.renderGridArray = [];//same here
        
        this.createGrid();
        //let variabe = this.getDivs();
        //let array  = this.createArray(height, width);// prepare methods
    }

    renderStep() {
        let divs = this.getDivs();
        let mapped = this.mapDivs(divs, this.createArray(this.height, this.width));
        let applied = [];
        for(let i = 0; i < this.height; i++) 
        {
            for(let k = 0; k < this.width; k++)
            {
                let count = this.calcNeighbours(i, k, mapped);
                if(undefined !== this.applyRules(i, k, count, mapped[i][k]))
                    applied.push(this.applyRules(i, k, count, mapped[i][k]));
            }
        }
        this.setDivs(applied, divs);
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
        // for(let i = 0; i < (this.areaSize); i++) {
        //     this.divElements[i] = this.wrapper.getElementsByTagName('div')[i];
        // }

        for(let i = 0; i < (this.areaSize); i++) {
            uIDivs[i] = this.wrapper.getElementsByTagName('div')[i];
        }

        return uIDivs;
    }

    createArray(height, width) {
        let grid = [];
        for(let i = 0; i < height; i++) 
        {
            for(let k = 0; k < width; k++) 
            {
                grid[i] = [];
            }
        }
        return grid;
    }

    //get the value of divs and push it into the Grid-Array in 0 and 1 as dead and alive
    mapDivs(DivArray, grid) {
        let index = 0;
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                if(DivArray[index].getAttribute('class') == 'alive'){
                    grid[i][k] = 1;
                } else {
                    grid[i][k] = 0;
                }
                index++;
            }
        }
        return grid;
    }

    calcNeighbours(i, k, mapped)
    {
        let count = 0;
        if(i - 1 >= 0) {
            if(mapped[i - 1][k] == 1) {count++;}
        }
        if(i + 1 < this.height) {
            if(mapped[i + 1][k] == 1) {count++;}
        }
        if(k - 1 >= 0) {
            if(mapped[i][k - 1] == 1) {count++;}
        }
        if(k + 1 < this.width) {
            if(mapped[i][k + 1] == 1) {count++;}
        }
        if(i - 1 >= 0 && k - 1 >= 0) {
            if(mapped[i - 1][k - 1]) {count++;}
        }
        if(i - 1 >= 0 && k + 1 < this.width) {
            if(mapped[i - 1][k + 1]) {count++;}
        }
        if(i + 1 < this.height && k + 1 < this.width) {
            if(mapped[i + 1][k + 1]) {count++;}
        }
        if(i + 1 < this.height && k - 1 >= 0) {
            if(mapped[i + 1][k - 1]) {count++;}
        }
        return count;
    }

    applyRules(i, k, count, cell) {
                if(count < 2 || count > 3 && cell == 1) 
                    return {cell: 0, index: ((this.width)*i)+k};
                else if(count == 3 && cell == 0) 
                    return {cell: 1, index: ((this.width)*i)+k};  
    }

    copyGrid() {
        for(let i = 0; i < this.height; i++) {
            for(let k = 0; k < this.width; k++) {
                this.gridArray[i][k] = this.renderGridArray[i][k];
            }
        }
        return this;
    }
    
    applyChanges(elem, divs)
    {
            if(elem.cell == 1)
            {
                divs[elem.index].setAttribute('class', 'alive');
            } 
            else 
            {
                divs[elem.index].setAttribute('class', 'dead');
            }
    }

    setDivs(arrayWithChanges, divs) {
        arrayWithChanges.forEach(elem => this.applyChanges(elem, divs));
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