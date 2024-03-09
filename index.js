const gover = document.querySelector('#gover')
const winner = document.querySelector('#winner')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player{

	constructor(x,y,r,flipped, color, health,speed){
		this.dead=false
		this.x = x
		this.y = y
		this.r = r
		this.dir = 0
		this.flipped = flipped
		this.color = color
		this.health = health
		this.xspeed = speed
		this.yspeed = 30
	}
	draw() {
		c.fillStyle=this.color
		c.beginPath()
		if (!this.flipped){
		c.moveTo(this.x,this.y)
		c.lineTo(this.x+this.r/2,this.y+this.r/2)
		c.lineTo(this.x-this.r/2,this.y+this.r/2)
		}
		else{
		c.moveTo(this.x,this.y)
		c.lineTo(this.x+this.r/2,this.y-this.r/2)
		c.lineTo(this.x-this.r/2,this.y-this.r/2)
		}
		c.fill()
	}
	move(){
		this.x += this.dir*this.xspeed
		this.draw()
	}
	up(){
		this.y -= this.yspeed

	}
	down(){
		this.y+=this.yspeed
	}

}


class Projectile{
	constructor(x,y,r,color,velocity){
		this.x = x
		
		this.y = y
		this.color = color
		this.r = r
		this.velocity = velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x,this.y,this.r,0,Math.PI*2,false)
		c.fillStyle=this.color
		c.fill()
	}
	move(){
		this.y-=this.velocity
		this.draw()
	}
}
const p1 = new Player(canvas.width/2,3*canvas.height/4,45,false,'white', 10, 7)
const p2 = new Player(canvas.width/2,canvas.height/4,45,true,'purple',10, 7)

bullets = []
function animate(){
	requestAnimationFrame(animate)
	c.clearRect(0,0,canvas.width,canvas.height)
	p1.draw();
	p2.draw();

	if (Math.abs(p1.x - p2.x) <= 25 && Math.abs(p1.y - p2.y)<=15) {console.log("player collision");p1.r+=2;p1.health+=2;p2.health+=2;p2.r+=2 } 

	if (p1.dir!=0)p1.move();
	if (p2.dir!=0)p2.move();
	bullets.forEach((bullet, bulletIndex) =>{
		bullet.draw()
		bullet.move()
		if (Math.abs(p1.x - bullet.x) <= p1.r/2 && (bullet.y>p1.y && bullet.y < p1.y+25)) {console.log("p1 hit"); bullets.splice(bulletIndex,1); p1.health-=1.5;}
		if (Math.abs(p2.x - bullet.x) <= p1.r/2 && (bullet.y<p2.y && bullet.y > p2.y-25)) {console.log("p2 hit"); bullets.splice(bulletIndex,1); p2.health -=1.5;}
		if (p1.health<=0) {p1.color= 'red'; p1.xspeed=0;p1.yspeed=0;p1.dead=true; p2.r=100; gover.style.color="red"; winner.style.color="red"; winner.innerText="Player 2 Wins";gover.classList.add('front');winner.classList.add('front');  gameover();}
		if (p2.health<=0) {p2.color= 'red'; p2.xspeed=0;p2.yspeed=0;p2.dead=true; p1.r=100; gover.style.color="red"; winner.style.color="red"; winner.innerText="Player 1 Wins"; winner.classList.add('front'); gover.classList.add('front'); gameover();}
	})
}
const restart = document.createElement('button')
restart.style.visibility='hidden'
function gameover(){
	canvas.remove()
	const body = document.querySelector("body")
	body.appendChild(restart)
	restart.style.visibility="visible"
	restart.innerText="Restart"
	restart.addEventListener("click", e=>{ location.reload() });
}


addEventListener('keydown',e=>{
	if(e.key == "a") {p1.dir=-1;}
	if(e.key == "d") {p1.dir=1;}
	if(e.key == "ArrowLeft") p2.dir=-1
	if(e.key == "ArrowRight") p2.dir=1

});
addEventListener('keyup', e=>{
	if(e.key == "f" && p1.dead==false) bullets.push(new Projectile(p1.x, p1.y, p1.r/9, 'lime', 10));
	if(e.key == " " && p2.dead ==false) bullets.push(new Projectile(p2.x, p2.y, p2.r/9, 'lime', -10))
	if(e.key == "a") {p1.dir=0;}
	if(e.key == "d") {p1.dir=0;}
	if(e.key == "w") p1.up()
	if(e.key == "s") p1.down()
	if(e.key == "ArrowLeft") p2.dir=0
	if(e.key == "ArrowRight") p2.dir=0
	if(e.key =="ArrowUp") p2.up()
	if(e.key == "ArrowDown") p2.down()


});
const start = document.querySelector("#start")
start.addEventListener("click", e=> { start.remove(); canvas.style.visibility="visible"});
animate()

