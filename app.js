class instanceOfLife {
    constructor(size) {
        this.size = size;// going to be a user input
        this.hostSize = size * size;//used in for-loops
        this.items = [];//holds the div obj from the DOM
        this.host= [];//will be fused to a twodimensional array
        this.futureHost = [];//same here
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

    calcN() {
        let count = 0;
        for(let i = 0; i < this.size; i++) {
            for(let k = 0; k < this.size; k++){
                if(i - 1 >= 0) {
                    if(this.host[i - 1][k] == 1) {count++;}
                }
                if(i + 1 <= this.size - 1) {
                    if(this.host[i + 1][k] == 1) {count++;}
                }
                if(k - 1 >= 0) {
                    if(this.host[i][k - 1] == 1) {count++;}
                }
                if(k + 1 <= this.size - 1) {
                    if(this.host[i][k + 1] == 1) {count++;}
                }
            }
        }
        console.log(count);
    }

}

let X = new instanceOfLife(3);
X.builder();
X.getDivs();
X.mapDivs();
X.calcN();