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

	static setTime(timer) {
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

		mnBtnArray.forEach(function(arrayItem) {
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
		})
	}

	static create(arrayItem, mnBtnArray) {
		arrayItem.addEventListener('click', () => {
			let view = controller.getView();

			arrayItem.disabled = true;
			mnBtnArray[1].disabled = false;
			mnBtnArray[3].disabled = false;

			view.setValues();
			view.createGrid();
		});
	}

	static start(arrayItem, mnBtnArray) {
		arrayItem.addEventListener('click', () => {
			let view = controller.getView();

			if(arrayItem.textContent == 'Start') {
				// view.setValues();
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

	static pause(arrayItem, mnBtnArray) {// maybe not necessary
		arrayItem.addEventListener('click', () => {
			});
	}

	static step(arrayItem, mnBtnArray) {
		arrayItem.addEventListener('click', () => {
			let view = controller.getView();

			logicRender.renderStep(view);
		});
	}

	static stop(timer) {
		clearTimeout(timer);
	}

	static play(objToProcess, runtime = 0, mnBtnArray) {
		let animationSpeed = objToProcess.getAnimationSpeed();
		let iterations = objToProcess.getIterations();

		if (controller.checkEvolution(iterations, runtime)) {
			clearTimeout(this.time);
			mnBtnArray[1].textContent = 'Start';
			mnBtnArray[3].disabled = false;
		} else {
			logicRender.renderStep(objToProcess);//must return values which are given to the view 
			runtime++;
			controller.setTime(setTimeout(controller.play, animationSpeed, objToProcess, runtime, mnBtnArray))
			//time = requestAnimationFrame(() => {controller.play(objToProcess, run, runtime)});
		}
	}

	static checkEvolution(iterations, runtime) {
		if (runtime < iterations || iterations == -1) {
			return false;
		}
		else {
			return true;
		}
	}
}

class logicRender {
	constructor() {}

	static renderStep(objToProcess) {
		let height = objToProcess.getHeight();
		let width = objToProcess.getWidth();
		let wrapper = objToProcess.getWrapper();

		let divArray = logicRender.getDivs(height, width, wrapper);
		let gridArray = logicRender.createArray(height, width);// shouldnt be here 
		let renderArray = logicRender.createArray(height, width);// this as well
		gridArray = logicRender.mapDivs(divArray, gridArray, height, width);
		// let renderArray = logicRender.copyGrid(height, width, gridArray);

		let onlyChangesArray = [];
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				let count = logicRender.calcNeighbours(i, k, gridArray, height, width);

				renderArray[i][k] = logicRender.applyRules(count, gridArray[i][k]);
				if (renderArray[i][k] !== gridArray[i][k]) {
					let linearIndex = ((width)*i)+k;
					onlyChangesArray.push({gridArrayCell: renderArray[i][k], index: linearIndex});
				}
			}
		}
		//method for logic to get new array for the new grid --> maybe this can replace the acutal if closure
		logicRender.setDivs(onlyChangesArray, divArray, objToProcess); // controller calls view
	}

	static setDivs(onlyChangesArray, divArray, objToProcess) {
		onlyChangesArray.forEach(arrayItem => objToProcess.applyChanges(arrayItem, divArray));
	}

	static copyGrid(height, width, gridArray, renderArray) {
		for(let i = 0; i < height; i++) {
			for(let k = 0; k < width; k++) {
				gridArray[i][k] = renderArray[i][k];
			}
		}
		return gridArray;
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
		let uIDivs = [];
		for(let i = 0; i < (height * width); i++) {
			uIDivs[i] = wrapper.getElementsByTagName('div')[i];
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
		sliderArray.forEach(function(arrayItem) {
			// Callbacks are passed a reference to the event object that triggered the handler
			arrayItem.addEventListener('input', function() {
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

	applyChanges(arrayItem, divArray) {
		if(arrayItem.gridArrayCell == 1) {
			divArray[arrayItem.index].setAttribute('class', 'alive');
		}
		else {
			divArray[arrayItem.index].setAttribute('class', 'dead');
		}
	}
}