class Runtime {
    constructor() {

    }


}

function builder(size) {
    let body = document.getElementsByTagName('section')[0];
    // body.style.gridTemplateColumns = size;
    // body.style.gridTemplateRows = size;
    for(let i = 0; i < 9; i++){
        body.appendChild(document.createElement('div'));
        console.log('Ping');
    }
}