function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	// setup();
}

const count = 36;

function preloadModel() {
	const top = [{x:1036,y:135},{x:1447,y:107},{x:1438,y:124},{x:1052,y:150}]
	const base = [{x:1052,y:149},{x:1029,y:885},{x:1376,y:888},{x:1426,y:138}]
	Array.of(...base).forEach(point => {
		const a = new Point(point.x, point.y);
		points.push(a)
	})
}

async function savePointsObj(pathName) {
	if(!pathName) return;
	await fetch('/save', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({
			data: points,
			name: pathName,
		}),
	});
}
async function readPointsObj(pathName) {
	if(!pathName) return;
	let response = await fetch('/read', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({
			name: pathName,
		}),
	});
	const result = await response.json();
	Array.of(...result).forEach(point => {
		const a = new Point(point.x, point.y);
		points.push(a)
	})
}
async function onHandleClickReadButton() {
	const selectElement = document.querySelector('select')
	// console.log('selectElement', selectElement.value);
	points = []
	await readPointsObj(selectElement.value)
}
async function onHandleClickSaveButton() {
	const selectElement = document.querySelector('select')
	console.log('selectElement', selectElement.value);
	await savePointsObj(selectElement.value)
}
function setup() {
	const c = createCanvas(windowWidth, windowHeight);
	c.mouseClicked(mousePress);
	strokeWeight(2);
	stroke('#000')
	// preloadModel();
}
class Point {
	constructor(x, y) {
		this.x = Math.round(x);
		this.y = Math.round(y);
	}
	draw() {
		stroke('#000')
		noFill()
		circle(this.x, this.y, 10)
		noStroke()
		fill('#000')
		textFont('Arial', 30)
		// text(' ' + this.x, this.x, this.y)
		// text(' ' + this.y, this.x, this.y + 30)
	}
	drawLine(currentPointIndex) {
		stroke('#00f')
		line(this.x, this.y, points[currentPointIndex - 1].x, points[currentPointIndex - 1].y)
	}
}


let points = []
function mousePress(event) {
	if(event.metaKey) {
		toggleFullScreen();
		return;
	}
	const inside = points.find(point => {
		const hypotenuse = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2)
		return hypotenuse <= 5;
	});
	if(!inside) {
		const point = new Point(mouseX, mouseY);
		points.push(point)
	}
	else {
		if(event.shiftKey) {
			points = points.filter(point => {
				return point.x !== inside.x && point.y !== inside.y;
			})
		}
	}


}

function mouseDragged() {
	const inside = points.find(point => {
		const hypotenuse = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2)
		return hypotenuse <= 15;
	});
	if(inside) {
		inside.x = mouseX
		inside.y = mouseY
	}
}

function draw() {
	background(255);

	// stroke('white')

	const oneCellWidth = windowWidth / count;
	for(let i = 0; i <= count; i++) {
		stroke('#000')
		const offset = oneCellWidth * i;

		line(0, offset, windowWidth, offset)

		if(i === count / 2) stroke('#ff0000')
		else stroke('#000')

		line(offset, 0, offset, windowHeight)
	}


	points.forEach((point, pointIndex) => {
		if(!point.draw) return;
		point.draw()
		if(pointIndex > 0) {
			point.drawLine(pointIndex)
		}
	})
}
function toggleFullScreen() {
	let fs = fullscreen();
	fullscreen(!fs);
}

function onChangeName(event) {
	points = []
	readPointsObj(event.target.value)
}