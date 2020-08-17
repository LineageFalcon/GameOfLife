class instanceOfLife {
    constructor(size) {
        this.size = size*size;
        this.items = [];
    }

    getDivs() {
        for(let i = 0; i < (this.size); i++) {
            console.log(document.getElementsByTagName('div')[i]);
            this.items[i] = document.getElementsByTagName('div')[i];
        }
    }

    changeColor(index = 2) {
        this.items[index].style.backgroundColor = "blue";
    }

}

let runing = new instanceOfLife(3);

function builder(size) {
    let body = document.getElementsByTagName('section')[0];
    // body.style.gridTemplateColumns = size;
    // body.style.gridTemplateRows = size;
    for(let i = 0; i < 9; i++){
        body.appendChild(document.createElement('div'));
        console.log('Ping');
    }
}