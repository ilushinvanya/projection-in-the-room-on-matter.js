function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
const defaultCategory = 0x0001,
	doNotCategory = 0x0002;

class Boundary {
	constructor(x, y, w, h, angle) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		let options = {
			friction: 0.3,
			restitution: 0.6,
			isStatic: true,
			angle: angle * Math.PI/180,
		}
		this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
		Composite.add(world, this.body);
	}
	show() {
		let pos = this.body.position;
		let angle = this.body.angle;
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		strokeWeight(1);
		noStroke();
		fill('red');
		rect(0, 0, this.w, this.h);
		pop();
	}
}
class Ball {
	constructor(x, y, radius, color, isStatic = false) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		let options = {
			friction: 0.3,
			restitution: 0.6,
			isStatic: isStatic,
			collisionFilter: {
				mask: defaultCategory,
			},
		}
		this.body = Bodies.circle(this.x, this.y, this.radius, options);

		Composite.add(world, this.body);
	}

	show() {
		let pos = this.body.position;
		let angle = this.body.angle;
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		strokeWeight(0);
		stroke(0)
		fill(this.color);
		circle(0,0,this.radius * 2);
		pop();
	}
}
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		// this.d = 30;
	}
	draw() {
		circle(this.x, this.y, 30)
		textFont('Arial', 30)
		text('x ' + this.x, this.x, this.y)
		text('y ' + this.y, this.x, this.y + 30)
	}
}
class Spiral {
	constructor(startAngle, color) {
		this.Angle = startAngle
		this.Color = color

		this.SpiralLoops = 3;
		this.Iterations = this.SpiralLoops * 360 * this.AngleStep
	}
	AngleStep = 1;
	Radius = 0
	RadiusStep = 0.02

	update() {
		this.Angle += this.AngleStep;
		this.draw()
	}
	draw() {
		let angle = this.Angle;
		let radius = this.Radius

		// c.beginPath()
		strokeWeight(1);
		stroke(this.Color)

		// Рисуем спираль
		for (let i = 0; i < this.Iterations; i++) {
			// Каждый раз увеличиваем радиус, получается спираль
			radius += this.RadiusStep
			// Движение по кругу
			angle += this.AngleStep;

			const { x, y } = this.getPoint(radius, angle)
			point(x, y);
		}
		stroke('white')
	}
	getPoint(radius, angle) {
		// формула перевода градусов в радианы
		const rad = angle * Math.PI / 180

		// формула вычисления координат зная радиус и угол поворота
		const x = 800 + radius * Math.cos(rad);
		const y = 771 + radius * Math.sin(rad);
		return { x, y };
	}
}


const BoundaryVertexX = 0;
const BoundaryVertexY = 0;
class BoundaryVertex {
	constructor(x, y, array, category = defaultCategory, bg = 'black') {
		this.x = x;
		this.y = y;
		this.array = array;
		this.bg = bg;
		let options = {
			friction: 1,
			restitution: 1,
			isStatic: true,
			collisionFilter: {
				category: category
			},
		}
		const centreOfMass = Vertices.centre(this.array);
		this.body = Bodies.fromVertices(centreOfMass.x, centreOfMass.y, this.array, options, true);
		Composite.add(world, this.body);
	}
	show() {
		push();
		translate(0, 0);

		// DRAW
		strokeWeight(1);
		stroke('white')
		noStroke();
		fill(this.bg);
		// fill();
		// END DRAW

		beginShape('tess');
		this.array.forEach(ver => {
			vertex(ver.x, ver.y);
		})
		endShape(CLOSE);
		pop();
	}
}
// const throttleRandomColor = _.throttle(() => { return [random(0, 255), random(0, 250), random(100, 250)]; }, 320);
class Clock extends Ball {
	show() {
		let pos = this.body.position;
		let angle = this.body.angle;
		push();
		translate(pos.x, pos.y);
		rotate(angle);
		rectMode(CENTER);
		strokeWeight(0);
		stroke(0)

		fill(this.color);
		// fill(throttleRandomColor());
		circle(0,0,this.radius * 2);
		pop();
	}
}

const { Engine, World, Bodies, Composite, Vertices, Body, Events, Composites, Mouse, MouseConstraint, Render } = Matter;

let engine;
let world;
let balls = [];
let grounds = [];
let points = [];
const spirals = []

