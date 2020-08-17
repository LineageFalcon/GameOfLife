class Runtime {
    constructor(size) {
        this.size = size*size;
    }

    getDivs() {
        for(let i = 0; i < (this.size); i++) {
            console.log(document.getElementsByTagName('div')[i]);
            console.log("counter" + i);
        }
        // let items = document.getElementsByName('div')[i];
    }
}

let runing = new Runtime(3);

function builder(size) {
    let body = document.getElementsByTagName('section')[0];
    // body.style.gridTemplateColumns = size;
    // body.style.gridTemplateRows = size;
    for(let i = 0; i < 9; i++){
        body.appendChild(document.createElement('div'));
        console.log('Ping');
    }
}