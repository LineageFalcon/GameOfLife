class Runtime {
    constructor() {

    }


}

function builder() {
    let body = document.getElementsByTagName('body')[0];
    for(let i = 0; i < 9; i++){
        body.appendChild(document.createElement('div'));
        console.log('Ping');
    }
}