function statue() {
	const bottom = [
		{x:731,y:848},
		{x:733,y:832},
		{x:744,y:820},
		{x:859,y:821},
		{x:868,y:834},
		{x:869,y:852},
	];
	const supBottom = [
		{x:744,y:820},
		{x:745,y:801},
		{x:857,y:801},
		{x:859,y:821},
	]
	const centerBottom = [
		{x:753,y:805},
		{x:747,y:763},
		{x:757,y:749},
		{x:843,y:748},
		{x:851,y:762},
		{x:846,y:806}
	]
	const head = [{x:788,y:661},{x:794,y:654},{x:804,y:654},{x:805,y:669},{x:793,y:671}];
	const gun = [{x:769,y:737},{x:771,y:728},{x:767,y:715},{x:778,y:675},{x:779,y:682},{x:774,y:716},{x:778,y:740}];
	const legs = [{x:780,y:741},{x:789,y:734},{x:791,y:713},{x:822,y:700},{x:822,y:735}];
	const body = [{x:787,y:712},{x:791,y:673},{x:811,y:671},{x:816,y:697},{x:823,y:701}];
	const dog = [{x:825,y:734},{x:828,y:711},{x:837,y:717},{x:841,y:739}];



	const bottomGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, bottom);
	const supBottomGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, supBottom);
	const centerBottomGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, centerBottom, defaultCategory,'rgba(0,0,0,0)');
	const headGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, head, defaultCategory, 'white');
	const gunGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, gun, defaultCategory, 'white');
	const legsGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, legs, defaultCategory, 'white');
	const bodyGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, body, defaultCategory, 'white');
	const dogGround = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, dog, defaultCategory, 'white');

	grounds.push(bottomGround)
	grounds.push(supBottomGround)
	grounds.push(centerBottomGround)
	grounds.push(headGround)
	grounds.push(gunGround)
	grounds.push(legsGround)
	grounds.push(bodyGround)
	grounds.push(dogGround)
}
async function http(modelPath) {
	let url = './models/' + modelPath;
	let response = await fetch(url);
	return await response.json(); // читаем ответ в формате JSON
}

async function createBoundaryVertexComposite(points, category, bg) {
	const ground = new BoundaryVertex(BoundaryVertexX, BoundaryVertexY, points, category, bg);
	grounds.push(ground)
}
async function fetchAndCreate(modelPath, category, color) {
	const points = await http(modelPath)
	createBoundaryVertexComposite(points, category, color);
}
function setup() {
	createCanvas(windowWidth, windowHeight);

	engine = Engine.create();
	world = engine.world;
	balls.push(new Clock(800, 771, 20, 'black', true))
	spirals.push(new Spiral(1 * 360 / 1, 'white'))


	statue()

	fetchAndCreate('east-cabinet-top.json')
	fetchAndCreate('east-cabinet-base.json')

	fetchAndCreate('west-cabinet-top.json')
	fetchAndCreate('west-cabinet-base.json')

	fetchAndCreate('center.json')
	fetchAndCreate('left-field.json')

	fetchAndCreate('right-wall.json')



	fetchAndCreate('west-cabinet-shadow.json', doNotCategory)
	fetchAndCreate('east-cabinet-shadow.json', doNotCategory)

	fetchAndCreate('west-cabinet-door.json', doNotCategory, 'green')
	fetchAndCreate('west-cabinet-corner.json', doNotCategory, 'white')

	fetchAndCreate('east-cabinet-door.json', doNotCategory, 'green')
	fetchAndCreate('east-cabinet-corner.json', doNotCategory, 'white')

	// add mouse control
	const mouse = Mouse.create(Render.canvas);
	const mouseConstraint = MouseConstraint.create(engine, {
		mouse: mouse,
		constraint: {
			stiffness: 0.2,
			render: {
				visible: false
			}
		}
	});

	Composite.add(world, mouseConstraint);
	Render.mouse = mouse;

}

const throttleAddBallToStart = _.throttle(() => { addBall(400, -100) }, 320);
const throttleAddBallToEnd = _.throttle(() => { addBall(1200, -100) }, 320);
// let nextBallX = 0
function draw() {
	background(0);
	Engine.update(engine);
	for (let i = 0; i < balls.length; i++) {
		balls[i].show();
	}
	for (let i = 0; i < grounds.length; i++) {
		grounds[i].show();
	}
	points.forEach((point) => {
		point.draw();
	})
	spirals.forEach(spiral => spiral.update())

	throttleAddBallToStart()
	throttleAddBallToEnd()
}
function addBall(x, y) {
	const size = random(12, 20);
	const color = [random(0, 10), random(100, 255), random(10, 100)];
	balls.push(new Ball(x, y, size, color));
}

const throttleAddBall = _.throttle(() => { addBall(mouseX, mouseY) }, 120);

function mouseMoved(event) {
	if(event.shiftKey) {
		throttleAddBall()
	}
}
function mousePressed(event) {
	if(event.metaKey) {
		toggleFullScreen();
	}
}
function toggleFullScreen() {
	let fs = fullscreen();
	fullscreen(!fs);
}
