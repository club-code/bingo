let tbody = document.querySelector("#bingo tbody");

let divisors = getBestDivisors(ELEMENTS.length)

let remainingElements = ELEMENTS.slice()

function init() {

	for(let i = 0; i < divisors.min; i++){
		let tr = document.createElement("tr")
		for(let j = 0; j < divisors.max; j++){
			let element = remainingElements.splice(randomIndex(remainingElements), 1)[0]
			let td = document.createElement("td")
			td.appendChild(document.createTextNode(element))
			tr.appendChild(td)

			td.active = 0
			td.addEventListener('click', toggleElement)
		}
		tbody.appendChild(tr)
	}


	document.querySelector("#golden").addEventListener('click', () => {
		let remainingElements = []
		for(let td of all()){
			if(!isClicked(td))
				remainingElements.push(td)
		}

		let element = remainingElements.splice(randomIndex(remainingElements), 1)

		if(element.length > 0)
			toggleElement.apply(element[0], null)
	})

}

init()

let tds = []

tbody.querySelectorAll('tr').forEach(element => {
	tds.push(element.querySelectorAll('td'))
})

function toggleElement(){
	forEachAlignement(this, !isClicked(this))
}

function getBestDivisors(n) {
	for(let i = Math.ceil(Math.sqrt(n)); i < n; i++) {
		if(n%i == 0)
			return {min: n/i, max: i};
	}

	return {min: 1, max: n}
}

function randomIndex(array) {
	return Math.floor(Math.random() * array.length)
}

function isDefault(element) {
	return element.className === ""
}

function setDefault(element) {
	element.className = ""
}

function setActive(element) {
	element.className = "table-active"
}

function isActive(element) {
	return element.className === "table-active"
}

function setSuccess(element) {
	element.className = "table-success"
}

function isSuccess(element) {
	return element.className === "table-success"
}

function isClicked(element) {
	return element.className === "table-success" || isActive(element)
}



function forEachAlignement(element, active) {
	if(active)
		setSuccess(element)
	else
		setDefault(element)
	
	// Y
	for(let x = 0; x < divisors.max; x++){
		processAlignment(column.bind(this, x))
	}
	
	// X
	for(let y = 0; y < divisors.min; y++){
		processAlignment(line.bind(this, y))
	}

	// Diagonals on square
	if(divisors.min == divisors.max) {
		// Diagonal Up-Left to Down-Right
		processAlignment(diagonal)
		
		// Diagonal Up-Right to Down-Left
		processAlignment(antiDiagonal)
	}	
	
	// printActive()

	for(let current of all()) {
		if(current.active == 0 && isActive(current))
			setSuccess(current)
		current.active = 0
	}

}

// Generators

function* all() {
	for(let i = 0; i < divisors.max; i++) {
		for(let j = 0; j < divisors.min; j++) {
			yield tds[j][i]
		}
	}
}

function* diagonal() {
	for(let i = 0; i < divisors.max; i++) {
		yield tds[i][i]
	}
}

function* antiDiagonal() {
	for(let i = 0; i < divisors.max; i++) {
		yield tds[i][divisors.max - i - 1]
	}
}

function* line(y) {
	for(let i = 0; i < divisors.max; i++) {
		yield tds[y][i]
	}
}

function* column(x) {
	for(let i = 0; i < divisors.min; i++) {
		yield tds[i][x]
	}
}

function processAlignment(generator) {
	let activeCount = 0
	let max = 0
	for(let current of generator()) {
		if(isClicked(current))
			activeCount++
		max++
	}
	for(let current of generator()) {
		if(activeCount == max){
			setActive(current)
			current.active++
		}
	}
}


function printActive() {
	let str = ''
	for(const tr of tds){
		for(const td of tr){
			str+=td.active+' '
		}
		str+='\n'
	}
	console.log(str)
}
