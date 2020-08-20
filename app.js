class instanceOfLife {
    constructor(hostHeight = 3, hostWidth = 3) {
        this.hostHeight = hostHeight;// going to be a user input
        this.hostWidth = hostWidth;// going to be a user input
        this.areaSize = hostHeight * hostWidth;//used in for-loops
        this.items = [];//holds the div obj from the DOM
        this.wrapper;
        this.host= [];//will be fused to a twodimensional array
        this.futureHost = [];//same here
    }

    builder() {
        let body = document.getElementsByTagName('body')[0];
        let section = document.createElement('section');
        body.appendChild(section);
        this.wrapper = section;
        section.style.gridTemplateColumns = 'repeat(' + this.hostHeight + ', auto)';
        section.style.gridTemplateRows = 'repeat(' + this.hostWidth + ', auto)';
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
        for(let i = 0; i < (this.areaSize); i++) {
            this.items[i] = this.wrapper.getElementsByTagName('div')[i];
        }
    }

    prepHost() {
        for(let i = 0; i < this.hostHeight; i++) {
            for(let k = 0; k < this.hostHeight; k++) {
                this.host[i] = [];
                this.futureHost[i] = [];
            }
        }
    }

    copyHost() {
        for(let i = 0; i < this.hostHeight; i++) {
            for(let k = 0; k < this.hostWidth; k++) {
                this.host[i][k] = this.futureHost[i][k];
                this.futureHost[i][k] = 0;
            }
        }
    }

    mapDivs() {
        let index = 0;
        for(let i = 0; i < this.hostHeight; i++) {
            for(let k = 0; k < this.hostWidth; k++) {
                if(this.items[index].getAttribute('class') == 'alive'){
                    this.host[i][k] = 1;
                } else {
                    this.host[i][k] = 0;
                }
                index++;
            }
        }
    }

    formatDivs() {
        let index = 0;
        for(let i = 0; i < this.hostHeight; i++) {
            for(let k = 0; k < this.hostWidth; k++) {
                if(this.host[i][k] == 1) {
                    this.items[index].setAttribute('class', 'alive');
                } else {
                    this.items[index].setAttribute('class', 'dead');
                }
                index++;
            }
        }
    }

    calcN() {
        for(let i = 0; i < this.hostHeight; i++) {
            for(let k = 0; k < this.hostWidth; k++){
                let count = 0;
                if(i - 1 >= 0) {
                    if(this.host[i - 1][k] == 1) {count++;}
                }
                if(i + 1 < this.hostHeight) {
                    if(this.host[i + 1][k] == 1) {count++;}
                }
                if(k - 1 >= 0) {
                    if(this.host[i][k - 1] == 1) {count++;}
                }
                if(k + 1 < this.hostWidth) {
                    if(this.host[i][k + 1] == 1) {count++;}
                }
                if(i - 1 >= 0 && k - 1 >= 0) {
                    if(this.host[i - 1][k - 1]) {count++;}
                }
                if(i - 1 >= 0 && k + 1 < this.hostWidth) {
                    if(this.host[i - 1][k + 1]) {count++;}
                }
                if(i + 1 < this.hostHeight && k + 1 < this.hostWidth) {
                    if(this.host[i + 1][k + 1]) {count++;}
                }
                if(i + 1 < this.hostHeight && k - 1 >= 0) {
                    if(this.host[i + 1][k - 1]) {count++;}
                }
                switch(this.host[i][k]) {
                    case 1: switch(count) {
                        case 2: this.futureHost[i][k] = 1;
                        break;
                        case 3: this.futureHost[i][k] = 1;
                        break;
                        default: this.futureHost[i][k] = 0;
                        break;
                        }
                    break;
                    case 0: if(count == 3) {this.futureHost[i][k] = 1;} else {this.futureHost[i][k] = 0;}
                    break;
                }
            }
        }
        this.copyHost();
        this.formatDivs();
    }

}

let X = new instanceOfLife(10, 100);
X.builder();
X.getDivs();
X.prepHost();// prepare methods

life(X);

function life(obj, evolution = true) {
    if (evolution) {
        obj.mapDivs();
        obj.calcN();
        let time = setTimeout(life, 100, obj, evolution);
    } else {
        clearTimeout(time);
    }
}