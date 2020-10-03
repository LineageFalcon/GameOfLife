class controller {
	constructor() {
		//this._instances = [];
		this._modelInstance;
		this._viewInstance;

		controller.main();
	}

	//#region Setter
	static setInstance(newInstance) {
		this._instances = newInstance;
	}

	static setView(view) {
		this._viewInstance = view;
	}

	static setModel(model) {
		this._modelInstance = model;
	}
	//#endregion Setter

	//#region Getter
	static getInstance() {
		return this._instances;
	}

	static getView() {
		return this._viewInstance;
	}
	//#endregion Getter

	static checkEvolution(iterations, runtime) {
		if (runtime < iterations || iterations == -1) {
			return true
		}
		else {
			return false;
		}
	}

	static main() {
		document.getElementById('start').addEventListener('click', function() {
			let view = controller.getView();

			view.setValues();
			//logicRender.setInstance(CURRENT_INSTANCE);
			view.createGrid();
				logicRender.setView(view); //not nice, in theory the controller should call the right functions with a instance parameter
			controller.play(view);
		});
	}

	static play(objToProcess, runtime = 0) {
		let time; //make sure all vars are declared in the needed scope -> {}
		let animationSpeed = objToProcess.getAnimationSpeed();
		let iterations = objToProcess.getIterations();

		if (controller.checkEvolution(iterations, runtime)) {
			logicRender.renderStep(objToProcess); //rendering is done from form with params (grid)
			runtime++;
			time = setTimeout(controller.play, animationSpeed, objToProcess, runtime); //maybe use requestAnimationFrame
		} else {
			clearTimeout(time);
		}
	}
}

class logicRender {
	constructor() {
		this._viewInstance;
	}

	static setView(view) {
		this._viewInstance = view;
	}

	static renderStep(objToProcess) {
		let height = objToProcess.getHeight();
		let width = objToProcess.getWidth();
		let wrapper = objToProcess.getWrapper();

		let divArray = logicRender.getDivs(height, width, wrapper);
		let gridArray = logicRender.createArray(height, width);
		gridArray = logicRender.mapDivs(divArray, gridArray, height, width);

		let onlyChangesArray = [];
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				let count = logicRender.calcNeighbours(i, k, gridArray, height, width);
				if(undefined !== logicRender.applyRules(i, k, count, gridArray[i][k], width))// not efficient
					onlyChangesArray.push(logicRender.applyRules(i, k, count, gridArray[i][k], width));
			}
		}
		//method for logic to get new array for the new grid --> maybe this can replace the acutal if closure
		logicRender.setDivs(onlyChangesArray, divArray, objToProcess);
	}

	static setDivs(onlyChangesArray, divArray, objToProcess) {
		onlyChangesArray.forEach(elem => objToProcess.applyChanges(elem, divArray));
	}

	static copyGrid(height, width) { //logic --> instanceOfLife class
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				logicRender.gridArray[i][k] = logicRender.renderGridArray[i][k];
			}
		}
		return this;
	}

	static applyRules(i, k, count, gridArrayCell, width) {
		//DO MATH
		let uiIndex = ((width)*i)+k;

		if(count < 2 || count > 3 && gridArrayCell == 1)
			return {gridArrayCell: 0, index: uiIndex};
		else if(count == 3 && gridArrayCell == 0)
			return {gridArrayCell: 1, index: uiIndex};
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
		let gridArray = [];
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				gridArray[i] = [];
			}
		}
		return gridArray;
	}

	static getDivs(height, width, wrapper) {
		let uIDivs = [];
		for(let i = 0; i < (height * width); i++) {
			uIDivs[i] =wrapper.getElementsByTagName('div')[i];
		}
		return uIDivs;
	}
}

class guiRender {
	constructor() {
		this._wrapper = document.createElement('section');
		this._height = null;// could be getters from a binded class obj
		this._width = null;
		this._iterations = null;
		this._animationSpeed = null;

		this.refreshFormView();
		this.refreshSliderOutput()
	}

	refreshSliderOutput() {
		let sliderArray = Array.prototype.slice.call(document.querySelectorAll(".slider"));
		//const slider = document.querySelectorAll(".slider");
		sliderArray.forEach(function(el) {
			// Callbacks are passed a reference to the event object that triggered the handler
			el.addEventListener('input', function(evt) {
				let output = document.querySelector('output[name="'+ this.name + '"]');
				output.value = this.value;
			});
		})
	}

	refreshFormView() {
		this.setSliderMaxValues();
		window.addEventListener('resize', this.setMaxValues);
	}

	setSliderMaxValues() {
		let height = window.innerHeight;
		let width = window.innerWidth;
		let sliderHeight = document.getElementById('height');
		let sliderWidth = document.getElementById('width')// special calc needed

		sliderHeight.setAttribute('max', Math.round(height / 10 - 1));
		sliderWidth.setAttribute('max', Math.round((width / 10) * 0.50));
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

	createGrid() {
		let container = document.getElementById('container');
		container.appendChild(this._wrapper);
		this._wrapper.setAttribute('class', 'grid');
		this._wrapper.style.gridTemplateColumns = 'repeat(' + this._width+ ', auto)';
		this._wrapper.style.gridTemplateRows = 'repeat(' + this._height + ', auto)';
			for(let i = 0; i < this._height * this._width; i++) {
				let div = document.createElement('div');
				let ran = Math.round(Math.random());
				if (ran == 1) {
					this._wrapper.appendChild(div).setAttribute('class', 'alive');
				}
				else {
					this._wrapper.appendChild(div).setAttribute('class', 'dead');
				}
			}
		}

	getOptionsValue(htmlElement) {
		let value;
		const ELEM = document.getElementById(htmlElement);
		for (let i = 0; i < ELEM.options.length; i++ ) {
			value = ELEM.options[i];
			if ( value.selected === true ) {
				break;
			}
		}
		return value.text;
	}

	applyChanges(elem, divArray) {
		if(elem.gridArrayCell == 1) {
			divArray[elem.index].setAttribute('class', 'alive');
		}
		else {
			divArray[elem.index].setAttribute('class', 'dead');
		}
	}
}