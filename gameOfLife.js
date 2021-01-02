class controller {
	constructor() {
		this._modelInstance = null;
		this._viewInstance = null;
		this._time = null;

		controller.main();
	}

	//#region Setter
	static setView(view) {
		this._viewInstance = view;
	}

	static setModel(model) {
		this._modelInstance = model;
	}

	static setTimer(timer) {
		this._time = timer;
	}
	//#endregion Setter

	//#region Getter
	static getView() {
		return this._viewInstance;
	}

	static getModel() {
		return this._modelInstance;
	}

	static getTime() {
		return this._time;
	}
	//#endregion Getter

	static main() {
		let mnBtnArray = Array.prototype.slice.call(document.querySelectorAll('.mnBtn'));

		mnBtnArray.forEach((arrayItem) => {
			let btnID = arrayItem.getAttribute('id');

			switch(btnID) {
				case 'create': 
					controller.create(arrayItem, mnBtnArray);
					break;
				case 'start': 
					controller.start(arrayItem, mnBtnArray);
					break;
				case 'pause':
					controller.pause(arrayItem, mnBtnArray);
					break;
				case 'step':
					controller.step(arrayItem, mnBtnArray);
					break;
			}
		});
	}

	static create(arrayItem, mnBtnArray) {
		arrayItem.addEventListener('click', () => {
			let view = controller.getView();

			arrayItem.disabled = true;
			mnBtnArray[1].disabled = false;
			mnBtnArray[3].disabled = false;

			view.setValues();
			view.createGrid();
			logicRender.setArrays();
		});
	}

	static start(arrayItem, mnBtnArray) {
		arrayItem.addEventListener('click', () => {
			let view = controller.getView();

			if(arrayItem.textContent == 'Start') {
				controller.play(view, undefined, mnBtnArray);
				arrayItem.textContent = 'Stop'; //at browser incompatibility use '.innerText' instead
				// mnBtnArray[2].disabled = false;
				mnBtnArray[3].disabled = true;
			} else {
				let timer = controller.getTime();
				controller.stop(timer);
				arrayItem.textContent = 'Start';
				// mnBtnArray[2].disabled = true;
				mnBtnArray[3].disabled = false;
			}
		});
	}

	static pause(arrayItem) {// maybe not necessary
		arrayItem.addEventListener('click', () => {
			});
	}

	static step(arrayItem) {
		arrayItem.addEventListener('click', () => {
			let view = controller.getView();

			let renderStep = logicRender.renderStep(view);
			view.setDivs(renderStep);
		});
	}

	static stop(timer) {
		clearTimeout(timer);
	}

	static play(objToProcess, runtime = 0, mnBtnArray) {
		let animationSpeed = objToProcess.getAnimationSpeed();
		let iterations = objToProcess.getIterations();

		if(controller.checkEvolution(iterations, runtime)) {
			clearTimeout(this.time);
			mnBtnArray[1].textContent = 'Start';
			mnBtnArray[3].disabled = false;
		} else {
			let renderStep = logicRender.renderStep(objToProcess)
			objToProcess.setDivs(renderStep);
			runtime++;
			controller.setTimer(setTimeout(controller.play, animationSpeed, objToProcess, runtime, mnBtnArray))
			//time = requestAnimationFrame(() => {controller.play(objToProcess, run, runtime)}); //rly silly because too fast
		}
	}

	static checkEvolution(iterations, runtime) {
		if(runtime < iterations || iterations == -1) {
			return false;
		} else {
			return true;
		}
	}
}

class logicRender {
	constructor() {
		this._gridArray = null;
		this._renderArray = null;
	}

	//#region Setter
	static setGridArray(array) {
		this._gridArray = array;
	}

	static setRenderArray(array) {
		this._renderArray = array;
	}
	//#endregion Setter

	//#region Getter
	static getGridArray() {
		return this._gridArray;
	}

	static getRenderArray() {
		return this._renderArray;
	}
	//#endregion Getter

	static setArrays() {
		let view = controller.getView();
		let height = view.getHeight();
		let width = view.getWidth();
		let gridArray = logicRender.createArray(height, width);
		let renderArray = logicRender.createArray(height, width);

		logicRender.setGridArray(gridArray);
		logicRender.setRenderArray(renderArray);
	}

