class instanceOfLife {
    constructor(size) {
        this.size = size;
        this.items = [];
    }

    builder() {
        let body = document.getElementsByTagName('section')[0];
        // body.style.gridTemplateColumns = size;
        // body.style.gridTemplateRows = size;
        for(let i = 0; i < this.size * this.size; i++){
            let div = document.createElement('div');
            if (i >= 3 && i <= 5) {
                body.appendChild(div).setAttribute('class', 'alive');
            }
            else {
                body.appendChild(div);
            }
        }
    }

    getDivs() {
        for(let i = 0; i < (this.size * this.size); i++) {
            console.log(document.getElementsByTagName('div')[i]);
            this.items[i] = document.getElementsByTagName('div')[i];
        }
    }

    changeColor(index = 2) {
        this.items[index].style.backgroundColor = "blue";
    }

    calculateN() {

    }

}

let runing = new instanceOfLife(3);