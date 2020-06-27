let tbody = document.querySelector("#bingo tbody");

let divisors = getBestDivisors(ELEMENTS.length)

let remainingElements = ELEMENTS.slice()

for(let i = 0; i < divisors.min; i++){
	let tr = document.createElement("tr")
	for(let j = 0; j < divisors.max; j++){
		let element = remainingElements.splice(randomIndex(remainingElements), 1)[0]
		let td = document.createElement("td")
		td.appendChild(document.createTextNode(element))
		tr.appendChild(td)

		td.setAttribute("data-y", i)
		td.setAttribute("data-x", j)
		td.active = 0
		td.addEventListener('click', toggleElement)
	}
	tbody.appendChild(tr)
}


document.querySelector("#golden").addEventListener('click', () => {
	let remainingElements = []
	for(const tr of tds){
		for(const td of tr){
			if(!isClicked(td))
				remainingElements.push(td)
		}
	}

	let element = remainingElements.splice(randomIndex(remainingElements), 1)

	if(element.length > 0)
		toggleElement.apply(element[0], null)
})

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

	let x = parseInt(element.getAttribute('data-x'))
	let y = parseInt(element.getAttribute('data-y'))

	if(active)
		setSuccess(element)
	else
		setDefault(element)

	let activeCount = 0
	
	// Y
	for(let x = 0; x < divisors.max; x++){
		activeCount = 0
		for(let i = 0; i < divisors.min; i++) {
			let current = tds[i][x]

			if(isClicked(current))
				activeCount++
		}

		for(let i = 0; i < divisors.min; i++) {
			let current = tds[i][x]
			completedLine(activeCount, current, divisors.min)
		}
	
	}
	


	// X
	for(let y = 0; y < divisors.min; y++){
		activeCount = 0
		for(let i = 0; i < divisors.max; i++) {
			let current = tds[y][i]
			if(isClicked(current))
				activeCount++
		}
		for(let i = 0; i < divisors.max; i++) {
			let current = tds[y][i]
			completedLine(activeCount, current, divisors.max)
		}
	}


	// Diagonals on square
	if(divisors.min == divisors.max) {
		// Diagonal Up-Left to Down-Right

		activeCount = 0
		for(let i = 0; i < divisors.max; i++) {
			let current = tds[i][i]
			if(isClicked(current))
				activeCount++
		}
		for(let i = 0; i < divisors.max; i++) {
			let current = tds[i][i]
			completedLine(activeCount, current, divisors.max)
		}
		
		// Diagonal Up-Right to Down-Left
		activeCount = 0
		for(let i = 0; i < divisors.max; i++) {
			let current = tds[i][divisors.max - i - 1]
			if(isClicked(current))
				activeCount++
		}
		for(let i = 0; i < divisors.max; i++) {
			let current = tds[i][divisors.max - i - 1]
			completedLine(activeCount, current, divisors.max)
		}
	}	
	
	// printActive()

	for(let i = 0; i < divisors.max; i++) {
		for(let j = 0; j < divisors.min; j++) {
			let current = tds[j][i]
			if(current.active == 0 && isActive(current))
				setSuccess(current)
			current.active = 0
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

function completedLine(activeCount, current, max) {
	if(activeCount == max){
		setActive(current)
		current.active++
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