	static renderStep(objToProcess) {
		let height = objToProcess.getHeight();
		let width = objToProcess.getWidth();
		let wrapper = objToProcess.getWrapper();

		let divArray = logicRender.getDivs(height, width, wrapper);
		let gridArray = logicRender.getGridArray();
		let renderArray = logicRender.getRenderArray();
		let onlyChangesArray = [];

		gridArray = logicRender.mapDivs(divArray, gridArray, height, width);

		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				let count = logicRender.calcNeighbours(i, k, gridArray, height, width);

				renderArray[i][k] = logicRender.applyRules(count, gridArray[i][k]);
				if(renderArray[i][k] !== gridArray[i][k]) {
					let linearIndex = ((width)*i)+k;
					onlyChangesArray.push({gridArrayCell: renderArray[i][k], index: linearIndex});
				}
			}
		}
		return {changes: onlyChangesArray, items: divArray};
	}

	static applyRules(count, gridArrayCell) {
		if(count < 2 || count > 3 && gridArrayCell == 1) {
			return 0;
		} else if(count == 3 && gridArrayCell == 0) {
			return 1;
		} else {
			return gridArrayCell;
		}
	}

	static calcNeighbours(i, k, gridArray, height, width) {
		let count = 0;

		if(i - 1 >= 0) {
			if(gridArray[i - 1][k] == 1) {count++;}
		}
		if(i + 1 < height) {
			if(gridArray[i + 1][k] == 1) {count++;}
		}
		if(k - 1 >= 0) {
			if(gridArray[i][k - 1] == 1) {count++;}
		}
		if(k + 1 < width) {
			if(gridArray[i][k + 1] == 1) {count++;}
		}
		if(i - 1 >= 0 && k - 1 >= 0) {
			if(gridArray[i - 1][k - 1]) {count++;}
		}
		if(i - 1 >= 0 && k + 1 < width) {
			if(gridArray[i - 1][k + 1]) {count++;}
		}
		if(i + 1 < height && k + 1 < width) {
			if(gridArray[i + 1][k + 1]) {count++;}
		}
		if(i + 1 < height && k - 1 >= 0) {
			if(gridArray[i + 1][k - 1]) {count++;}
		}
		return count;
	}

	static mapDivs(divArray, gridArray, height, width) {
		let index = 0;
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
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

	static createArray(height, width) {
		let array = [];
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				array[i] = [];
			}
		}
		return array;
	}

	static getDivs(height, width, wrapper) {
		let divArray = [];
		for(let i = 0; i < (height * width); i++) {
			divArray[i] = wrapper.getElementsByTagName('div')[i];
		}
		return divArray;
	}
}

class guiRender {
	constructor() {
		this._wrapper = document.createElement('section');
		this._height = null;
		this._width = null;
		this._iterations = null;
		this._animationSpeed = null;

		this.refreshFormView();
		this.refreshSliderOutput();
	}

	refreshFormView() {
		this.setSliderMaxValues();
		window.addEventListener('resize', this.setSliderMaxValues);
	}

	setSliderMaxValues() {
		let height = window.innerHeight;
		let width = window.innerWidth;
		let sliderHeight = document.getElementById('height');
		let sliderWidth = document.getElementById('width');

		sliderHeight.setAttribute('max', Math.round(height / 10 - 1));
		sliderWidth.setAttribute('max', Math.round((width / 10) * 0.50));
	}

	refreshSliderOutput() {
		let sliderArray = Array.prototype.slice.call(document.querySelectorAll(".slider"));

		sliderArray.forEach((arrayItem) => {
			// Callbacks are passed a reference to the event object that triggered the handler
			arrayItem.addEventListener('input', function() {
				let output = document.querySelector('output[name="'+ this.name + '"]');
				output.value = this.value;
			});
		})
	}

	//#region Setter
	setHeight(height) {
		this._height = height;
	}

	setWidth(width) {
		this._width = width;
	}

	setIterations(iterations) {
		this._iterations = iterations;
	}

	setAnimationSpeed(animationSpeed) {
		this._animationSpeed = animationSpeed;
	}
	//#endregion Setter

	//#region Getter
	getWrapper() {
		return this._wrapper;
	}

	getHeight() {
		return this._height;
	}

	getWidth() {
		return this._width;
	}

	getIterations() {
		return this._iterations;
	}

	getAnimationSpeed() {
		return this._animationSpeed;
	}
	//#endregion Getter

	setValues() {
		this.setHeight(document.getElementById('height').value);
		this.setWidth(document.getElementById('width').value);
		this.setIterations(document.getElementById('iterations').value);
		this.setAnimationSpeed(this.getOptionsValue('evoSpeed'));
	}

	getOptionsValue(htmlElement) {
		let value;
		const ELEM = document.getElementById(htmlElement);
		for(let i = 0; i < ELEM.options.length; i++) {
			value = ELEM.options[i];

			if(value.selected === true) {
				break;
			}
		}
		return value.text;
	}

	createGrid() {
		let container = document.getElementById('container');
		container.appendChild(this._wrapper);
		this._wrapper.setAttribute('class', 'grid');
		this._wrapper.style.gridTemplateColumns = 'repeat(' + this._width+ ', auto)';
		this._wrapper.style.gridTemplateRows = 'repeat(' + this._height + ', auto)';

			for(let i = 0; i < this._height * this._width; i++) {
				let div = document.createElement('div');
				let ran = Math.round(Math.random());
				if(ran == 1) {
					this._wrapper.appendChild(div).setAttribute('class', 'alive');
				} else {
					this._wrapper.appendChild(div).setAttribute('class', 'dead');
				}
			}
	}

	setDivs({changes: onlyChangesArray, items: divArray}) {
		onlyChangesArray.forEach(arrayItem => this.applyChanges(arrayItem, divArray));
	}

	applyChanges(arrayItem, divArray) {
		if(arrayItem.gridArrayCell == 1) {
			divArray[arrayItem.index].setAttribute('class', 'alive');
		} else {
			divArray[arrayItem.index].setAttribute('class', 'dead');
		}
	}
}