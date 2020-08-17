class instanceOfLife {
    constructor(size) {
        this.size = size;
        this.hostSize = size * size
        this.items = [];
        this.row = [];
        this.column = [];
        this.host= [];
        this.futureHost = [];
    }

    builder() {
        let body = document.getElementsByTagName('section')[0];
        // body.style.gridTemplateColumns = size;
        // body.style.gridTemplateRows = size;
        for(let i = 0; i < this.hostSize; i++){
            let div = document.createElement('div');
            if (i >= 3 && i <= 5) {
                body.appendChild(div).setAttribute('class', 'alive');
            }
            else {
                body.appendChild(div).setAttribute('class', 'dead');
            }
        }
    }

    getDivs() {
        for(let i = 0; i < (this.hostSize); i++) {
            console.log(document.getElementsByTagName('div')[i]);
            this.items[i] = document.getElementsByTagName('div')[i];
        }
    }

    changeColor(index = 2) {
        this.items[index].style.backgroundColor = "blue";
    }

    prepHost() {
        for(let i = 0; i < this.size; i++) {
            for(let k = 0; k < this.size; k++) {
                this.host[i] = [];
                this.futureHost[i] = [];
            }
        }
    }

    mapDivs() {
        let index = 0;
        this.prepHost()
        for(let i = 0; i < this.size; i++) {
            for(let k = 0; k < this.size; k++) {
                if(this.items[index].getAttribute('class') == 'alive'){
                    this.host[i][k] = 1;
                } else {
                    this.host[i][k] = 0;
                }
                index++
            }
        }
        console.log(this.host);
    }

    calculateN() {
        let count = 0;
        for(let i = 0; i < this.hostSize; i++) {
            for(let k = 0; k < this.hostSize; k++){
                
                //item i has to be checked if it has neighbours in the direction of -4 or +4 and if they are dead or alive
                //each k gets checked for its value in this case its css attribute class 
                // if (this.items[k].getAttribute('class') === 'alive') {
                //     count++;
                // } else {}
            }
        }
        console.log(count);
    }

}

let X = new instanceOfLife(3);
X.builder();
X.getDivs();
X.calculateN();